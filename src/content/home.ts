import { homeSchema } from "./schema";

/**
 * 홈 페이지 문구 (가이드 §8).
 *
 * 섹션 순서는 가이드가 정한 대로 유지한다:
 * Problems → Services → How We Work → Projects → Technology → Why → Contact.
 * 각 섹션은 짧은 문장 하나로 승부한다 (디자인 컨셉 §7 SHORT COPY).
 */
export const home = homeSchema.parse({
  hero: {
    /*
      첫 화면은 **무엇을 만들어 주는가**를 말한다(ADR-0010).

      이전 문구는 "우리는 시뮬레이션, 당신은 로봇"이라는 역할 경계 선언이었다. 그러면
      방문자가 30초 안에 받는 인상이 "이 회사가 무엇을 안 하는가"가 되고, 정작 제공물이
      보이지 않는다. 방문자가 알아야 할 것은 **여기서 무엇을 받는가**다.

      "FAST" 는 기간 숫자를 걸지 않는다 — 근거 없는 수치를 쓰지 않는 것이 이 사이트의 규칙이고
      (사업_정의.md §2), 대신 바로 아래 `site.description` 이 무엇을 세워 주는지로 뒷받침한다.
    */
    headlineLines: ["Simulation Assets,", "Built Fast."],
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
    body: "다섯 단계는 하나의 파이프라인입니다. 각 단계에서 무엇을 세워 넘겨 드리는지로 적었습니다.",
  },

  /*
    제목은 `company.howWeWork.title` 이 단일 근원이다 — About 과 홈이 같은 문장을 보여야 하므로
    여기서 다시 적지 않는다. 본문만 홈의 진입 문맥에 맞춰 짧게 둔다.
  */
  howWeWork: {
    eyebrow: "03 — How We Work",
    body: "해결책에서 시작하지 않습니다. 현실에서 시작합니다. 고객이 가져온 것은 아직 사실이 아니라 가정이고, 그것이 근거가 되려면 다섯 개의 문을 지나야 합니다.",
  },

  projects: {
    eyebrow: "04 — Selected Projects",
    title: "Case Studies",
    body: "무엇을 세워 넘겼고, 그 위에서 무엇이 돌았고, 실기와 얼마나 맞았는지의 기록입니다.",
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
    body: "가상환경에서 발견한 문제는 수정 비용이 거의 들지 않습니다. 실물에서 발견하면 그렇지 않습니다. 다만 빨리 세우는 것만으로는 부족합니다 — 그 에셋에서 나온 숫자가 실기의 숫자와 항목별로 맞대 볼 수 있어야 하고, 그래서 모든 결론에 신뢰 등급을 붙여 드립니다.",
    mediaSlot: "home-why",
  },

  contact: {
    eyebrow: "07",
    title: "Start a Project",
    body: "로봇이 무엇을 해야 하는지, 어떤 환경에서 어떤 순서로 하는지 알려주세요. 그 시나리오를 그대로 돌려볼 수 있는 디지털 테스트베드를 만들어 드립니다.",
    mediaSlot: "home-contact",
  },
});
