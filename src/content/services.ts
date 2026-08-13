import { serviceSchema } from "./schema";

/**
 * 핵심 서비스 5종 (docs/사업_정의.md §6).
 *
 * 루프의 위치에 따라 나눈다: 모델 구성 → 시뮬레이션 → 검증 → 실기 정합 → 환경 재사용.
 * 각 항목은 기술 나열이 아니라 **고객이 얻는 결과**를 `outcome` 에 둔다.
 */
export const services = [
  {
    id: "pre-build-review",
    index: "01",
    title: "PRE-BUILD REVIEW",
    titleKo: "제작 전 검토",
    outcome: "설비를 만들기 전에, 이 구성으로 그 작업이 되는지에 대한 답을 받습니다.",
    detail:
      "도달 범위와 자세, 간섭, 관절 한계, 레이아웃을 가상환경에서 확인합니다. 안 되는 구성이라면 그것도 결론입니다 — 제작 전에 아는 편이 쌉니다.",
    deliverables: [
      "도달 범위 · 작업 영역 분석",
      "특이 자세와 해가 없는 구간 식별",
      "간섭 · 관절 한계 검토",
      "공구 접근 자세와 레이아웃 판단",
      "각 결론의 신뢰 등급 명시",
    ],
    mediaSlot: "service-feasibility",
  },
  {
    id: "scenario-validation",
    index: "02",
    title: "SCENARIO VALIDATION",
    titleKo: "작업 시나리오 검증",
    outcome: "실제 공정 순서가 끝까지 도는 것과, 그때의 사이클 타임을 확인합니다.",
    detail:
      "Pick & Place, 소재 공급, 이송, 검사 같은 실제 작업을 물리 기반으로 실행합니다. 되는 것만 보는 게 아니라 어디서 막히는지를 찾습니다.",
    deliverables: [
      "작업 시나리오 시뮬레이션 구현",
      "동작 시퀀스 · 다축 동기화 검증",
      "사이클 타임 측정과 병목 구간",
      "경로 이탈량 등 정밀도 계측",
      "결과 영상 및 분석 리포트",
    ],
    mediaSlot: "service-poc",
  },
  {
    id: "virtual-commissioning",
    index: "03",
    title: "VIRTUAL COMMISSIONING",
    titleKo: "가상 시운전",
    outcome: "설비가 완성되기 전에 제어 로직을 검증해 현장 시운전 기간을 줄입니다.",
    detail:
      "실제 컨트롤러와 제어 소프트웨어를 가상 설비에 연결해 설치 이전에 동작을 확인합니다. 자체 모션 생성이 아니라 벤더 컨트롤러를 루프 안에 넣는 방식까지 다룹니다.",
    deliverables: [
      "가상 설비 모델 구축",
      "제어 시스템 · 통신 계층 연동",
      "인터록 · 시퀀스 사전 검증",
      "제어 주기와 지연 실측",
      "시운전 리스크 목록",
    ],
    mediaSlot: "service-vc",
  },
  {
    id: "sim-to-real-alignment",
    index: "04",
    title: "SIM-TO-REAL ALIGNMENT",
    titleKo: "실기 정합",
    outcome: "시뮬레이션과 실물의 차이를 숫자로 받고, 그 차이를 좁힙니다.",
    detail:
      "검증한 구성을 실제 로봇에 배포하고 항목별로 차이를 잽니다. 추정값이 실측값으로 바뀔수록 모델의 신뢰 등급이 올라가고, 다음 변경은 다시 가상환경에서 먼저 확인할 수 있게 됩니다.",
    deliverables: [
      "실기 배포와 상태 연동",
      "기구학 · 궤적 추종 · 정착 오차 계측",
      "차이의 원인 분리 — 모델 · 제어 · 통신",
      "모델 갱신과 재검증",
      "이후 변경을 사전 검증할 환경 인수인계",
    ],
    mediaSlot: "service-twin",
  },
  {
    id: "physical-ai-testbed",
    index: "05",
    title: "PHYSICAL AI TESTBED",
    titleKo: "피지컬 AI 테스트베드",
    outcome: "학습과 평가에 쓸 수 있는, 신뢰 등급이 매겨진 환경을 확보합니다.",
    detail:
      "정책을 학습시키기 전에 필요한 것은 믿을 수 있는 환경입니다. 물리 파라미터와 구동 한계가 실기와 맞춰진 시뮬레이션 환경을 구축합니다.",
    deliverables: [
      "학습용 시뮬레이션 환경 구축",
      "물리 · 구동 한계의 실기 정합",
      "Synthetic Data 생성 파이프라인",
      "정책 평가 시나리오 구성",
      "Sim-to-Real 격차 요인 정리",
    ],
    mediaSlot: "service-physical-ai",
  },
].map((service) => serviceSchema.parse(service));
