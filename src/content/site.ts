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
  positioning: "Simulation-First Robot Engineering",
  description:
    "만들어지기 전에 시뮬레이션에서 검토하고, 만들어진 뒤에는 시뮬레이션과 실물의 차이를 숫자로 좁힙니다.",
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
