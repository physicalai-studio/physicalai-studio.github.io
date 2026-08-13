#!/usr/bin/env python3
"""콘셉트 이미지 — 성운 위에 떠 있는 고리 구조물을 절차적으로 생성한다.

레퍼런스 이미지를 복제하지 않는다. 같은 어법(거대한 고리 구조물 · 성운 · 별)을
**수식으로 다시 계산**해 만든다. 그래서 저작권 문제가 없고, 사이트의 초록 램프와
정확히 같은 색을 쓰며, 파라미터만 바꿔 다시 뽑을 수 있다.

형태 언어상으로는 비주얼 컨셉 §4 의 `RING`(가능성의 장)을 구조물로 옮긴 변형이다.
채택 여부는 별도 판단 — 지금은 후보 자산으로 `image/` 에만 둔다.

구성
  ① 별      — 희소한 점광원 + 약한 블룸
  ② 성운    — fBm(다중 옥타브 값잡음)을 곡선으로 눌러 구름으로
  ③ 주체    — ring(고리 구조물) · burst(방사 광선) · fractal(줄리아 집합) 중 택1
  ④ 합성    — 초록 램프로 매핑, 필름 그레인

**생성물은 덮어쓰지 않는다.** 실행할 때마다 `image/concept/` 에 새 번호로 쌓인다 —
탐색 과정을 지우지 않기 위해서다. 파일명에 시드가 들어가 언제든 같은 그림을 다시 만들 수 있다.

사용법:
    python3 scripts/gen-concept.py                    # 기본값으로 한 장
    python3 scripts/gen-concept.py --seed 7           # 별·성운 배치를 바꿔서
    python3 scripts/gen-concept.py --teeth 220 --gap 0.6   # 구조를 바꿔서
    python3 scripts/gen-concept.py --count 4          # 시드를 바꿔가며 여러 장
"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "image" / "concept"

WIDTH, HEIGHT = 2400, 1600
DEFAULT_SEED = 20260813

# 사이트 공통 초록 램프. 구조물이 램프 최상단(거의 흰 초록)에 닿게 노출을 잡는다.
RAMP = [
    (0.00, (3, 9, 7)),
    (0.22, (9, 44, 31)),
    (0.48, (26, 116, 80)),
    (0.72, (92, 208, 148)),
    (1.00, (214, 252, 232)),
]

GRAIN_STRENGTH = 0.038


def value_noise(rng: np.random.Generator, octaves: int, base_freq: int = 3) -> np.ndarray:
    """다중 옥타브 값잡음(fBm). 성운의 뭉게뭉게한 결을 만든다."""
    total = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
    amplitude, frequency, norm = 1.0, base_freq, 0.0

    for _ in range(octaves):
        cell = rng.random((frequency, frequency)).astype(np.float32)
        upscaled = Image.fromarray((cell * 255).astype(np.uint8)).resize(
            (WIDTH, HEIGHT), Image.BICUBIC
        )
        total += np.asarray(upscaled, dtype=np.float32) / 255.0 * amplitude
        norm += amplitude
        amplitude *= 0.55
        frequency *= 2

    return total / norm


def build_stars(rng: np.random.Generator) -> np.ndarray:
    """희소한 점광원. 대부분 아주 어둡고 소수만 밝다."""
    stars = np.zeros(HEIGHT * WIDTH, dtype=np.float32)
    count = 9000
    positions = rng.integers(0, stars.size, count)
    # 지수 분포로 밝기를 주면 밝은 별이 드물게 나온다 — 실제 성도(星圖)에 가깝다.
    stars[positions] = np.clip(rng.exponential(0.34, count), 0, 1).astype(np.float32)
    stars = stars.reshape(HEIGHT, WIDTH)

    bloomed = Image.fromarray((stars * 255).astype(np.uint8), mode="L")
    bloomed = bloomed.filter(ImageFilter.GaussianBlur(radius=0.8))
    return np.asarray(bloomed, dtype=np.float32) / 255.0


def build_nebula(rng: np.random.Generator) -> np.ndarray:
    """성운. 잡음을 곡선으로 눌러 밝은 부분만 남기고, 큰 스케일 봉투로 한쪽에 몰아준다."""
    noise = value_noise(rng, octaves=7, base_freq=4)

    # 임계값을 높게 잡아 **성기게** 남긴다. 전면을 덮으면 배경이 아니라 벽지가 된다.
    clouds = np.clip((noise - 0.47) * 3.0, 0.0, 1.0) ** 1.7

    # 결을 한 겹 더 — 잡음을 곱해 뭉친 덩어리를 찢어 놓는다.
    wisp = np.clip((value_noise(rng, octaves=5, base_freq=8) - 0.40) * 2.2, 0.0, 1.0)
    clouds *= 0.35 + 0.65 * wisp

    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
    # 고리 중심(0.40, 0.50)에 맞춰 성운을 둔다 — 구조물 뒤에서 빛나는 배경이 되게.
    x = (xx - WIDTH * 0.40) / (HEIGHT * 0.5)
    y = (yy - HEIGHT * 0.50) / (HEIGHT * 0.5)
    envelope = np.exp(-((np.sqrt((x / 1.05) ** 2 + (y / 0.95) ** 2)) ** 2.4))

    return clouds * envelope * 0.88


def next_output_path(form: str, seed: int) -> Path:
    """다음 빈 번호를 찾아 경로를 만든다. **기존 파일을 덮어쓰지 않는다.**"""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    numbers = []
    for existing in OUT_DIR.glob(f"{form}-*"):
        parts = existing.stem.split("-")
        if len(parts) > 1 and parts[1].isdigit():
            numbers.append(int(parts[1]))
    index = max(numbers, default=0) + 1
    return OUT_DIR / f"{form}-{index:03d}-seed{seed}.webp"


def build_structure(
    rng: np.random.Generator, teeth_count: int, band_radius: float, gap_half: float
) -> np.ndarray:
    """고리 구조물. 띠 + 방사형 돌기 + 세그먼트 변조.

    레퍼런스처럼 **열린 고리**로 만든다 — 오른쪽이 끊겨 있어야 평면 도넛이 아니라
    거대한 구조물의 일부로 읽힌다.
    """
    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
    x = (xx - WIDTH * 0.40) / (HEIGHT * 0.5)
    y = (yy - HEIGHT * 0.5) / (HEIGHT * 0.5)

    radius = np.sqrt(x**2 + y**2)
    angle = np.arctan2(y, x)

    # ① 주 띠 — 얇은 선 세 겹. 한 덩어리보다 구조물처럼 읽힌다.
    band = np.zeros_like(radius)
    for offset, width, weight in ((-0.018, 0.006, 0.75), (0.0, 0.011, 1.00), (0.020, 0.007, 0.80)):
        band = np.maximum(band, np.exp(-(((radius - band_radius - offset) / width) ** 2)) * weight)

    # ② 방사형 돌기 — 바깥으로 뻗은 구조. 길이를 각도별로 달리해 규칙성을 깬다.
    teeth_profile = np.abs(np.cos(angle * teeth_count * 0.5)) ** 9
    # 저주파 잡음으로 돌기 길이를 변조 — 구간마다 밀도가 달라 보인다.
    length_mod = 0.55 + 0.45 * (0.5 + 0.5 * np.cos(angle * 7.0 + 1.3))
    # 돌기는 띠 **바깥의 좁은 고리 안**에만 존재해야 한다.
    # clip 으로 한쪽만 자르면 반대편이 전부 채워져 화면을 가로지르는 광선이 된다.
    teeth_extent = np.exp(-(((radius - (band_radius + 0.042)) / (0.038 * length_mod)) ** 2))
    teeth = teeth_profile * teeth_extent

    # ③ 짧은 안쪽 돌기 — 위상을 어긋나게 해 층이 생기게 한다.
    inner_teeth_profile = np.abs(np.cos(angle * teeth_count * 0.5 + 0.8)) ** 12
    inner_teeth_extent = np.exp(-(((radius - (band_radius - 0.038)) / 0.020) ** 2))
    inner_teeth = inner_teeth_profile * inner_teeth_extent * 0.7

    structure = np.maximum(band, np.maximum(teeth * 0.98, inner_teeth))

    # ④ 세그먼트 변조 — 둘레를 따라 밝기를 불규칙하게. 균일하면 CG 티가 난다.
    segments = np.interp(
        (angle + np.pi) / (2 * np.pi) * 512.0,
        np.arange(513),
        np.concatenate([rng.random(512) * 0.55 + 0.45, [0.5]]).astype(np.float32),
    )
    structure *= segments

    # ⑤ 열린 구간 — 오른쪽 일부를 지운다.
    gap_center = 0.0
    angular_distance = np.abs(np.arctan2(np.sin(angle - gap_center), np.cos(angle - gap_center)))
    structure *= np.clip((angular_distance - gap_half) / 0.30, 0.0, 1.0)

    # ⑥ 림 라이트 — 안쪽(성운 쪽)이 더 밝게. 광원이 어디 있는지 알려준다.
    rim = 0.55 + 0.45 * (0.5 + 0.5 * np.cos(angle - np.deg2rad(200)))
    structure *= rim

    return np.clip(structure, 0.0, 1.0)


def build_burst(
    rng: np.random.Generator, teeth_count: int, band_radius: float, gap_half: float
) -> np.ndarray:
    """방사 광선 + 고리. 중심에서 뻗어 화면을 가로지르는 빛살.

    고리 구조물(`build_structure`)을 그리다 실수로 나온 형태를 **의도된 형태로 다시 만든 것**이다.
    돌기를 고리 바깥 좁은 띠에 가두는 대신 반경 전체로 풀면 광선이 된다.
    비주얼 컨셉 §2 의 **파면(wavefront)** — 가능성이 중심에서 퍼져 나가는 경계 — 에 대응한다.
    """
    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
    x = (xx - WIDTH * 0.40) / (HEIGHT * 0.5)
    y = (yy - HEIGHT * 0.5) / (HEIGHT * 0.5)

    radius = np.sqrt(x**2 + y**2)
    angle = np.arctan2(y, x)

    # ① 광선 — 각도 주기 함수를 반경 제한 없이 쓴다. 이것이 실수였고, 그래서 좋았다.
    rays = np.abs(np.cos(angle * teeth_count * 0.5)) ** 9

    # 중심 근처는 광선이 뭉쳐 타 버리므로 눌러 준다.
    core_fade = np.clip(radius / 0.14, 0.0, 1.0) ** 1.4
    # 바깥으로 갈수록 서서히 옅어진다 — 끝이 잘리면 벽지처럼 보인다.
    outward_fade = np.exp(-((radius / 1.85) ** 2.6))
    rays = rays * core_fade * outward_fade

    # ② 고리 — 광선 위에 얹히는 밝은 테두리.
    band = np.zeros_like(radius)
    for offset, width, weight in ((-0.018, 0.006, 0.75), (0.0, 0.012, 1.00), (0.020, 0.007, 0.80)):
        band = np.maximum(band, np.exp(-(((radius - band_radius - offset) / width) ** 2)) * weight)

    field = np.maximum(band, rays * 0.62)

    # ③ 세그먼트 변조 · 열린 구간 · 림 라이트 — 고리 구조물과 같은 마감.
    segments = np.interp(
        (angle + np.pi) / (2 * np.pi) * 512.0,
        np.arange(513),
        np.concatenate([rng.random(512) * 0.45 + 0.55, [0.5]]).astype(np.float32),
    )
    field *= segments

    angular_distance = np.abs(np.arctan2(np.sin(angle), np.cos(angle)))
    field *= np.clip((angular_distance - gap_half) / 0.40, 0.0, 1.0) * 0.85 + 0.15

    return np.clip(field, 0.0, 1.0)


def build_fractal(rng: np.random.Generator, power: float, iterations: int) -> np.ndarray:
    """줄리아 집합. 같은 식을 반복해 얻는 경계.

    비주얼 컨셉 §2 의 **간섭** 과 같은 자리에 있다 — 어떤 점은 남고(수렴) 어떤 점은
    사라진다(발산). 그 경계가 무한히 세밀해지는 것이 프랙탈이다.
    시뮬레이션에서 '되는 구성'과 '안 되는 구성'을 가르는 경계도 이렇게 생겼다.
    """
    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float64)
    scale = HEIGHT * 0.5
    zx = (xx - WIDTH * 0.5) / scale * 1.45
    zy = (yy - HEIGHT * 0.5) / scale * 1.45

    z = zx + 1j * zy
    # 덴드라이트 계열 상수 — 가지가 뻗는 형태가 나온다.
    c = complex(-0.7269, 0.1889)

    escaped_at = np.zeros(z.shape, dtype=np.float64)
    alive = np.ones(z.shape, dtype=bool)

    for step in range(iterations):
        z[alive] = z[alive] ** power + c
        magnitude = np.abs(z)
        newly_escaped = alive & (magnitude > 4.0)
        # 부드러운 반복수 — 계단이 생기지 않게 로그로 보간한다.
        escaped_at[newly_escaped] = step + 1 - np.log2(np.log(magnitude[newly_escaped]))
        alive &= ~newly_escaped
        if not alive.any():
            break

    field = escaped_at / max(escaped_at.max(), 1.0)
    # 경계를 강조 — 지수를 1보다 크게 줘야 **먼 곳(빨리 발산)이 검게** 떨어진다.
    # 1보다 작으면 배경 전체가 중간 초록으로 떠서 사이트 톤과 어긋난다.
    field = np.clip(field, 0.0, 1.0) ** 2.4

    vignette = np.exp(-((np.sqrt(((xx - WIDTH * 0.5) / (WIDTH * 0.62)) ** 2 + ((yy - HEIGHT * 0.5) / (HEIGHT * 0.62)) ** 2)) ** 3))
    return np.clip(field * vignette, 0.0, 1.0).astype(np.float32)


def apply_ramp(field: np.ndarray) -> np.ndarray:
    positions = np.array([stop for stop, _ in RAMP], dtype=np.float32)
    colors = np.array([color for _, color in RAMP], dtype=np.float32)

    rgb = np.empty((*field.shape, 3), dtype=np.float32)
    for channel in range(3):
        rgb[..., channel] = np.interp(field, positions, colors[:, channel])
    return rgb


def generate(form: str, seed: int, args: argparse.Namespace) -> None:
    rng = np.random.default_rng(seed)

    stars = build_stars(rng)
    nebula = build_nebula(rng)

    if form == "ring":
        subject = build_structure(rng, args.teeth, args.radius, args.gap)
    elif form == "burst":
        subject = build_burst(rng, args.teeth, args.radius, args.gap)
    else:
        subject = build_fractal(rng, args.power, args.iterations)

    # 주체가 성운·별 앞에 있다. 겹치는 곳은 주체가 이긴다.
    background = np.maximum(nebula, stars * 0.95)
    field = np.maximum(background * (1.0 - subject * 0.85), subject)

    grain = rng.normal(0.0, 1.0, field.shape).astype(np.float32)
    field = np.clip(field + grain * GRAIN_STRENGTH * (0.10 + field), 0.0, 1.0)

    rgb = apply_ramp(field)
    image = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), mode="RGB")

    # 무손실 PNG 는 장당 2MB 라 탐색물이 쌓이면 저장소가 무거워진다.
    # 고품질 WebP 로 저장하되, 스크립트와 시드가 있으므로 언제든 정확히 재생성할 수 있다.
    destination = next_output_path(form, seed)
    image.save(destination, "WEBP", quality=92, method=6)
    print(f"{destination.name}  {image.width}x{image.height}  {destination.stat().st_size / 1024:.0f} KB")


def main() -> None:
    parser = argparse.ArgumentParser(description="콘셉트 이미지 생성 (덮어쓰지 않고 새로 쌓임)")
    parser.add_argument(
        "--form", choices=("ring", "burst", "fractal"), default="ring", help="형태"
    )
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED, help="별·성운·세그먼트 배치")
    parser.add_argument("--teeth", type=int, default=150, help="돌기·광선 개수 (ring·burst)")
    parser.add_argument("--radius", type=float, default=0.78, help="고리 반지름 (ring·burst)")
    parser.add_argument("--gap", type=float, default=0.34, help="열린 구간 반각 (ring·burst)")
    parser.add_argument("--power", type=float, default=2.0, help="줄리아 지수 (fractal)")
    parser.add_argument("--iterations", type=int, default=160, help="반복 횟수 (fractal)")
    parser.add_argument("--count", type=int, default=1, help="시드를 1씩 늘려가며 여러 장")
    args = parser.parse_args()

    for offset in range(args.count):
        generate(args.form, args.seed + offset, args)


if __name__ == "__main__":
    main()
