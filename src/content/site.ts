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
  positioning: "Simulation Testbeds for Robotics and Automation",
  description:
    "로봇 도입 전에는 공정과 후보 장비의 성립 가능성을 비교하고, 도입 후에는 동작 시나리오와 제어 연동을 검증합니다. 구매 판단부터 반복 사용할 디지털 테스트베드까지 연결합니다.",
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
