import { siteSchema } from "./schema";

/**
 * 사이트 전역 설정.
 *
 * `brand` / `baseUrl` 은 아직 확정되지 않았다 (docs/프로젝트_메타.md D1).
 * 확정 시 이 파일의 값만 교체하면 되며, 컴포넌트 수정은 필요 없다.
 */
export const site = siteSchema.parse({
  brand: "PHYSICAL AI STUDIO",
  brandIsProvisional: true,
  /*
    포지셔닝은 **로봇 엔지니어링이 아니라 시뮬레이션 엔지니어링**이다(사업_정의.md §1-1).
    다만 그것을 "우리는 로봇을 안 만든다"로 쓰지 않는다 — 안 하는 일이 아니라
    **세워 주는 것**으로 말한다(ADR-0010). 이 한 줄이 흐려지면 사이트가 SI 업체 소개로 읽힌다.
  */
  positioning: "Simulation Engineering for Robot Development",
  description:
    "로봇 · 설비 · 환경을 시뮬레이션 에셋으로 세우고, 작업 시나리오가 그대로 돌아가는 테스트베드까지 만들어 드립니다. 실기가 오기 전에 제어와 인지 개발이 여기에 붙습니다.",
  // 배포 시 NEXT_PUBLIC_SITE_URL 로 주입한다. 미설정이면 해석되지 않는 예약 도메인을 쓴다
  // — 실제 도메인 오기입 상태로 색인되는 사고를 막기 위함이다(debt-005).
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.invalid",
  contactEmail: "selele@nate.com",
  contactPhone: "+82 10-7475-2889",
  nav: [
    { label: "SERVICES", href: "/services" },
    { label: "PROJECTS", href: "/projects" },
    { label: "TECHNOLOGY", href: "/technology" },
    { label: "ABOUT", href: "/about" },
  ],
  cta: {
    primary: { label: "START A PROJECT", href: "/contact" },
    secondary: { label: "VIEW OUR WORK", href: "/projects" },
  },
});
