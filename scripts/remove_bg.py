"""Make near-white backgrounds transparent for line-art illustrations."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public"

# input path, output path, lightness threshold (0-255), softness
JOBS = [
    (ROOT / "image copy.png", ROOT / "illust-harvest.png", 245, 12),
    (ROOT / "image.png", ROOT / "illust-farmer.png", 245, 12),
    (ROOT / "1b22108220370a14ca692e4fcb46616d.jpg", ROOT / "illust-garden.png", 245, 12),
]


def remove_light_bg(src: Path, dest: Path, threshold: int = 245, soft: int = 12) -> None:
    img = Image.open(src).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # perceived brightness
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if lum >= threshold:
                pixels[x, y] = (r, g, b, 0)
            elif lum >= threshold - soft:
                # soft edge
                t = (threshold - lum) / soft
                pixels[x, y] = (r, g, b, int(a * t))
            # also punch pure/near-white regardless of slight color cast
            elif r > 250 and g > 250 and b > 250:
                pixels[x, y] = (r, g, b, 0)
    # crop empty margins
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(dest, "PNG")
    print(f"OK {src.name} -> {dest.name} ({img.size[0]}x{img.size[1]})")


def main() -> None:
    for src, dest, thr, soft in JOBS:
        if not src.exists():
            print(f"MISSING {src}")
            continue
        remove_light_bg(src, dest, thr, soft)


if __name__ == "__main__":
    main()
