import { technologyGroupSchema, workflowStepSchema } from "./schema";

/**
 * 기술 스택 (가이드 §10).
 *
 * 로고 나열을 금지하고, 각 기술이 **프로젝트에서 수행하는 역할**을 함께 기술한다.
 * 항목은 실제 수행 경험이 있는 것만 둔다 — 근거는 저장소 밖 비공개 역량 대장에 있다.
 */
export const technologyGroups = [
  {
    id: "simulation",
    title: "SIMULATION",
    items: [
      { name: "NVIDIA Isaac Sim", role: "물리 기반 로봇 시뮬레이션 환경의 기본 플랫폼" },
      { name: "NVIDIA Isaac Lab", role: "강화학습 · 모방학습 실험 환경 구성" },
      { name: "OpenUSD", role: "로봇 · 설비 · 환경 자산의 공통 기술 포맷" },
      { name: "PhysX", role: "관절 구동 게인 · 강성 단위 환산과 적분 안정성 확인" },
      { name: "URDF / CAD 파이프라인", role: "STEP 자산을 시뮬레이션에서 도는 모델로 변환" },
    ],
  },
  {
    id: "robotics",
    title: "ROBOTICS",
    mediaSlot: "technology-actuator",
    items: [
      { name: "6축 산업용 로봇암", role: "정밀 자세 유지와 직선 이송 작업의 도달성 검증" },
      { name: "7-DOF 양팔 매니퓰레이터", role: "토크 제어 기반 양팔 협조 동작과 텔레오퍼레이션" },
      { name: "모바일 매니퓰레이터", role: "이동 베이스와 다관절 팔이 결합된 여유자유도 시스템" },
      { name: "차동 구동 AMR", role: "구동 기구학 · 오도메트리 · 안전 계층 설계" },
      { name: "휴머노이드 · 다지 핸드", role: "전신 협조 동작, mimic 관절과 파지 구조" },
    ],
  },
  {
    id: "control",
    title: "CONTROL",
    items: [
      {
        name: "역기구학 · 특이점 해석",
        role: "자코비안 조건수로 특이 자세를 판정하고 우회 경로 설계",
      },
      { name: "중력 보상 · 임피던스", role: "정상상태 처짐 보상과 접촉 작업의 컴플라이언스 확보" },
      {
        name: "궤적 생성 · 동기화",
        role: "여러 축이 함께 움직일 때 형상이 깨지지 않도록 시간 정합",
      },
      { name: "PID · 상태 기반 제어", role: "회전 오차 wrap-around 처리 등 실무 제어 로직" },
      { name: "실시간성 · 안전 계층", role: "제어 주기 병목 진단, 속도 제한 · 워치독 · 보호 정지" },
    ],
  },
  {
    id: "perception",
    title: "PERCEPTION",
    items: [
      { name: "ROS2", role: "제어 · 인지 · 시뮬레이션을 잇는 통신 계층" },
      { name: "NVIDIA Isaac ROS", role: "엣지 보드에서 가속되는 인지 파이프라인" },
      {
        name: "Visual SLAM · 오도메트리",
        role: "스테레오 기반 위치 추정 파이프라인 구성과 요건 검증",
      },
      {
        name: "LiDAR 스캔 융합",
        role: "다중 LiDAR 점군을 공통 좌표계로 병합해 단일 스캔으로 제공",
      },
      { name: "2D SLAM · 로컬라이제이션", role: "격자지도 기반 주행 스택과 운용 범위(ODD) 정의" },
    ],
  },
  {
    id: "learning",
    title: "LEARNING",
    items: [
      { name: "PyTorch", role: "정책 · 인지 모델 학습" },
      { name: "Imitation Learning", role: "시연 데이터 기반 작업 학습 — 조사 · 검토 단계" },
      { name: "Reinforcement Learning", role: "접촉이 많은 작업의 제어 정책 — 조사 · 검토 단계" },
      {
        name: "VLA · Foundation Policy",
        role: "상위 정책과 하위 제어의 주기 간극 설계 — 조사 · 검토 단계",
      },
    ],
  },
  {
    id: "engineering",
    title: "ENGINEERING",
    items: [
      { name: "Python / C++", role: "시뮬레이션 확장과 제어 노드 구현" },
      { name: "Docker", role: "재현 가능한 실행 환경 고정" },
      { name: "NVIDIA Jetson", role: "엣지 배포 환경 구성과 스택 버전 정합" },
      { name: "Git", role: "자산 · 코드 · 설정의 이력 관리" },
      { name: "Linux", role: "시뮬레이션과 로봇 시스템의 공통 실행 기반" },
    ],
  },
].map((group) => technologyGroupSchema.parse(group));

/**
 * 대표 워크플로 (docs/사업_정의.md §4).
 *
 * 선형이 아니라 **닫힌 루프**다. 마지막 MEASURE 가 MODEL 로 되돌아가며,
 * 한 바퀴 돌 때마다 추정값이 실측값으로 바뀌어 모델의 신뢰 등급이 올라간다.
 * 이 되돌아오는 화살표가 일반 시뮬레이션 용역과의 구조적 차이다.
 */
export const workflowSteps = [
  {
    id: "problem",
    label: "PROBLEM",
    body: "고객이 확인하고 싶은 것을 엔지니어링 질문으로 바꿉니다.",
  },
  {
    id: "model",
    label: "MODEL",
    body: "로봇 · 설비 · 환경을 검증 가능한 디지털 모델로 구성합니다.",
  },
  {
    id: "simulate",
    label: "SIMULATE",
    body: "실제 작업 시나리오를 물리 기반으로 실행합니다.",
  },
  {
    id: "validate",
    label: "VALIDATE",
    body: "도달성 · 간섭 · 동작 · 사이클 타임을 기준에 대조합니다.",
  },
  {
    id: "deploy",
    label: "DEPLOY",
    body: "검증된 구성을 실제 로봇 시스템에 배포합니다.",
  },
  {
    id: "measure",
    label: "MEASURE",
    body: "실물과의 차이를 항목별로 재고, 그 값으로 모델을 갱신합니다 — 다시 MODEL 로.",
  },
].map((step) => workflowStepSchema.parse(step));
