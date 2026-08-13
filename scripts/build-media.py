#!/usr/bin/env python3
"""원본 이미지 → 사이트 배포용 초록 톤 WebP 생성.

`image/` 의 원본을 읽어 크롭 · 리사이즈 · 초록 듀오톤 그레이딩을 적용하고
`public/media/` 에 WebP 로 저장한다. 원본은 건드리지 않는다.

그레이딩 의도 — 사이트 배경이 near-black(#08090a)이므로, 이미지를
**어두운 초록 그림자 → 밝은 초록 하이라이트** 듀오톤으로 통일해 배경과 한 몸으로 만든다.
게인(gain)과 감마로 대비를 올려 검정 배경에서도 형상이 죽지 않게 한다.

사용법:
    python3 scripts/build-media.py
"""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "image"
OUT = ROOT / "public" / "media"

# 듀오톤 양 끝 색.
#   그림자는 사이트 배경(#08090a)보다 살짝 밝은 정도로만 두어 이미지가 배경에 가라앉게 하고,
#   하이라이트만 초록으로 살린다. 하이라이트를 넓게 쓰면 검정 배경 위에서 이미지가 떠 보인다.
SHADOW = (3, 9, 7)
MIDTONE = (17, 66, 45)
HIGHLIGHT = (137, 247, 186)

WEBP_QUALITY = 80

# (출력이름, 원본, 크롭 box(l,t,r,b) 또는 None, 목표 폭, 게인, 감마)
#   게인 = 밝기 배율. 감마 > 1 이면 중간톤이 어두워진다 — 검정 배경에 맞추려면 이쪽이다.
#   밝은 원본(밝은 바닥·흰 로봇)일수록 감마를 크게 준다.
JOBS = [
    # 배경 광장(光場) 2종은 scripts/gen-fields.py 가 따로 만든다(수식 생성, 원본 없음).
    ("amr-manipulator", "franka_fr3.png", (0, 100, 1656, 1032), 1656, 0.92, 1.75),
    ("simulation-poc", "franka_fr3.png", (100, 40, 1656, 1207), 1400, 0.92, 1.75),
    ("collision-validation", "agility-a01_urdf.png", (0, 400, 1113, 1235), 1113, 1.00, 1.35),
    ("humanoid", "agility-a01_urdf.png", (0, 500, 1113, 1126), 1113, 1.00, 1.35),
    ("physical-ai", "agility-a01_urdf.png", (0, 300, 1113, 1135), 1113, 1.00, 1.35),
    ("industrial-cell", "industrial-cell.jpg", None, 1920, 0.95, 1.60),
    ("digital-twin-pointcloud", "lidar-point-cloud.jpg", None, 1920, 1.05, 1.15),
    ("actuator-harmonic-drive", "harmonic-drive.jpg", (60, 120, 1700, 1670), 1200, 0.90, 1.85),
]


def apply_gamma(gray: Image.Image, gamma: float) -> Image.Image:
    """감마 보정. gamma < 1 이면 중간톤이 밝아진다."""
    table = [round(255 * ((value / 255) ** gamma)) for value in range(256)]
    return gray.point(table)


def build(name: str, source: str, box, target_width: int, gain: float, gamma: float) -> None:
    with Image.open(SRC / source) as image:
        image = image.convert("RGB")
        if box:
            image = image.crop(box)
        if image.width > target_width:
            height = round(image.height * target_width / image.width)
            image = image.resize((target_width, height), Image.LANCZOS)

        # 1) 휘도만 남긴다 — 원본의 색상(청록 UI, 마젠타 점군 등)을 제거해야 톤이 통일된다.
        gray = ImageOps.grayscale(image)

        # 2) 대비 정규화 후 게인·감마로 검정 배경용 노출을 만든다.
        gray = ImageOps.autocontrast(gray, cutoff=1)
        gray = apply_gamma(gray, gamma)
        gray = ImageEnhance.Brightness(gray).enhance(gain)

        # 3) 초록 듀오톤으로 매핑한다.
        toned = ImageOps.colorize(gray, black=SHADOW, white=HIGHLIGHT, mid=MIDTONE)

        destination = OUT / f"{name}.webp"
        toned.save(destination, "WEBP", quality=WEBP_QUALITY, method=6)
        size_kb = destination.stat().st_size / 1024
        print(f"{destination.name:30s} {toned.width}x{toned.height:<5d} {size_kb:6.1f} KB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for job in JOBS:
        build(*job)


if __name__ == "__main__":
    main()
