import { capabilityGroupSchema } from "./schema";

/**
 * 검증 항목 — "우리가 실제로 재는 것".
 *
 * 시뮬레이션을 데모 영상이 아니라 **계측 장비**로 쓴다는 주장을 구체화한 목록이다.
 * 각 항목은 실제 수행 근거가 있는 것만 둔다 (근거 대장: 저장소 밖 비공개 문서 — docs/사업_정의.md §5 참조).
 * 근거 없는 항목을 추가하지 않는다 — 이 목록의 신뢰도가 사이트 전체의 신뢰도다.
 */
export const capabilityGroups = [
  {
    id: "kinematics",
    title: "KINEMATICS",
    items: [
      "도달 범위와 작업 영역",
      "자코비안 조건수로 본 특이 자세",
      "해가 없는 구간(dead-band) 식별과 우회 경로",
      "관절 한계 여유",
      "여유자유도 활용 여지",
    ],
  },
  {
    id: "motion",
    title: "MOTION & TIME",
    items: [
      "사이클 타임",
      "직선 이송의 경로 이탈량",
      "다축 동시 동작의 형상 유지",
      "속도 · 가속 한계 포화 구간",
      "궤적 종료와 물리 정착 시점의 차이",
    ],
  },
  {
    id: "physics",
    title: "PHYSICS & CONTACT",
    items: [
      "간섭 · 충돌",
      "질량 · 관성 정합",
      "구동 게인의 안정성과 과도 응답",
      "접촉 작업의 컴플라이언스",
      "중력 처짐과 보상량",
    ],
  },
  {
    id: "system",
    title: "SYSTEM",
    items: [
      "제어 주기 실측과 병목 위치",
      "통신 계층의 지연 · 손실",
      "좌표계 · 부호 규약 정합",
      "안전 정지와 속도 제한 계층",
      "시뮬레이션 모델과 실기의 차이",
    ],
  },
  {
    id: "fidelity",
    title: "FIDELITY",
    items: [
      "각 결론이 어떤 값 위에 서 있는지",
      "실측 · 형상 산출 · 추정 · 미확보 등급 구분",
      "이 모델로 답할 수 없는 질문의 범위",
      "실기 계측 후 좁혀진 차이",
      "결과를 다시 만드는 재현 절차",
    ],
  },
  {
    id: "navigation",
    title: "PERCEPTION & NAVIGATION",
    items: [
      "센서 종류가 알고리즘 요건에 맞는지",
      "다중 LiDAR 융합 결과",
      "위치 추정 오차와 누적 경향",
      "주행 안전 여유",
      "운용 설계 범위(ODD)",
    ],
  },
].map((group) => capabilityGroupSchema.parse(group));
