import { customerSegmentSchema } from "./schema";

/**
 * 고객군 (docs/사업_정의.md §4).
 *
 * **이 블록의 목적은 설득이 아니라 자격 판정이다.** 방문자가 문제 목록에서 자기 문장을 읽은
 * 직후에 "그 상황에 있는 팀이 우리 고객이다"를 표로 보여, 스스로 해당 여부를 판단하게 한다.
 *
 * 순서는 진입 난이도 순이다 — 이미 로봇을 가진 팀이 가장 먼저 온다(고객_분석.md §1).
 * 마지막 항목(로봇이 없는 AI 팀)은 지금 시장이 아니라 **다가오는 시장**이라 뒤에 둔다.
 */
export const customerSegments = [
  {
    id: "robot-oem",
    label: "로봇 스타트업 · OEM",
    has: "로봇팔 · AMR · 휴머노이드와 소프트웨어 팀",
    pain: "실기에서만 테스트해 실험 한 번의 비용과 시간이 크다",
    gets: "재사용 가능한 디지털 테스트베드 — 새 프로젝트마다 다시 만들지 않는다",
  },
  {
    id: "robot-si",
    label: "로봇 SI · 자동화 업체",
    has: "로봇과 설비 설계, 고객 프로젝트",
    pain: "제작 뒤에 로봇 선정 · 레이아웃이 틀린 것을 알면 비용이 크다",
    gets: "타당성 검토와 가상 시운전 — 도달성 · 충돌 · 사이클 타임을 제작 전에",
  },
  {
    id: "research",
    label: "대학 · 연구기관",
    has: "연구 주제와 알고리즘, 연구 인력",
    pain: "연구보다 환경 구축에 시간이 더 들어간다",
    gets: "재현 가능한 연구 환경 — 지능을 연구하십시오, 세계는 준비합니다",
  },
  {
    id: "manufacturing",
    label: "제조 R&D",
    has: "실제 공정과 설비",
    pain: "공정에 로봇을 넣어도 되는지 먼저 답해야 한다",
    gets: "타당성 검토에서 시작해 디지털 트윈까지 이어지는 경로",
  },
  {
    id: "physical-ai",
    label: "Physical AI 팀",
    has: "RL · VLA · World Model 같은 지능",
    pain: "학습하고 평가할 몸과 물리 환경이 없다",
    gets: "지능이 들어갈 몸과 세계 — 관측 · 행동 · 리셋 · 정답값까지",
  },
].map((segment) => customerSegmentSchema.parse(segment));
