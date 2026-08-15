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
    # 시뮬레이션 테스트베드 캡처. 원본이 레터박스가 있는 16:9 프레임이라 위아래 34px 검은 띠를
    # 잘라내고(34~686), 서비스 슬롯 비율(4:3)에 맞춰 팔을 중심으로 가로를 다시 잘랐다.
    # 배경이 이미 near-black 이라 감마를 낮게(1.30) 두어 피사체가 죽지 않게 한다 —
    # 밝은 배경 원본(URDF 뷰어 캡처)과는 반대 방향의 보정이다.
    ("physical-ai", "sim_testbed.jpg", (246, 34, 1115, 686), 869, 1.00, 1.30),
    # 구동부 클로즈업. 원본은 테스트베드 전경이라 **바퀴 구간만** 잘라 쓴다 —
    # 이 케이스가 말하는 것이 차체 전체가 아니라 구동 관절이기 때문이다.
    # 오른쪽 위 편집기 툴팁 글자가 들어오지 않는 선(x < 1700)에서 끊었다(컨셉 §17 — 이미지에 글자 금지).
    # 바닥이 밝은 회색이라 감마를 크게(2.2) 준다.
    ("drive-alignment", "motion_devece_mk1intestbed.png", (630, 570, 1700, 1172), 1070, 0.85, 2.20),
    # 실기 ↔ 시뮬레이션 대조 컷. 좌우 분할 구도가 이 케이스의 주장("시뮬레이터에서 보이는
    # 모션이 곧 실기의 모션")과 같은 말이라 자르지 않고 전폭을 쓴다.
    # 왼쪽 흰 벽이 밝아 감마를 크게(2.4) 준다.
    ("real-sim-testbed", "real_sim_testbed.png", None, 1600, 0.84, 2.40),
    # README에서 옮긴 신규 케이스 캡처. 구도와 정보는 유지하고 원색만 제거해
    # 프로젝트 페이지의 다른 기술 이미지와 같은 초록 듀오톤으로 맞춘다.
    # 세 원본 모두 밝은 흰색·청색 영역이 넓어 감마를 높게 잡아 하이라이트 면적을 제한한다.
    ("case-miniload-r2s", "case-miniload-r2s.png", None, 1600, 0.84, 2.20),
    ("case-warehouse-commissioning", "case-warehouse-commissioning.png", None, 1600, 0.90, 1.85),
    ("case-meta-quest-il-alt", "case-meta-quest-il-alt.png", None, 1600, 0.86, 2.15),
    # 실제 설비 내부. **천장 반송 레일 구간만** 쓴다 —
    # 아래쪽 이동 로봇에 기관 표식이 읽히므로 크롭에서 제외한다(익명화).
    # 유리에 비친 안내판 반사도 오른쪽 밖으로 밀어냈다. 실내가 밝아 감마를 크게(2.2) 준다.
    ("facility-overhead", "KakaoTalk_20260813_175714350.jpg", (300, 0, 993, 520), 693, 0.85, 2.20),
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
