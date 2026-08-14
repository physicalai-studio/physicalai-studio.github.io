import { deliverableBundleSchema, fidelityLayerSchema, sectionHeadingSchema } from "./schema";

/**
 * 산출물과 충실도 (docs/사업_정의.md §7 · §6 ②).
 *
 * 두 블록 모두 **기대치를 미리 맞추는 장치**다.
 * - 산출물 묶음: `.usd` 파일 하나가 아니라 무엇이 함께 오는지. 받은 것을 파일 개수로 세지 않게 한다.
 * - 충실도 층: "실제와 같습니다"를 말하지 않는 대신, 무엇을 어디까지 표현했는지 선언한다.
 *
 * 둘을 다른 페이지에 둔다 — 산출물은 상거래(Services), 충실도는 공학 규율(Technology)이다.
 */
export const deliveryHeading = sectionHeadingSchema.parse({
  eyebrow: "What You Receive",
  title: "Not a File. A World.",
  body: "모델 파일 하나를 납품이라 부르지 않습니다. 다음 묶음이 함께 옵니다 — 그래야 다음 사람이 같은 환경을 다시 열고, 다시 돌리고, 이어서 확장할 수 있습니다.",
});

export const deliverableBundles = [
  {
    id: "digital-assets",
    title: "디지털 자산",
    items: ["로봇 · AMR · 휴머노이드", "센서", "설비와 작업 공간", "대상물 · 치구"],
  },
  {
    id: "executable",
    title: "실행 가능 환경",
    items: ["물리 · 관절 · 충돌", "컨트롤러 인터페이스", "센서 시뮬레이션", "ROS2 / API"],
  },
  {
    id: "research-interface",
    title: "연구 인터페이스",
    items: ["Observation", "Action", "Reset", "Spawn"],
  },
  {
    id: "experiment",
    title: "실험 기반",
    items: ["Randomization", "Ground Truth", "데이터셋 생성", "로깅과 지표"],
  },
  {
    id: "reproducibility",
    title: "재현성",
    items: ["Docker 이미지", "의존성 · 버전 고정", "설정과 실행 구조", "재현 절차 문서"],
  },
  {
    id: "validation",
    title: "검증",
    items: ["참조 시나리오", "기대 결과와 인수 시험", "각 결론의 신뢰 등급", "알려진 한계 목록"],
  },
  {
    id: "extensibility",
    title: "확장성",
    items: ["새 로봇 · 센서 추가 경로", "학습 프레임워크 연결점", "고객 AI 접속 지점"],
  },
].map((bundle) => deliverableBundleSchema.parse(bundle));

export const fidelityHeading = sectionHeadingSchema.parse({
  eyebrow: "Fidelity",
  title: "We Do Not Say It Is Real.",
  body: '시뮬레이션은 현실이 아닙니다. 그래서 "실제와 같습니다"라고 말하지 않고, 무엇을 어느 수준까지 표현했는지를 층으로 선언합니다. 모든 프로젝트가 마지막 층을 요구하지는 않습니다 — 질문에 답할 만큼 충분한 층을 고르는 것이 일입니다.',
});

export const fidelityLayers = [
  { code: "F1", title: "형상", items: "치수 · 배치 · 위치" },
  { code: "F2", title: "기구학", items: "관절 · 작업영역 · 한계 · 도달성" },
  { code: "F3", title: "물리", items: "질량 · 충돌 · 접촉 · 마찰 · 관성" },
  { code: "F4", title: "센서", items: "카메라 · LiDAR · IMU · 인지 조건" },
  { code: "F5", title: "시스템", items: "ROS2 · 컨트롤러 · 통신 · 시퀀스" },
  { code: "F6", title: "실기 상관", items: "실제와 시뮬레이션 결과의 항목별 대조" },
].map((layer) => fidelityLayerSchema.parse(layer));
