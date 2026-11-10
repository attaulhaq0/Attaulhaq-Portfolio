"""Refine the alpha of existing black-studio concept illustrations.

Only the explicit generated-art allowlist is processed. Original artwork,
white-studio case covers, photographs, gameplay and the character are untouched.
Requires Pillow and NumPy; no model download or generation request is involved.
"""
from pathlib import Path
import argparse
import hashlib
import json

import numpy as np
from PIL import Image, ImageFilter


RELATIVE_SOURCES = (
    *(f"public/images/home/{slug}-illustration.webp" for slug in (
        "aegisops", "edeviser", "family-os", "cosmo-conqueror", "digital-dynasty")),
    *(f"public/images/workflow/{slug}.webp" for slug in (
        "context", "decision", "build", "review", "outcome")),
    "public/images/toolkit-ecosystem.webp",
)


def record(path, root):
    with Image.open(path) as image:
        return {
            "path": path.relative_to(root).as_posix(),
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "dimensions": list(image.size),
            "bytes": path.stat().st_size,
            "alphaExtrema": list(image.getchannel("A").getextrema()),
        }


def refine(source, existing):
    """Cap the old segmentation with a soft black-matte coverage estimate.

    Hole filling in the earlier segmentation made enclosed studio background
    opaque. Read the untouched source pixels to identify that matte, including
    inside gaps. Retain the earlier shape support; this never expands a cutout.
    Cyan glow needs straight edge color as well as alpha so black studio pixels
    do not turn into a dark outline when composed on a light background.
    """
    rgba = np.asarray(existing.convert("RGBA"), dtype=np.float64)
    original = np.asarray(source.convert("RGB"), dtype=np.float64)
    if source.size != existing.size:
        raise ValueError("Source and cutout dimensions must match")

    # Estimate only the empty studio backdrop from the four source corners.
    corners = np.concatenate((original[:16, :16].reshape(-1, 3),
                              original[:16, -16:].reshape(-1, 3),
                              original[-16:, :16].reshape(-1, 3),
                              original[-16:, -16:].reshape(-1, 3)))
    backdrop = np.median(corners, axis=0)
    foreground = np.maximum(original - backdrop, 0)
    value = foreground.max(axis=2)
    coverage = np.clip((value - 12) / 45, 0, 1)
    coverage = coverage * coverage * (3 - 2 * coverage)
    old_alpha = rgba[:, :, 3] / 255
    alpha = np.minimum(old_alpha, coverage)
    colors = rgba[:, :, :3].copy()
    partial = coverage < .99
    colors[partial] = np.clip(foreground[partial] /
                              np.maximum(coverage[partial, None], .02), 0, 255)

    # Scale the edge neighborhood with source resolution, including 400px tiles.
    radius = max(1, round(existing.width / 240))
    local_value = np.asarray(Image.fromarray(value.clip(0, 255).astype("uint8"))
                             .filter(ImageFilter.MaxFilter(radius * 2 + 1)),
                             dtype=np.float64)
    interior = np.asarray(existing.getchannel("A")
                          .filter(ImageFilter.MinFilter(radius * 2 + 3))) / 255
    cyan = ((foreground[:, :, 1] > foreground[:, :, 0] + 10) &
            (foreground[:, :, 2] > foreground[:, :, 0] + 20) &
            (foreground[:, :, 1] > foreground[:, :, 2] * .28))
    ratio = np.clip(value / np.maximum(local_value, 1), .01, 1)
    edge = (old_alpha > 0) & (interior < .95) & cyan & (ratio < .95)
    alpha[edge] = np.minimum(alpha[edge], old_alpha[edge] * ratio[edge])
    colors[edge] = np.clip(foreground[edge] / ratio[edge, None], 0, 255)
    alpha[alpha < .015] = 0
    colors[alpha == 0] = 0
    result = np.concatenate((colors, alpha[:, :, None] * 255), axis=2)
    image = Image.fromarray(np.rint(result).astype("uint8"))
    metrics = {
        "opaqueStudioPixelsBefore": int(((value < 20) & (old_alpha > .9)).sum()),
        "opaqueStudioPixelsAfter": int(((value < 20) & (alpha > .9)).sum()),
        "cyanEdgePixelsRefined": int(edge.sum()),
        "fullyTransparentPixelFraction": round(float((alpha == 0).mean()), 6),
    }
    return image, metrics


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--destination", type=Path,
                        help="Review directory; omit to replace only allowlisted cutouts")
    args = parser.parse_args()
    root = args.root.resolve()
    previous_manifest = root / "output/toolkit-mini/matte-refinement-manifest.json"
    if previous_manifest.exists():
        previous = json.loads(previous_manifest.read_text(encoding="utf-8"))
        if any(hashlib.sha256((root / item["output"]["path"]).read_bytes()).hexdigest()
               == item["output"]["sha256"] for item in previous["items"]):
            raise SystemExit("Cutouts are already refined. Restore the previousCutout versions recorded in the manifest before reprocessing; repeated matting would erode alpha.")
    items = []
    for relative in RELATIVE_SOURCES:
        source_path = root / relative
        cutout_path = source_path.with_name(source_path.stem + "-transparent.webp")
        before = record(cutout_path, root)
        with Image.open(source_path) as source, Image.open(cutout_path) as existing:
            image, metrics = refine(source, existing)
        destination = ((args.destination / cutout_path.relative_to(root))
                       if args.destination else cutout_path)
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "WEBP", lossless=True, method=6, exact=True)
        with Image.open(destination) as decoded:
            decoded.load()
            assert decoded.mode == "RGBA" and decoded.size == tuple(before["dimensions"])
            assert decoded.getchannel("A").getextrema() == (0, 255)
        assert metrics["opaqueStudioPixelsAfter"] == 0
        items.append({"source": relative, "previousCutout": before,
                      "output": record(destination, args.destination or root),
                      "verification": metrics})
        print(f"{cutout_path.relative_to(root)}: {metrics}", flush=True)

    manifest = {
        "date": "2026-11-10", "apiCalls": 0,
        "method": "Source-corner black matte, soft interior coverage cap and straight cyan edge color; lossless RGBA WebP",
        "originalsChanged": False, "documentaryMediaChanged": False,
        "scope": "Eleven existing generated black-studio illustration cutouts",
        "items": items,
    }
    manifest_path = ((args.destination or root) / "output/toolkit-mini/matte-refinement-manifest.json")
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
