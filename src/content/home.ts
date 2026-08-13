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
    headlineLines: ["Build in Simulation.", "Validate Before Reality."],
    mediaSlot: "home-hero",
  },

  problems: {
    eyebrow: "01 — Problems We Solve",
    title: "만든 뒤에 알면 늦는 것들",
    body: "이 문제들은 전부 제작 전에 가상환경에서 드러날 수 있습니다 — 그 시뮬레이션을 믿을 수 있을 때만.",
    items: [
      "이 구성으로 그 작업이 되는가?",
      "설비를 만들기 전에 간섭과 도달 범위를 확인하고 싶다.",
      "사이클 타임이 목표에 들어오는지 미리 알고 싶다.",
      "되는 줄 알았던 자세에서 컨트롤러가 멈춘다.",
      "시뮬레이션은 잘 도는데 실기가 다르게 움직인다.",
      "이 시뮬레이션 결과를 어디까지 믿어도 되는가?",
    ],
  },

  services: {
    eyebrow: "02 — Core Services",
    title: "Simulate Before You Build.",
    body: "다섯 단계는 하나의 루프입니다. 어느 지점에서든 들어올 수 있습니다.",
  },

  workflow: {
    eyebrow: "03 — Simulation Workflow",
    title: "A Loop, Not a Line",
    body: "실기에서 잰 차이가 모델로 되돌아옵니다. 한 바퀴 돌 때마다 추정값이 실측값으로 바뀝니다.",
  },

  projects: {
    eyebrow: "04 — Selected Projects",
    title: "Case Studies",
    body: "무엇을 검증했고 무엇이 확인되었는지를 기록합니다.",
    cta: { label: "VIEW ALL PROJECTS", href: "/projects" },
  },

  technology: {
    eyebrow: "05 — Engineering Stack",
    title: "Tools With a Job",
    body: "기술 이름이 아니라, 그 기술이 프로젝트에서 맡는 역할로 설명합니다.",
    cta: { label: "VIEW ENGINEERING STACK", href: "/technology" },
  },

  why: {
    eyebrow: "06 — Why Simulation First",
    title: "Engineering Before Assumption.",
    body: "가상환경에서 발견한 문제는 수정 비용이 거의 들지 않습니다. 실물에서 발견하면 그렇지 않습니다. 그래서 결론과 함께 그 결론의 신뢰 등급을 드립니다.",
    mediaSlot: "home-why",
  },

  contact: {
    eyebrow: "07",
    title: "Start a Project",
    body: "로봇이 무엇을 해야 하는지 알려주세요. 검토 가능한 범위와 접근 방향을 회신드립니다.",
    mediaSlot: "home-contact",
  },
});
