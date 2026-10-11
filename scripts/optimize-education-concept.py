"""Crop reference padding, strip audio and blend a short Sora concept loop."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
import hashlib
import json
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "output/sora/raw/education-concept.mp4"
OUTPUT = ROOT / "public/media/education-concept.mp4"
QA = ROOT / "output/sora/qa"
QA.mkdir(parents=True, exist_ok=True)
if OUTPUT.exists():
    raise SystemExit("Production output already exists; refusing to overwrite it.")

reader = imageio_ffmpeg.read_frames(str(SOURCE), pix_fmt="rgb24")
meta = next(reader)
width, height = meta["size"]
frames = [Image.frombytes("RGB", (width, height), data) for data in reader]
if (width, height) != (1280, 720):
    raise SystemExit(f"Unexpected source dimensions: {width}x{height}")
frames = [frame.crop((100, 0, 1180, 720)) for frame in frames]
fps = meta["fps"]
overlap = round(fps * 0.3)
if len(frames) <= overlap * 2:
    raise SystemExit("Source is too short for a wrap blend.")

writer = imageio_ffmpeg.write_frames(
    str(OUTPUT), (1080, 720), fps=fps, codec="libx264",
    pix_fmt_in="rgb24", pix_fmt_out="yuv420p", quality=None,
    macro_block_size=1,
    output_params=["-crf", "24", "-preset", "medium", "-movflags", "+faststart", "-an"],
)
writer.send(None)
processed = []
for index in range(overlap, len(frames)):
    frame = frames[index]
    if index >= len(frames) - overlap:
        blend_index = index - (len(frames) - overlap)
        frame = Image.blend(frame, frames[blend_index], (blend_index + 1) / overlap)
    processed.append(frame)
    writer.send(frame.tobytes())
writer.close()

sheet = Image.new("RGB", (1200, 846), "#111017")
draw = ImageDraw.Draw(sheet)
for index in range(6):
    frame_index = round(index * (len(processed) - 1) / 5)
    frame = processed[frame_index].copy()
    frame.thumbnail((400, 267), Image.Resampling.LANCZOS)
    x, y = (index % 3) * 400, (index // 3) * 423
    sheet.paste(frame, (x, y))
    draw.text((x + 12, y + 277), f"Sample {index + 1}: {frame_index / fps:.2f}s", fill="#c8b5df")
    processed[frame_index].save(QA / f"education-concept-sample-{index + 1}.jpg", quality=92)
sheet.save(QA / "education-concept-contact-sheet.jpg", quality=92)

manifest = {
    "source": str(SOURCE.relative_to(ROOT)),
    "output": str(OUTPUT.relative_to(ROOT)),
    "sourceDimensions": [width, height],
    "productionDimensions": [1080, 720],
    "crop": [100, 0, 1180, 720],
    "fps": fps,
    "rawFrames": len(frames),
    "productionFrames": len(processed),
    "durationSeconds": len(processed) / fps,
    "wrapBlendSeconds": overlap / fps,
    "audio": "Removed; no audio stream is passed to writer.",
    "productionBytes": OUTPUT.stat().st_size,
    "productionSha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
    "samples": "output/sora/qa/education-concept-contact-sheet.jpg",
    "limit": "Ending blend reduces wrap discontinuity; no claim of pixel-identical loop boundary.",
}
(ROOT / "output/sora/education-concept-processing.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(json.dumps(manifest))
