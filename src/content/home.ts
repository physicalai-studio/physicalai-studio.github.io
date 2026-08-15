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
      사업의 한 문장이 그대로 첫 화면이다(사업_정의.md §1).

      첫 줄이 **무엇을 만드는가**(자산이 아니라 세계), 나머지가 **왜 만드는가**다 —
      아직 존재하지 않는 현실을 먼저 설계해 본다는 뜻이고, 그래서 이 일은 예측이 아니라 공학이다.
      역할 경계("not the brain")는 첫 화면이 아니라 문서 §2 와 About 이 맡는다.

      줄바꿈 위치는 디자인이 정한다 — 뒤 문장을 두 줄로 끊어 세 줄이 계단으로 읽히게 했다.
    */
    headlineLines: ["Validate Before", "You Build."],
    mediaSlot: "home-hero",
  },

  problems: {
    /*
      **고객이 실제로 하는 말을 그대로 쓴다**(사업_정의.md §4 · 고객_분석.md).
      우리가 정리한 질문이 아니라 그들의 문장이어야 방문자가 읽다가 자기 상황을 알아본다.
      이 목록에서 한 줄이라도 자기 말이면 그 팀은 이미 고객이다 — 설득보다 인식이 먼저다.
    */
    eyebrow: "01 — Sound Familiar?",
    title: "이 중 하나라도 이번 주 회의에서 나온 말이라면",
    body: "전부 같은 결핍에서 나옵니다 — 반복해서 실험할 수 있는 디지털 환경이 없다는 것.",
    items: [
      "환경 구축할 사람이 없어서 실제 로봇에서만 테스트하고 있습니다.",
      "시뮬레이션을 해보고 싶긴 한데 사람이 없습니다.",
      "URDF 는 있는데 시뮬레이터에서 제대로 안 돌아갑니다.",
      "실제 장비가 아직 안 나왔는데 소프트웨어부터 개발해야 합니다.",
      "연구를 하고 싶은데 환경 구축이 너무 오래 걸립니다.",
      "고객마다 시뮬레이션을 처음부터 다시 만들고 있습니다.",
      "이 시뮬레이션 결과를 어디까지 믿어도 되는지 모르겠습니다.",
    ],
  },

  /*
    문제를 읽은 직후가 자격 판정 시점이다 — "그래서 나 같은 팀은 무엇을 받는가".
    설득 문장 없이 표로만 답한다(사업_정의.md §4).
  */
  customers: {
    eyebrow: "02 — Who This Is For",
    title: "이미 로봇이나 지능을 가진 팀",
    body: "없는 것은 그것을 반복해서 개발 · 검증 · 연구할 디지털 환경입니다. 그 자리를 우리가 만듭니다.",
  },

  services: {
    eyebrow: "03 — Product Ladder",
    title: "Two Ways to Start.",
    body: "제작 전 검증으로 빠르게 판단하거나, 반복 사용할 테스트베드를 구축합니다. 가상 시운전·실기 정합은 그 환경 위에서 확장하고, Physical AI 연구 환경은 정책과 평가 기준이 준비된 팀과 별도 범위로 진행합니다.",
  },

  howWeWork: {
    eyebrow: "04 — How We Work",
    body: "해결책에서 시작하지 않습니다. 현실에서 시작합니다. 고객이 가져온 것은 아직 사실이 아니라 가정이고, 그것이 근거가 되려면 다섯 개의 문을 지나야 합니다.",
  },

  projects: {
    eyebrow: "05 — Selected Projects",
    title: "Case Studies",
    body: "무엇을 세워 넘겼고, 그 위에서 무엇이 돌았고, 실기와 얼마나 맞았는지의 기록입니다.",
    cta: { label: "VIEW ALL PROJECTS", href: "/projects" },
  },

  technology: {
    eyebrow: "06 — Engineering Stack",
    title: "Tools With a Job",
    body: "현재 납품에 사용하는 실무 스택과, 고객 요건이 있을 때 검토하는 연구 기술을 구분해 설명합니다.",
    cta: { label: "VIEW ENGINEERING STACK", href: "/technology" },
  },

  why: {
    eyebrow: "07 — Why This Works",
    title: "Reproducibility Is Quality.",
    body: '"제 PC 에서는 됩니다"는 자산이 아닙니다. 다른 사람이 다른 장비에서 같은 실험을 다시 돌릴 수 있어야 다음 프로젝트에서 다시 만들지 않습니다. 그래서 Docker · 의존성 · 설정 · 버전 · 실행 구조가 산출물에 함께 들어갑니다 — 그리고 각 결론에는 그것이 어떤 값 위에 서 있는지가 등급으로 붙습니다.',
    mediaSlot: "home-why",
  },

  contact: {
    eyebrow: "08",
    title: "Start a Project",
    body: "로봇이 무엇을 해야 하는지, 어떤 환경에서 어떤 순서로 하는지 알려주세요. 그 시나리오를 그대로 돌려볼 수 있는 디지털 테스트베드를 만들어 드립니다.",
    mediaSlot: "home-contact",
  },
});
