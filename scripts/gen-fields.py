#!/usr/bin/env python3
"""배경 광장(光場) 이미지를 절차적으로 생성한다.

사진이 아니라 수식으로 만든다. 라이선스가 자유롭고, 사이트 듀오톤 색과 정확히 맞출 수 있으며,
필요할 때 파라미터만 바꿔 다시 뽑을 수 있기 때문이다.

생성물:
  home-hero-field.webp     겹친 고리 — 토로이달 발광체
  home-contact-field.webp  두 파동원의 간섭 무늬 — 쌍곡선 프린지

두 이미지는 같은 초록 램프·그레인 처리를 공유하고 **형상만 다르다**.

형태 언어의 근거는 docs/비주얼_컨셉_파동과_간섭.md 에 있다.
**새 형태를 추가할 때는 그 문서 §2 대응표의 어느 줄을 표현하는지 docstring 에 쓴다.**
못 쓰면 만들지 않는다 — 근거 없는 장식은 가이드 §21 위반이다.

사용법:
    python3 scripts/gen-fields.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "media"

WIDTH, HEIGHT = 2400, 1350

# 초록 램프. 그림자는 사이트 배경(#08090a)에 붙이고, 코어만 밝게 뺀다.
RAMP = [
    (0.00, (3, 9, 7)),
    (0.25, (10, 52, 36)),
    (0.55, (30, 132, 90)),
    (0.80, (96, 216, 152)),
    (1.00, (194, 250, 218)),
]

GRAIN_STRENGTH = 0.075
BLUR_RADIUS = 9


def grid(center_x: float, center_y: float, squash: float = 1.04):
    """화면 좌표를 중심 기준 정규화 좌표로 바꾼다."""
    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
    scale = HEIGHT * 0.5
    x = (xx - WIDTH * center_x) / scale
    y = (yy - HEIGHT * center_y) / scale * squash
    return x, y


def ring(x: np.ndarray, y: np.ndarray, radius: float, width: float) -> np.ndarray:
    """중심에서 `radius` 떨어진 원 둘레를 따라 밝은 고리를 만든다."""
    distance = np.sqrt(x**2 + y**2)
    return np.exp(-(((distance - radius) / width) ** 2))


def angular_weight(x: np.ndarray, y: np.ndarray, peak_deg: float, spread: float) -> np.ndarray:
    """고리 둘레에서 특정 방향만 밝게 만든다 — 균일한 도넛은 인공적으로 보인다."""
    angle = np.arctan2(y, x)
    peak = np.deg2rad(peak_deg)
    return 1.0 - spread + spread * (0.5 + 0.5 * np.cos(angle - peak))


def build_hero_field() -> np.ndarray:
    """겹친 두 고리 + 헤일로. 히어로 배경."""
    x, y = grid(0.64, 0.33)

    outer = ring(x, y, radius=0.66, width=0.150)
    outer *= angular_weight(x, y, peak_deg=205, spread=0.68)

    inner_y = y - 0.26
    inner = ring(x, inner_y, radius=0.30, width=0.110)
    inner *= angular_weight(x, inner_y, peak_deg=120, spread=0.60)

    # 코어 헤일로 — 고리 안쪽이 완전히 비면 형태가 납작해 보인다.
    halo = np.exp(-((np.sqrt(x**2 + y**2) / 0.95) ** 2)) * 0.30

    field = outer * 0.92 + inner * 0.80 + halo

    # 가장자리는 완전한 검정으로 떨어뜨려 배경과 이어지게 한다.
    vignette = np.exp(-((np.sqrt(x**2 + (y * 0.62) ** 2) / 1.70) ** 3))
    field *= vignette

    return np.clip(np.clip(field, 0.0, 1.0) ** 1.25 * 0.95, 0.0, 1.0)


def build_contact_field() -> np.ndarray:
    """두 파동원의 간섭 무늬. 마무리 CTA 배경.

    두 점에서 퍼지는 파동의 경로차가 일정한 지점이 밝아진다 — 쌍곡선 프린지가 생긴다.
    고리(히어로)와 같은 재료로 만들지만 형태가 전혀 달라 화면이 반복돼 보이지 않는다.
    """
    # 카피가 좌측에 놓이므로 무늬 전체를 오른쪽으로 민다 — 왼쪽 1/3 은 검정으로 비워 둔다.
    x, y = grid(0.74, 0.5, squash=1.0)

    separation = 0.62
    distance_a = np.sqrt((x + separation) ** 2 + y**2)
    distance_b = np.sqrt((x - separation) ** 2 + y**2)

    # 경로차로 만든 프린지. 밖으로 갈수록 간격이 벌어지도록 지수를 살짝 준다.
    path_difference = distance_a - distance_b
    fringe = 0.5 + 0.5 * np.cos(path_difference * 11.0)
    fringe = fringe**2.2  # 밝은 띠를 가늘게 — 넓으면 텍스트를 방해한다

    # 두 파동원 자체의 발광.
    sources = np.exp(-((distance_a / 0.16) ** 2)) * 0.55 + np.exp(-((distance_b / 0.16) ** 2)) * 0.55

    # 프린지가 화면 전체를 덮지 않도록 가운데를 중심으로 감싼다.
    envelope = np.exp(-((np.sqrt((x / 0.98) ** 2 + (y / 0.70) ** 2)) ** 2.4))

    field = (fringe * 0.85 + sources) * envelope

    return np.clip(np.clip(field, 0.0, 1.0) ** 1.35 * 0.88, 0.0, 1.0)


def apply_ramp(field: np.ndarray) -> np.ndarray:
    """스칼라 밝기장을 초록 램프 색으로 매핑한다."""
    positions = np.array([stop for stop, _ in RAMP], dtype=np.float32)
    colors = np.array([color for _, color in RAMP], dtype=np.float32)

    rgb = np.empty((*field.shape, 3), dtype=np.float32)
    for channel in range(3):
        rgb[..., channel] = np.interp(field, positions, colors[:, channel])
    return rgb


def render(name: str, field: np.ndarray) -> None:
    # 블러로 번지게 한다. 수식 그대로면 경계가 너무 또렷해 CG 티가 난다.
    blurred = Image.fromarray((field * 255).astype(np.uint8), mode="L")
    blurred = blurred.filter(ImageFilter.GaussianBlur(radius=BLUR_RADIUS))
    field = np.asarray(blurred, dtype=np.float32) / 255.0

    # 필름 그레인 — 매끈한 그라디언트는 CG 티가 나고 밴딩도 생긴다.
    rng = np.random.default_rng(20260813)
    grain = rng.normal(0.0, 1.0, field.shape).astype(np.float32)
    field = np.clip(field + grain * GRAIN_STRENGTH * (0.12 + field), 0.0, 1.0)

    rgb = apply_ramp(field)
    image = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), mode="RGB")

    destination = OUT_DIR / f"{name}.webp"
    image.save(destination, "WEBP", quality=82, method=6)
    print(f"{destination.name:26s} {image.width}x{image.height}  {destination.stat().st_size / 1024:.1f} KB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    render("home-hero-field", build_hero_field())
    render("home-contact-field", build_contact_field())


if __name__ == "__main__":
    main()
