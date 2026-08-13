import { sectionHeadingSchema } from "./schema";

/**
 * Contact 페이지 문구.
 *
 * 컴포넌트에 문자열로 박혀 있던 것을 옮겼다(ADR-0003).
 *
 * **무엇을 요청하는 화면인가** — 이 자리는 "사양서를 주세요"가 아니다.
 * 고객이 가진 것은 대개 목적과 현장뿐이고, 검토에 필요한 로봇 · 설비 모델과 작업 공간,
 * 시나리오는 **우리가 만들어 공급한다.** 그래서 요청하는 것을 둘로만 줄였다 —
 * 무엇을 해야 하는지, 어디에서 하는지.
 */
export const contactPage = sectionHeadingSchema.parse({
  eyebrow: "Contact",
  title: "Start a Project",
  body: "로봇이 무엇을 해야 하는지, 어떤 환경에서 하는지 알려주세요. 검토에 필요한 시뮬레이션 자산과 환경 시나리오는 저희가 만듭니다 — 로봇 · 설비 모델과 작업 공간, 작업 순서까지 갖춘 상태로 결과를 드립니다.",
});

/** 검색 결과에 나가는 한 줄. 본문보다 짧게 줄인다. */
export const contactDescription =
  "로봇이 할 일과 환경을 알려주시면, 시뮬레이션 자산과 환경 시나리오까지 만들어 검토 결과를 드립니다.";
