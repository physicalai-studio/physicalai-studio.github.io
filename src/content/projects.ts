import { caseTextureSlot } from "./media";
import { projectSchema, type Project } from "./schema";

/**
 * 프로젝트 케이스 스터디 (가이드 §9).
 *
 * **익명화 원칙** — 고객사명 · 사내 제품명 · 장비 고유명을 쓰지 않는다.
 * 로봇은 형태와 자유도로, 설비는 공정으로 기술한다. 시판 부품의 일반 명칭
 * (EtherCAT, LiDAR 등)은 그 자체로 식별 정보가 아니므로 허용한다.
 *
 * 수록한 수치는 **시뮬레이션과 실기의 차이를 잰 결과**이며, 그 계측 자체가
 * 이 스튜디오가 파는 것이다(docs/사업_정의.md §5 ②). 고객의 설비 사양이 아니다.
 */
const projects: Project[] = [
  {
    slug: "mobile-manipulator-physics-baseline",
    title: "MOBILE MANIPULATOR PHYSICS BASELINE",
    subtitle: "이동 매니퓰레이터의 물리 기준 수립과 신뢰 등급 판정",
    stack: ["Isaac Sim", "OpenUSD", "PhysX", "ROS2", "URDF"],
    isPublished: true,
    problem:
      "이동 베이스 위에 6축 팔을 얹어 프레임을 이송하는 설비를 제작 전에 검토해야 했습니다. 그런데 사양서에 없는 값이 절반이었습니다 — 링크 질량, 관성, 마찰, 구동 게인. 그 값들이 결론을 좌우하므로, 시뮬레이션을 만드는 것보다 **그 시뮬레이션을 어디까지 믿어도 되는지**를 먼저 정해야 했습니다.",
    environment:
      "6축 로봇암 + 부유 베이스 이동 로봇, 승강 슬라이더와 집게로 구성된 27 자유도 시스템(관절 20개, 구면 관절 포함). CAD 자산을 URDF 로 내보내고 USD 로 변환해 물리 엔진 위에서 구동했습니다.",
    simulation:
      "전 축의 구동 방식과 게인을 설정하고 주행 · 승강 · 파지 · 이송 시나리오를 실행했습니다. 실행 조건(창 모드 · 헤드리스)을 바꿔가며 물리 연산 주기가 정확도에 미치는 영향까지 측정했습니다.",
    verification:
      "모델(URDF 순기구학)과 시뮬레이션(USD)의 기구학 차이, 궤적 추종 오차와 정착 후 잔류 오차, 직선 이송의 경로 이탈량, 주행 실효율, 구동 게인의 감쇠비와 이산 적분 안정 조건, 궤적 없는 계단 명령에서의 거동을 항목별로 쟀습니다.",
    result:
      "형상은 0.000 mm 로 일치했습니다. 이동 중 추종 오차 약 1°, 정착 후 0.04~0.13°. 관절공간 보간으로 만든 직선은 150 mm 이송에서 말단이 1.385 mm(0.9%) 이탈했습니다. 주행은 이론값의 98%(슬립 2%). 실행 조건에 따라 잔류 이탈이 1.7 mm ↔ 0.01 mm 로 갈렸습니다. **모든 값에 출처 등급(실측 · 형상 산출 · 추정 · 미확보)을 붙여, 위치 제어에 대한 결론은 신뢰할 수 있으나 힘 · 토크 · 파지력에 대한 어떤 결론도 이 모델에서 끌어낼 수 없음을 명시했습니다.** 알려진 한계 23건도 함께 넘겼습니다.",
    mediaSlot: "project-amr-manipulator",
  },
  {
    slug: "precision-orientation-control",
    title: "PRECISION ORIENTATION CONTROL",
    subtitle: "좁은 표적 통과 작업의 자세 제어와 특이점 회피",
    stack: ["6축 산업용 로봇암", "EtherCAT", "Vision", "ROS2"],
    isPublished: true,
    problem:
      "좁은 표적을 통과시키는 작업에서 공구의 시선축은 고정한 채 방위만 바꿔야 했습니다. 그런데 특정 자세 구간에 들어가면 컨트롤러가 포인트 계산 실패 알람을 내고 보호 정지가 걸렸습니다. 원인이 로봇 결함인지 명령 방식인지부터 갈라야 했습니다.",
    environment:
      "6축 EtherCAT 산업용 로봇암과 비전 시스템. 공구를 수직으로 세우는 모드와 수평으로 눕히는 모드 두 가지를 다뤘습니다.",
    simulation:
      "자세 명령을 **월드 기준 회전(좌곱)** 과 **공구 기준 회전(우곱)** 으로 분리해 체계를 다시 세웠습니다. 직선 경로를 2 mm 간격으로 샘플링하고 각 점마다 역기구학 해와 관절 한계를 사전 검증하도록 설계했습니다.",
    verification:
      "짐벌락 구간 판정, 관절해가 존재하지 않는 자세 dead-band 의 위치와 폭, 경로 전 구간의 해 존재 여부, 목 회전 시 시선축이 실제로 불변인지를 확인했습니다.",
    result:
      "수평 자세가 오일러 각 표현의 특이점(짐벌락) 상태임을 확인하고, 그 조건에서 고정할 수밖에 없는 축을 특정했습니다. 특정 X 구간에서 관절해가 사라져 벤더 알람이 발생하는 현상을 재현하고, 우회 경로를 3모드(이상적 직선 / 밴드 구간 관절 이동 / 최소 기울기 직선)로 설계해 **전 구간에 해가 있을 때만 실행**되도록 만들었습니다. 로봇 결함이 아니라 자세 표현의 구조적 한계였습니다.",
    // 실제 캡처 미확보 — 추상 텍스처로 대체(debt-008)
    mediaSlot: caseTextureSlot("precision-orientation-control"),
  },
  {
    slug: "whole-body-collision-validation",
    title: "WHOLE-BODY COLLISION VALIDATION",
    subtitle: "휴머노이드 하체의 충돌 형상과 관절 커플링 검증",
    stack: ["Isaac Sim", "URDF", "충돌 메시", "궤적 동기화"],
    isPublished: true,
    problem:
      "휴머노이드 하체의 자세를 유지하도록 두 관절을 속도비로 묶어 두었는데, 정지 상태에서는 수직이 나오지만 **이동 중에 상체가 틀어졌습니다.** 구속식은 맞는데 결과가 달랐습니다.",
    environment:
      "테스트 리그에 고정한 휴머노이드 하체. 전 관절의 충돌 메시와 조인트 프레임을 시뮬레이션에 올렸습니다.",
    simulation:
      "충돌 형상과 관절 축을 시각화하고 자세 범위를 훑으며 간섭 지점을 찾았습니다. 그다음 두 관절의 속도 프로파일을 동작 구간별로 기록했습니다.",
    verification:
      "링크 간 간섭, 관절 한계 도달 지점, 그리고 기구학적 커플링(고관절 = −0.5 × 무릎)이 **동작 중에도 유지되는지**를 확인했습니다.",
    result:
      "이동 중 자세가 최대 ±8° 틀어지는 것을 재현했습니다. 원인은 한쪽 관절이 모터 회전수 상한에 걸리는 구간이 동작마다 달라져 속도비가 깨지는 것이었습니다 — **위치 구속은 목표에만 걸려 있었고 실행은 각 축의 독립 프로파일**이었습니다. 두 관절의 동작 시간을 맞추는 방식으로 순간 속도비를 강제해 해결했습니다. 시뮬레이터에 실제 모터의 속도 한계를 넣지 않으면 이 현상은 가상환경에서 영원히 재현되지 않습니다.",
    mediaSlot: "project-humanoid",
  },
  {
    slug: "amr-navigation-stack",
    title: "AMR NAVIGATION STACK",
    subtitle: "차동 구동 이동 로봇의 주행 · 안전 계층과 다중 LiDAR 융합",
    stack: ["ROS2", "2D SLAM", "LiDAR", "차동 구동"],
    isPublished: true,
    problem:
      "차동 2륜 이동 로봇의 주행 스택을 설계하면서, 사각을 없애기 위해 대각으로 배치한 LiDAR 두 대를 **하나의 스캔처럼** 다뤄야 했습니다. 단순 평균이나 정합으로는 되지 않는 문제였습니다.",
    environment: "차동 2륜 구동 이동 로봇, 2D 안전 LiDAR 2대, ROS2 기반 제어 · 인지 스택.",
    simulation:
      "속도 명령에서 바퀴 관절, 모터 버스까지의 데이터 흐름을 설계하고, 안전 가드 · 기구학 · 드라이버의 3중 속도 제한 계층과 입력 워치독을 넣었습니다. 스캔 병합은 극좌표 → 직교 점군 → 공통 좌표계 변환 → 각도 빈별 최단거리 역투영 순서로 구성했습니다.",
    verification:
      "회전 제어에서 각도 오차의 wrap-around 처리, 두 센서 외부 파라미터의 정합, 병합 과정에서 생기는 정보 손실 지점(같은 각도 빈에 앞뒤 점이 함께 있을 때 뒤가 사라지는 문제)을 확인했습니다.",
    result:
      "두 센서가 강체로 고정되어 외부 파라미터가 상수라는 점을 이용해 **정합(ICP)을 런타임이 아닌 사전 캘리브레이션에서 1회만** 수행하도록 설계했습니다. 주행 스택은 SLAM · 로컬라이제이션 · 플래너 · 안전 정지 · 운용 설계 범위(ODD) 패키지로 나누어, 어디까지 동작을 보증하는지가 코드 구조에 드러나게 했습니다.",
    // 실제 캡처 미확보 — 추상 텍스처로 대체(debt-008)
    mediaSlot: caseTextureSlot("amr-navigation-stack"),
  },
].map((project) => projectSchema.parse(project));

export const allProjects = projects;

/**
 * 화면에 노출할 프로젝트 목록을 반환한다.
 *
 * 프로덕션에서는 `isPublished: true` 인 항목만 반환하고, 개발 환경에서는 미게시 항목도 포함해
 * 레이아웃을 확인할 수 있게 한다.
 */
export function getVisibleProjects(): Project[] {
  if (process.env.NODE_ENV === "production") {
    return projects.filter((project) => project.isPublished);
  }
  return projects;
}

/** 슬러그로 프로젝트 1건을 찾는다. 없으면 `undefined`. */
export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
