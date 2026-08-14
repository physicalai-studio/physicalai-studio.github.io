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
    로봇을 만드는 주체는 고객이고, 우리는 그 개발이 올라탈 환경을 만든다.
    이 한 줄이 흐려지면 사이트가 SI 업체 소개로 읽힌다.
  */
  positioning: "Simulation Engineering for Robot Development",
  description:
    "로봇 개발이 하드웨어를 기다리지 않고 돌아가게 만듭니다. 시뮬레이션에서 출발해, 개발 내내 돌아가고, 실기 배포에서 닫히는 하나의 파이프라인입니다.",
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
