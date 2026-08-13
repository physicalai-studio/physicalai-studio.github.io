#!/usr/bin/env python3
"""케이스 스터디용 추상 텍스처 20종을 만든다.

`image/concept/` 의 탐색 이미지를 원본으로 삼아 **크롭 · 회전 · 강한 블러 · 초록 램프**를
적용한다. 결과는 원본 형상을 알아볼 수 없을 만큼 뭉개진 추상 텍스처이며,
비주얼 컨셉 문서의 광장(光場) 계열과 같은 색·질감을 갖는다.

**왜 뭉개는가** — 케이스 스터디 자리는 "우리가 한 일"을 보여주는 자리다(디자인 컨셉 §14).
실제 캡처가 없는 동안 그 자리를 채우되, **사진처럼 보이면 안 된다.**
형상이 남아 있으면 보는 사람이 그것을 실적으로 읽는다. 그래서 알아볼 수 없을 때까지 흐린다.
실제 캡처가 준비되면 교체한다(debt-008).

생성물: public/media/case/case-01.webp … case-20.webp (1600×900)

사용법:
    python3 scripts/gen-case-textures.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "image" / "concept"
OUT_DIR = ROOT / "public" / "media" / "case"

WIDTH, HEIGHT = 1600, 900
COUNT = 20
SEED = 20260813

# 사이트 공통 초록 램프. 배경 광장(光場)과 같은 색을 쓴다.
RAMP = [
    (0.00, (3, 9, 7)),
    (0.28, (10, 48, 33)),
    (0.58, (28, 122, 84)),
    (0.82, (92, 208, 148)),
    (1.00, (198, 250, 220)),
]

GRAIN_STRENGTH = 0.070

# 평균 밝기 하한(0~1). 이보다 어두우면 끌어올린다.
MIN_MEAN = 0.055


def apply_ramp(field: np.ndarray) -> np.ndarray:
    positions = np.array([stop for stop, _ in RAMP], dtype=np.float32)
    colors = np.array([color for _, color in RAMP], dtype=np.float32)
    rgb = np.empty((*field.shape, 3), dtype=np.float32)
    for channel in range(3):
        rgb[..., channel] = np.interp(field, positions, colors[:, channel])
    return rgb


def load_sources() -> list[Path]:
    sources = sorted(p for p in SRC_DIR.iterdir() if p.suffix.lower() in (".png", ".webp", ".jpg"))
    if not sources:
        raise SystemExit(f"원본이 없다: {SRC_DIR}")
    return sources


def build_one(source: Path, index: int, rng: np.random.Generator) -> Image.Image:
    with Image.open(source) as image:
        image = image.convert("L")

        # ① 회전 — 같은 원본이라도 방향이 다르면 다른 그림으로 읽힌다.
        angle = float(rng.uniform(0, 360))
        image = image.rotate(angle, resample=Image.BICUBIC, expand=True)

        # ② 크롭 — 원본의 일부만 쓴다. 전체를 쓰면 형상이 남는다.
        scale = float(rng.uniform(0.34, 0.58))
        crop_w = max(int(image.width * scale), 64)
        crop_h = max(int(crop_w * HEIGHT / WIDTH), 64)
        crop_w = min(crop_w, image.width)
        crop_h = min(crop_h, image.height)
        left = int(rng.integers(0, max(image.width - crop_w, 1)))
        top = int(rng.integers(0, max(image.height - crop_h, 1)))
        image = image.crop((left, top, left + crop_w, top + crop_h))

        image = image.resize((WIDTH, HEIGHT), Image.LANCZOS)

        # ③ 강한 블러 — 형상을 알아볼 수 없게 만드는 핵심 단계.
        image = image.filter(ImageFilter.GaussianBlur(radius=float(rng.uniform(28, 52))))

    field = np.asarray(image, dtype=np.float32) / 255.0

    # ④ 대비 정규화 — **직접 계산한다.**
    # `ImageOps.autocontrast` 는 8비트에서 동작하므로, 강하게 흐린 저대비 이미지를
    # 넓게 늘이면 양자화 단차가 그대로 확대되어 밴딩(계단 무늬)이 생긴다.
    # 부동소수점에서 처리하고, **최소 스트레치 폭을 두어** 과도한 확대를 막는다.
    low, high = np.percentile(field, (2.0, 98.0))
    field = np.clip((field - low) / max(high - low, 0.18), 0.0, 1.0)

    # 램프에 넣기 전 미세 디더 — 남은 단차를 흩어 준다.
    field += rng.normal(0.0, 0.004, field.shape).astype(np.float32)

    gamma = float(rng.uniform(1.35, 1.85))
    gain = float(rng.uniform(0.62, 0.80))
    field = np.clip(np.clip(field, 0.0, 1.0) ** gamma * gain, 0.0, 1.0)

    # ⑤ 밝기 하한 — 너무 어두운 장은 목록에서 빈 칸처럼 보인다.
    # 감마·게인을 난수로 뽑다 보면 원본이 어두운 경우 결과가 거의 검정이 된다.
    # 평균 밝기를 재서 하한 아래면 끌어올린다. 상한은 컨셉 §5 가 이미 막고 있다.
    mean = float(field.mean())
    if mean < MIN_MEAN:
        field = np.clip(field * (MIN_MEAN / max(mean, 1e-4)), 0.0, 1.0)

    # ⑥ 비네팅 — 가장자리를 검정으로 떨어뜨려 카드처럼 잘려 보이지 않게 한다.
    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
    nx = (xx - WIDTH * 0.5) / (WIDTH * 0.5)
    ny = (yy - HEIGHT * 0.5) / (HEIGHT * 0.5)
    field *= np.exp(-((np.sqrt((nx / 1.15) ** 2 + (ny / 1.15) ** 2)) ** 3.0))

    # ⑦ 그레인 — 매끈한 그라디언트는 밴딩이 생긴다.
    grain = rng.normal(0.0, 1.0, field.shape).astype(np.float32)
    field = np.clip(field + grain * GRAIN_STRENGTH * (0.10 + field), 0.0, 1.0)

    rgb = apply_ramp(field)
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), mode="RGB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = load_sources()
    rng = np.random.default_rng(SEED)

    total = 0
    for index in range(1, COUNT + 1):
        source = sources[(index - 1) % len(sources)]
        image = build_one(source, index, rng)
        destination = OUT_DIR / f"case-{index:02d}.webp"
        image.save(destination, "WEBP", quality=80, method=6)
        total += destination.stat().st_size
        print(f"{destination.name}  ←  {source.name}  {destination.stat().st_size / 1024:.0f} KB")

    print(f"\n총 {COUNT}장 · {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
