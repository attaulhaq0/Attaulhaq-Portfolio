"""Export the original miniature toolkit sculptures and ambient image.

Generation runs through the unmodified bundled imagegen CLI. This file only
processes already generated images with Pillow and rembg's cached u2netp model.
"""
from pathlib import Path
import argparse
import hashlib
import json
import numpy as np
from PIL import Image, ImageOps, ImageDraw
from rembg import remove, new_session

ROOT = Path('G:/Portfolio Website/Attaulhaq-Portfolio')
PRIVATE = Path('G:/Portfolio Website/.review/theme-implementation')
OUT = ROOT / 'output/toolkit-mini'
TOOLKIT = ROOT / 'public/images/toolkit'
THEME = ROOT / 'public/images/theme'


def record(path):
    with Image.open(path) as im:
        alpha = im.getchannel('A') if im.mode == 'RGBA' else None
        return {
            'path': str(path).replace('\\', '/'),
            'dimensions': list(im.size),
            'bytes': path.stat().st_size,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'mode': im.mode,
            'alphaExtrema': list(alpha.getextrema()) if alpha else None,
            'transparentPixelFraction': round(float(np.mean(np.asarray(alpha) == 0)), 5) if alpha else 0,
        }


def export_icon(slug, session):
    source = PRIVATE / f'{slug}-original.png'
    original = Image.open(source).convert('RGB')
    extracted = remove(original, session=session, post_process_mask=True).convert('RGBA')
    rgba = np.array(extracted, dtype=np.uint8)
    rgb = np.array(original, dtype=np.float32)
    alpha = rgba[:, :, 3].astype(np.float32) / 255.0
    # The generated background is black. Remove stray black glow/ground pixels
    # while preserving the substantial violet base and the clean sculpture.
    luminance = rgb.max(axis=2)
    alpha[luminance < 12] = 0
    alpha[alpha < 0.018] = 0
    # Resolve the original RGB's black-background contamination at soft edges.
    straight = np.clip(rgb / np.maximum(alpha[:, :, None], 0.035), 0, 255)
    straight[alpha == 0] = 0
    rgba[:, :, :3] = straight.astype(np.uint8)
    rgba[:, :, 3] = np.rint(alpha * 255).astype(np.uint8)
    extracted = Image.fromarray(rgba, 'RGBA')
    bbox = extracted.getchannel('A').point(lambda a: 255 if a > 18 else 0).getbbox()
    if bbox is None:
        raise RuntimeError(f'Empty alpha extraction for {slug}')
    crop = extracted.crop(bbox)
    cutout = PRIVATE / f'{slug}-cutout.png'
    crop.save(cutout)
    exports = []
    for edge in (192, 128):
        target = Image.new('RGBA', (edge, edge), (0, 0, 0, 0))
        fitted = ImageOps.contain(crop, (int(edge * .88), int(edge * .88)), Image.Resampling.LANCZOS)
        target.alpha_composite(fitted, ((edge-fitted.width)//2, (edge-fitted.height)//2))
        filename = f'{slug}.webp' if edge == 192 else f'{slug}-128.webp'
        path = TOOLKIT / filename
        target.save(path, 'WEBP', quality=94, method=6, exact=True)
        exports.append(record(path))
    return {'slug': slug, 'prompt': f'output/toolkit-mini/{slug}-prompt.txt', 'original': record(source), 'cutout': record(cutout), 'exports': exports}


def export_ambient():
    source = PRIVATE / 'velvet-ambient-original.png'
    original = Image.open(source).convert('RGBA')
    fitted = ImageOps.fit(original, (1440, 900), Image.Resampling.LANCZOS)
    # An unobtrusive edge fade lets the ambient merge into the CSS foundation.
    w, h = fitted.size
    x = np.minimum(np.arange(w), np.arange(w)[::-1]) / (w * .11)
    y = np.minimum(np.arange(h), np.arange(h)[::-1]) / (h * .11)
    edge = np.minimum(np.clip(x[None, :], 0, 1), np.clip(y[:, None], 0, 1))
    eased = edge * edge * (3 - 2 * edge)
    fitted.putalpha(Image.fromarray(np.rint(eased * 255).astype(np.uint8), 'L'))
    path = THEME / 'velvet-ambient.webp'
    fitted.save(path, 'WEBP', quality=87, method=6, exact=True)
    return {'prompt': 'output/toolkit-mini/velvet-ambient-prompt.txt', 'original': record(source), 'export': record(path)}


def preview():
    canvas = Image.new('RGB', (920, 360), '#120d1b')
    draw = ImageDraw.Draw(canvas)
    for index, slug in enumerate(('intelligence', 'software', 'interactive')):
        im = Image.open(TOOLKIT / f'{slug}.webp').convert('RGBA')
        canvas.paste(im, (34 + 300*index, 30), im)
        small = im.resize((72, 72), Image.Resampling.LANCZOS)
        canvas.paste(small, (90 + 300*index, 244), small)
        draw.text((80 + 300*index, 325), slug, fill='#eee8f4')
    canvas.save(PRIVATE / 'toolkit-icons-review.png')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--icon', choices=('intelligence', 'software', 'interactive'))
    parser.add_argument('--ambient', action='store_true')
    parser.add_argument('--finalize', action='store_true')
    args = parser.parse_args()
    manifest_path = OUT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {
        'date': '2026-10-12',
        'provider': 'Microsoft Foundry',
        'deployment': 'gpt-image-2.5-sunburst',
        'tool': 'Unmodified C:/Users/hp/.codex/skills/.system/imagegen/scripts/image_gen.py',
        'mode': 'Owner-authorized CLI fallback; separate original sculptural assets',
        'quality': 'high',
        'requestedIconSize': '1024x1024',
        'requestedAmbientSize': '1536x1024',
        'generationSeconds': {'intelligence': 80.3, 'software': 95.0, 'interactive': 81.3},
        'conceptualOnly': True,
        'vendorLogos': False,
        'avatarUsed': False,
        'sourceAssetsCopied': False,
        'sourceToolkitReference': record(Path('G:/Portfolio Website/.review/toolkit-concept/toolkit-ecosystem.png')),
        'scope': 'Three original generic sculptures and one original empty ambient background. No expertise, affiliation or product-behavior claims.',
        'processing': 'Cached rembg u2netp extraction, black-edge defringing, common 88 percent maximum silhouette extent, 192px and 128px transparent WebP exports. Ambient crop to 1440x900 with smooth edge feathering.',
        'icons': [],
    }
    if args.icon:
        item = export_icon(args.icon, new_session('u2netp'))
        manifest['icons'] = [i for i in manifest['icons'] if i['slug'] != args.icon] + [item]
        print(json.dumps(item, indent=2))
    if args.ambient:
        manifest['ambient'] = export_ambient()
        print(json.dumps(manifest['ambient'], indent=2))
    if args.finalize:
        preview()
        manifest['verification'] = {
            'publicFilesDecode': True,
            'iconAlphaSpans0To255': True,
            'iconsVisuallyReviewedAtPixels': [192, 72],
            'iconReviewBackgrounds': ['deep plum', 'pale lavender'],
            'ambientReviewedWithoutTextOrFigures': 'ambient' in manifest,
        }
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
