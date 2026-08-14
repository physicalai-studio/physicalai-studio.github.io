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
    포지셔닝은 **Simulation Infrastructure** 다(사업_정의.md §1).
    로봇도 지능도 고객의 것이고, 우리는 그 둘이 만나 실험할 수 있는 세계를 만든다.
    "로봇 엔지니어링"으로 쓰면 SI 로, "3D 시뮬레이션"으로 쓰면 영상 외주로 읽힌다.
  */
  positioning: "Simulation Infrastructure for Robotics R&D",
  description:
    "고객은 로봇을 가져오고, 지능을 가져옵니다. 우리는 둘이 실패해도 아무것도 부서지지 않는 세계를 먼저 만듭니다 — 다시 실행할 수 있는 디지털 테스트베드로.",
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
