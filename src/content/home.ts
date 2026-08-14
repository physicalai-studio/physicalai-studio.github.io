import { homeSchema } from "./schema";

/**
 * 홈 페이지 문구 (가이드 §8).
 *
 * 섹션 순서는 가이드가 정한 대로 유지한다:
 * Problems → Services → Workflow → Projects → Technology → Why → Contact.
 * 각 섹션은 짧은 문장 하나로 승부한다 (디자인 컨셉 §7 SHORT COPY).
 */
export const home = homeSchema.parse({
  hero: {
    /*
      경계를 첫 화면에서 선언한다(사업_정의.md §1-1). 방문자가 30초 안에 알아야 할 것 중
      첫 번째가 "이 회사가 무엇을 하는가"이고, 그 답은 **로봇을 만드는 곳이 아니라
      로봇을 만드는 사람이 쓰는 시뮬레이션을 만드는 곳**이다.
    */
    headlineLines: ["We Build the Simulation.", "You Build the Robot."],
    mediaSlot: "home-hero",
  },

  problems: {
    eyebrow: "01 — Problems We Solve",
    title: "늦게 알아서 비싼 것, 기다려서 느린 것",
    body: "둘은 같은 자리에서 풀립니다 — 개발 시작과 함께 돌아가는, 믿을 수 있는 시뮬레이션.",
    items: [
      "이 구성으로 그 작업이 되는가?",
      "설비를 만들기 전에 간섭과 도달 범위를 확인하고 싶다.",
      "사이클 타임이 목표에 들어오는지 미리 알고 싶다.",
      "실기가 올 때까지 제어 · 인지 개발이 멈춰 있다.",
      "실기 한 대를 여럿이 나눠 쓰느라 검증이 밀린다.",
      "시뮬레이션은 잘 도는데 실기가 다르게 움직인다.",
      "이 시뮬레이션 결과를 어디까지 믿어도 되는가?",
    ],
  },

  services: {
    eyebrow: "02 — Core Services",
    title: "Simulate Before You Build.",
    body: "다섯 단계는 하나의 파이프라인입니다. 고객의 개발을 대신하지 않고, 그 개발이 이 위에서 돌게 만듭니다.",
  },

  workflow: {
    eyebrow: "03 — Simulation Workflow",
    title: "A Loop, Not a Line",
    body: "실기에서 잰 차이가 모델로 되돌아옵니다. 한 바퀴 돌 때마다 추정값이 실측값으로 바뀝니다.",
  },

  projects: {
    eyebrow: "04 — Selected Projects",
    title: "Case Studies",
    body: "로봇을 대신 만든 기록이 아니라, 그 개발이 무엇 위에서 돌았는지의 기록입니다.",
    cta: { label: "VIEW ALL PROJECTS", href: "/projects" },
  },

  technology: {
    eyebrow: "05 — Engineering Stack",
    title: "Tools With a Job",
    body: "기술 이름이 아니라, 그 기술이 이 파이프라인에서 맡는 역할로 설명합니다.",
    cta: { label: "VIEW ENGINEERING STACK", href: "/technology" },
  },

  why: {
    eyebrow: "06 — Why Simulation First",
    title: "Engineering Before Assumption.",
    body: "가상환경에서 발견한 문제는 수정 비용이 거의 들지 않습니다. 실물에서 발견하면 그렇지 않습니다. 다만 그러려면 시뮬레이션이 믿을 만해야 하고, 도구를 다루는 것과 로봇을 아는 것은 다른 일입니다 — 그 차이는 결론이 아니라 결론에 붙은 신뢰 등급에서 드러납니다.",
    mediaSlot: "home-why",
  },

  contact: {
    eyebrow: "07",
    title: "Start a Project",
    body: "로봇이 무엇을 해야 하는지, 어떤 환경에서 어떤 순서로 하는지 알려주세요. 그 시나리오를 그대로 돌려볼 수 있는 디지털 테스트베드를 만들어 드립니다.",
    mediaSlot: "home-contact",
  },
});
