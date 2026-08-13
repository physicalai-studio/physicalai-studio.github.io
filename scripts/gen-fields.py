#!/usr/bin/env python3
"""배경 광장(光場) 이미지를 절차적으로 생성한다.

사진이 아니라 수식으로 만든다. 라이선스가 자유롭고, 사이트 듀오톤 색과 정확히 맞출 수 있으며,
필요할 때 파라미터만 바꿔 다시 뽑을 수 있기 때문이다.

생성물:
  home-hero-field.webp     겹친 고리 — 토로이달 발광체 (RING)
  home-contact-field.webp  두 파동원의 간섭 무늬 — 쌍곡선 프린지 (FRINGE)
  about-field.webp         일자 수평파 (PLANE) — About 페이지 배경
  contact-page-field.webp  V 파 · 뱃머리파 (BOW) — Contact 페이지 배경
  services-field.webp      정상파의 마디 (NODE) — Services 페이지 배경
  projects-field.webp      확정된 코어 (RING) — Projects 페이지 배경
  technology-field.webp    중심이 보이는 파면 (WAVEFRONT) — Technology 페이지 배경
  src/app/icon.png         파비콘 — 히어로와 같은 RING 형태를 작은 크기용으로 다시 그린 것
  src/app/apple-icon.png   iOS 홈 화면 아이콘 (같은 그림, 180px)

두 이미지는 같은 초록 램프·그레인 처리를 공유하고 **형상만 다르다**.

형태 언어의 근거는 docs/비주얼_컨셉_파동과_간섭.md 에 있다.
**새 형태를 추가할 때는 그 문서 §2 대응표의 어느 줄을 표현하는지 docstring 에 쓴다.**
못 쓰면 만들지 않는다 — 근거 없는 장식은 가이드 §21 위반이다.

사용법:
    python3 scripts/gen-fields.py
"""

import pathlib
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


def build_icon_field(size: int) -> np.ndarray:
    """겹친 고리 — 아이콘용. 비주얼 컨셉 §4 의 `RING` 을 작은 크기에 맞게 다시 그린 것이다.

    새 형태가 아니라 **같은 형태의 다른 축척**이다. 16px 에서는 히어로의 부드러운 광채가
    회색 얼룩으로 뭉개지므로, 블러를 줄이고 고리를 두껍게 하고 대비를 세게 잡는다.
    그레인도 넣지 않는다 — 작은 크기에서는 노이즈로만 보인다.
    """
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    scale = size * 0.5
    x = (xx - size * 0.5) / scale
    y = (yy - size * 0.5) / scale

    # 바깥 고리 — 아이콘의 뼈대. 히어로보다 두껍게.
    outer = ring(x, y, radius=0.62, width=0.230)
    outer *= angular_weight(x, y, peak_deg=215, spread=0.45)

    # 안쪽 고리 — 히어로 형태를 알아보게 하는 특징. 위치를 살짝 내린다.
    inner_y = y - 0.24
    inner = ring(x, inner_y, radius=0.27, width=0.150)
    inner *= angular_weight(x, inner_y, peak_deg=110, spread=0.40)

    field = np.maximum(outer * 1.00, inner * 0.92)

    # 가장자리를 눌러 원형 실루엣을 만든다 — 사각형 배경이 드러나지 않게.
    vignette = np.exp(-((np.sqrt(x**2 + y**2) / 1.02) ** 4))
    field *= vignette

    return np.clip(np.clip(field, 0.0, 1.0) ** 0.85, 0.0, 1.0)


def render_icon(path: pathlib.Path, size: int) -> None:
    """아이콘 저장. 블러는 크기에 비례해 아주 약하게만 준다."""
    field = build_icon_field(size)

    blurred = Image.fromarray((field * 255).astype(np.uint8), mode="L")
    blurred = blurred.filter(ImageFilter.GaussianBlur(radius=max(1, size // 180)))
    field = np.asarray(blurred, dtype=np.float32) / 255.0

    rgb = apply_ramp(field)
    image = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), mode="RGB")
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG")
    print(f"{path.name:26s} {size}x{size}  {path.stat().st_size / 1024:.1f} KB")


def build_about_field() -> np.ndarray:
    """일자 수평파. 파원이 무한히 먼 **평면파**다.

    뜻(컨셉 §2): 파면 — 다만 곡률이 사라진 상태. 방향이 하나로 정해져 흔들리지 않는다.
    About 은 원칙을 말하는 자리이므로, 퍼져 나가는 파문보다 **가지런한 결**이 맞다.

    구현: `cos(k·y)` 로 수평 띠를 만들고, 아주 약한 기울기를 줘 완전한 평행을 피한다.
    수학적으로 완벽한 평행선은 인쇄물 무늬처럼 보인다.
    """
    x, y = grid(0.55, 0.50, squash=1.0)

    # 아주 약한 기울기 — 완전 수평이면 벽지가 된다.
    phase = y * 13.0 + x * 0.9
    bands = (0.5 + 0.5 * np.cos(phase)) ** 3.4

    # 오른쪽으로 갈수록 또렷해진다. 왼쪽은 카피 자리라 비운다.
    lateral = np.clip((x + 0.55) / 1.25, 0.0, 1.0) ** 1.6
    vertical = np.exp(-((y / 1.15) ** 2.6))

    field = bands * lateral * vertical
    return np.clip(np.clip(field, 0.0, 1.0) ** 1.25 * 0.80, 0.0, 1.0)


def build_contact_page_field() -> np.ndarray:
    """V 파(뱃머리파). 움직이는 파원이 뒤로 남기는 쐐기 모양 파면.

    뜻(컨셉 §2): 파면 — **시작점이 있고 거기서부터 퍼진다.**
    "START A PROJECT" 는 무언가가 출발하는 자리이므로 이 형태를 쓴다.

    구현: 꼭짓점에서 `|y|` 와 `x` 의 선형 결합을 위상으로 삼으면 V 자 파면이 나온다.
    꼭짓점 앞쪽(파원이 아직 지나지 않은 영역)은 비운다.
    """
    x, y = grid(0.30, 0.52, squash=1.0)

    # 쐐기 각도 — 값이 작을수록 V 가 벌어진다.
    slope = 0.62
    phase = (np.abs(y) - x * slope) * 15.0
    wedge = (0.5 + 0.5 * np.cos(phase)) ** 3.0

    # 쐐기 안쪽만 남긴다 — 꼭짓점 앞은 파면이 아직 도달하지 않은 자리다.
    inside = np.clip((x * slope - np.abs(y) + 0.30) / 0.35, 0.0, 1.0)

    decay = np.exp(-((np.sqrt(x**2 + y**2) / 1.55) ** 2.0))

    field = wedge * inside * decay
    return np.clip(np.clip(field, 0.0, 1.0) ** 1.20 * 0.82, 0.0, 1.0)


# ── 본문 페이지 배경 3종 ──────────────────────────────────────────────
# About·Contact 보다 **밝기를 올리고 파동의 중심을 화면 안에** 둔다.
# 배경이 스스로를 드러내되 본문을 이기지는 않는 선(컨셉 §5 — 밝은 화소 20% 이하).

def build_services_field() -> np.ndarray:
    """정상파의 마디. 비주얼 컨셉 §4 의 `NODE`.

    뜻: **해가 사라지는 지점.** 특이 자세 · dead-band.
    Services 01(도달 가능성 검토)이 되는 곳과 안 되는 곳을 가르는 서비스라 이 형태를 쓴다.

    구현: 밝은 장(場)을 깔고 `|cos(kr)|` 로 **어두운 띠를 새긴다** — 마디가 주인공이므로
    빛나는 고리가 아니라 빛이 끊기는 자리가 보여야 한다.
    """
    x, y = grid(0.72, 0.44, squash=1.0)
    distance = np.sqrt(x**2 + y**2)

    # 중심에서 퍼지는 발광 — 마디가 새겨질 바탕.
    glow = np.exp(-((distance / 0.74) ** 1.8))

    # 정상파 — 마디(어두운 띠)가 고정된 반경에 생긴다.
    standing = np.abs(np.cos(distance * 15.0)) ** 0.55

    field = glow * (0.18 + 0.82 * standing)
    return np.clip(np.clip(field, 0.0, 1.0) ** 1.60 * 0.78, 0.0, 1.0)


def build_projects_field() -> np.ndarray:
    """두 수평 직교 간섭파. 90° 로 교차하는 평면파 두 개가 만드는 격자.

    뜻(컨셉 §2): 간섭 — 다만 **두 조건이 동시에 걸리는** 경우다.
    밝은 점은 두 조건이 함께 성립한 지점, 어두운 마디는 하나라도 어긋난 지점이다.
    Projects 는 "무엇이 확인되었는가"를 기록하는 자리이므로 **계측 격자**처럼 읽히는 이 형태가 맞다.

    구현: `cos(kx) · cos(ky)` 의 절댓값. 두 평면파의 곱이 격자 마디를 만든다.
    """
    x, y = grid(0.66, 0.46, squash=1.0)

    wave_x = np.cos(x * 12.0)
    wave_y = np.cos(y * 12.0)
    lattice = np.abs(wave_x * wave_y) ** 1.9

    # 중심에서 멀어질수록 옅어진다 — 격자가 화면을 다 덮으면 방충망이 된다.
    distance = np.sqrt(x**2 + y**2)
    envelope = np.exp(-((distance / 0.95) ** 2.0))

    field = lattice * envelope
    return np.clip(np.clip(field, 0.0, 1.0) ** 1.15 * 0.84, 0.0, 1.0)


def build_technology_field() -> np.ndarray:
    """중심이 보이는 파면. `WAVEFRONT` 를 About 과 달리 **발원점을 화면 안에** 두고 그린다.

    뜻: 가능성이 퍼져 나가는 경계. Technology 는 그 경계가 어디까지인지 말하는 자리다.
    About 은 발원점을 화면 밖으로 밀어 조용하게 썼고, 여기서는 중심을 보여 준다.
    """
    x, y = grid(0.68, 0.46, squash=1.0)
    distance = np.sqrt(x**2 + y**2)
    angle = np.arctan2(y, x)

    arcs = (0.5 + 0.5 * np.cos(distance**0.85 * 22.0)) ** 2.6

    # 발원점 자체의 발광 — 중심이 보여야 "퍼져 나간다"가 읽힌다.
    source = np.exp(-((distance / 0.10) ** 2)) * 0.9

    # 부채꼴을 About 보다 넓게 — 중심이 보이므로 방향성이 이미 확보된다.
    sector = np.exp(
        -((np.arctan2(np.sin(angle - np.deg2rad(190)), np.cos(angle - np.deg2rad(190))) / 1.35) ** 2)
    )
    decay = np.exp(-((distance / 1.15) ** 1.8))

    field = np.maximum(arcs * sector * decay, source)
    return np.clip(np.clip(field, 0.0, 1.0) ** 1.18 * 0.88, 0.0, 1.0)


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
    render("about-field", build_about_field())
    render("contact-page-field", build_contact_page_field())
    render("services-field", build_services_field())
    render("projects-field", build_projects_field())
    render("technology-field", build_technology_field())

    # 파비콘 — Next.js App Router 가 src/app/icon.png 를 자동으로 <link rel="icon"> 으로 만든다.
    app_dir = ROOT / "src" / "app"
    render_icon(app_dir / "icon.png", 256)
    render_icon(app_dir / "apple-icon.png", 180)


if __name__ == "__main__":
    main()
