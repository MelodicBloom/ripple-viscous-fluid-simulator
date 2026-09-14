#!/usr/bin/env python3
"""Compose Wake cover + banner from the user's own fluid-art references."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps
import numpy as np

REF = Path("/workspace/artifacts/refs")
OUT = Path("/workspace/.grok")

FONT = "/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf"
FONT_SMALL = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"


def cover_crop(im: Image.Image, w: int, h: int, fx: float = 0.5, fy: float = 0.5) -> Image.Image:
    im = im.convert("RGB")
    scale = max(w / im.width, h / im.height)
    nw, nh = max(1, int(im.width * scale + 0.5)), max(1, int(im.height * scale + 0.5))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = int((nw - w) * fx)
    top = int((nh - h) * fy)
    left = max(0, min(left, nw - w))
    top = max(0, min(top, nh - h))
    return im.crop((left, top, left + w, top + h))


def linear_ramp(w: int, h: int, horizontal: bool, reverse: bool = False) -> Image.Image:
    if horizontal:
        t = np.linspace(0.0, 1.0, w, dtype=np.float32)
        if reverse:
            t = 1.0 - t
        arr = np.broadcast_to(t * 255.0, (h, w))
    else:
        t = np.linspace(0.0, 1.0, h, dtype=np.float32)
        if reverse:
            t = 1.0 - t
        arr = np.broadcast_to((t * 255.0)[:, None], (h, w))
    im = Image.fromarray(arr.astype(np.uint8), "L")
    return im.filter(ImageFilter.GaussianBlur(max(w, h) * 0.03))


def radial_vignette(w: int, h: int, inner: float = 0.35, outer: float = 1.05) -> Image.Image:
    ys, xs = np.ogrid[-1 : 1 : h * 1j, -1 : 1 : w * 1j]
    r = np.sqrt(xs * xs + ys * ys)
    t = np.clip((r - inner) / max(outer - inner, 1e-6), 0, 1)
    arr = (t * t * 255.0).astype(np.uint8)
    return Image.fromarray(arr, "L").filter(ImageFilter.GaussianBlur(24))


def ellipse_mask(size: tuple[int, int], box: tuple[int, int, int, int], blur: int) -> Image.Image:
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).ellipse(box, fill=255)
    return m.filter(ImageFilter.GaussianBlur(blur))


def punch_text(
    canvas: Image.Image,
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: Image.Image,
    gold: Image.Image,
    cx: float,
    cy: float,
    stroke: int,
) -> None:
    w, h = canvas.size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = int(w * cx - tw / 2 - bbox[0])
    y = int(h * cy - th / 2 - bbox[1])
    draw.text((x, y), text, font=font, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.6))

    outline = mask.filter(ImageFilter.MaxFilter(stroke * 2 + 1))
    outline = ImageChops.subtract(outline, mask)
    glow = mask.filter(ImageFilter.GaussianBlur(28))

    dark = Image.new("RGB", (w, h), (6, 7, 10))
    canvas.paste(Image.composite(dark, canvas, glow.point(lambda p: int(p * 0.78))), (0, 0))
    canvas.paste(Image.composite(gold, canvas, outline), (0, 0))
    canvas.paste(Image.composite(fill, canvas, mask), (0, 0))

    # Specular ridge along the top of the glyphs
    highlight = Image.new("RGB", (w, h), (255, 248, 230))
    ridge = mask.filter(ImageFilter.GaussianBlur(1))
    shift = Image.new("L", (w, h), 0)
    shift.paste(ridge, (0, -max(2, stroke // 2)))
    ridge = ImageChops.subtract(ridge, shift)
    canvas.paste(Image.composite(highlight, canvas, ridge.point(lambda p: int(p * 0.55))), (0, 0))


def tagline(canvas: Image.Image, text: str, font: ImageFont.FreeTypeFont, cx: float, cy: float) -> None:
    w, h = canvas.size
    draw = ImageDraw.Draw(canvas)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = int(w * cx - tw / 2 - bbox[0])
    y = int(h * cy - th / 2 - bbox[1])
    draw.text((x + 1, y + 1), text, font=font, fill=(10, 12, 16))
    draw.text((x, y), text, font=font, fill=(232, 226, 210))


def build_surface(w: int, h: int) -> tuple[Image.Image, Image.Image, Image.Image]:
    emerald = cover_crop(Image.open(REF / "emerald.jpg"), w, h, 0.45, 0.4)
    holo = cover_crop(Image.open(REF / "holographic.jpg"), w, h, 0.55, 0.45)
    kin = cover_crop(Image.open(REF / "kintsugi.jpg"), w, h, 0.5, 0.55)
    drip = cover_crop(Image.open(REF / "chrome-drip.jpg"), w, h, 0.5, 0.0)
    drops = cover_crop(Image.open(REF / "droplets.jpg"), w, h, 0.5, 0.75)
    bub = Image.open(REF / "bubbles.jpg").convert("RGB")

    surface = Image.blend(emerald, holo, 0.38)
    surface = ImageEnhance.Color(surface).enhance(1.25)
    surface = ImageEnhance.Contrast(surface).enhance(1.12)

    gold_fade = linear_ramp(w, h, horizontal=True, reverse=False)
    gold_fade = ImageChops.multiply(gold_fade, linear_ramp(w, h, horizontal=False, reverse=True))
    surface = Image.composite(kin, surface, gold_fade.point(lambda p: int(p * 0.72)))

    top_fade = linear_ramp(w, h, horizontal=False, reverse=True).point(lambda p: int(p * 0.78))
    # keep drips in the upper band
    top_fade = top_fade.point(lambda p: min(255, int(p * 1.4)) if p > 90 else int(p * 0.35))
    surface = Image.composite(drip, surface, top_fade)

    bot = linear_ramp(w, h, horizontal=False, reverse=False).point(lambda p: int(p * 0.55))
    surface = Image.composite(drops, surface, bot)

    bw, bh = int(w * 0.46), int(h * 0.62)
    bub_c = cover_crop(bub, bw, bh, 0.5, 0.55)
    bx, by = int(w * 0.56), int(h * 0.42)
    em = ellipse_mask((w, h), (bx, by, bx + bw, by + bh), 48)
    layer = Image.new("RGB", (w, h))
    layer.paste(bub_c, (bx, by))
    surface = Image.composite(layer, surface, em.point(lambda p: int(p * 0.85)))

    vig = radial_vignette(w, h, inner=0.42, outer=1.12)
    dim = ImageEnhance.Brightness(surface).enhance(0.42)
    surface = Image.composite(dim, surface, vig)

    chrome_fill = cover_crop(Image.open(REF / "chrome-drip.jpg"), w, h, 0.48, 0.15)
    chrome_fill = ImageEnhance.Color(chrome_fill).enhance(1.45)
    chrome_fill = ImageEnhance.Contrast(chrome_fill).enhance(1.28)
    chrome_fill = ImageEnhance.Brightness(chrome_fill).enhance(1.18)
    gold_fill = cover_crop(Image.open(REF / "kintsugi.jpg"), w, h, 0.4, 0.5)
    gold_fill = ImageEnhance.Color(gold_fill).enhance(1.4)
    return surface, chrome_fill, gold_fill


def make_cover() -> Image.Image:
    w, h = 2400, 1260
    surface, chrome, gold = build_surface(w, h)
    font = ImageFont.truetype(FONT, 340)
    punch_text(surface, "WAKE", font, chrome, gold, 0.50, 0.46, stroke=11)
    small = ImageFont.truetype(FONT_SMALL, 52)
    tagline(surface, "oil  ·  film  ·  light", small, 0.50, 0.68)
    return surface.resize((1200, 630), Image.Resampling.LANCZOS)


def make_banner() -> Image.Image:
    w, h = 2400, 528
    surface, chrome, gold = build_surface(w, h)
    font = ImageFont.truetype(FONT, 210)
    punch_text(surface, "WAKE", font, chrome, gold, 0.28, 0.42, stroke=8)
    small = ImageFont.truetype(FONT_SMALL, 36)
    tagline(surface, "oil  ·  film  ·  light", small, 0.28, 0.72)
    return surface.resize((1200, 264), Image.Resampling.LANCZOS)


def save_jpeg(im: Image.Image, path: Path, quality: int = 90) -> None:
    im = im.convert("RGB")
    im.save(path, "JPEG", quality=quality, optimize=True, subsampling=1)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    cover = make_cover()
    banner = make_banner()
    save_jpeg(cover, OUT / "og-stage.jpg", 90)
    save_jpeg(banner, OUT / "x-banner-stage.jpg", 90)
    print("cover", cover.size, (OUT / "og-stage.jpg").stat().st_size // 1024, "KB")
    print("banner", banner.size, (OUT / "x-banner-stage.jpg").stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
