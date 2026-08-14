import { companySchema } from "./schema";

/**
 * 회사 · 철학 (가이드 §11, 디자인 컨셉 §12).
 * 규모를 과장하지 않고 Philosophy 를 먼저 제시한다.
 */
export const company = companySchema.parse({
  philosophy: "ENGINEERING BEFORE ASSUMPTION.",
  philosophyBody:
    "로봇 시스템은 만든 뒤에 문제를 발견하면 비용이 큽니다. 우리는 그 문제를 가상환경에서 먼저 찾습니다.",
  principles: [
    {
      title: "SIMULATION FIRST",
      body: "설비와 로봇을 제작하기 전에 가상환경에서 먼저 검증합니다.",
    },
    {
      title: "ENGINEERING VALIDATION",
      body: "3D 영상이 아니라 도달성 · 간섭 · 동작 · 사이클 타임을 엔지니어링 기준으로 확인합니다.",
    },
    {
      title: "SIM-TO-REAL",
      body: "시뮬레이션에서 끝내지 않고 실제 로봇 시스템으로 연결되는 구조를 만듭니다.",
    },
    {
      title: "SMALL TEAM. DEEP ENGINEERING.",
      body: "규모가 아니라 문제를 끝까지 파는 깊이로 일합니다.",
    },
  ],
  founder: {
    name: "이다빈",
    role: "Founder / Principal Engineer",
    /*
      마지막 문장이 이 사람의 방향을 말한다. 다룬 로봇의 목록이 아니라 **그 로봇들을 무엇으로
      묶으려 하는가**가 이 스튜디오의 정체성이므로, 앞의 이력은 근거로만 두고 끝을 지향으로 닫는다.
    */
    summary:
      "산업용 6축 로봇암, 토크 제어 양팔 매니퓰레이터, 모바일 매니퓰레이터, 차동 구동 AMR, 휴머노이드를 시뮬레이션과 실기 양쪽에서 다뤄 왔습니다. CAD 자산을 시뮬레이션 모델로 만드는 일부터 특이 자세 진단, 중력 보상과 컴플라이언스, 다중 LiDAR 융합과 주행 스택, 엣지 인지 파이프라인까지 다뤘습니다. 지향하는 것은 이 개별 로봇들을 WCS(Warehouse Control System)까지 연결해, 상위 시스템의 작업 지시 한 건이 로봇의 동작으로 끊기지 않고 내려가는 하나의 흐름을 만드는 것입니다 — 현장에서 결과를 가르는 것은 로봇 한 대의 성능이 아니라 그 사이가 이어지는지입니다.",
  },
});
