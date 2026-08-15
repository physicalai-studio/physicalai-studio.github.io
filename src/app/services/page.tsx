import { Reveal } from "@/components/common/Reveal";
import { MediaSlot } from "@/components/media/MediaSlot";
import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { capabilitiesHeading, capabilityGroups } from "@/content/capabilities";
import { deliverableBundles, deliveryHeading } from "@/content/delivery";
import { services } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Services",
  description:
    "로봇 도입·구매 전 타당성 및 사양 검토와 재사용 가능한 시뮬레이션 테스트베드 구축. 가상 시운전과 Physical AI 환경은 필요에 따라 확장합니다.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="relative">
      <PageBackdrop slotId="services-backdrop" />
      <div className="relative">
        <Section wide className="pt-40">
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="Validate Before You Build."
            body="아직 로봇이 없어도 시작할 수 있습니다. 도입 여부와 구매 사양을 먼저 판단하고, 이후 검증 환경까지 이어갑니다."
          />
        </Section>

        {/*
          무엇을 받는가 — 기대치를 미리 맞추는 자리(사업_정의.md §7).
          파일 하나가 아니라 묶음이라는 것을 목록으로 보인다.
        */}
        <Section bordered wide>
          <Reveal>
            <SectionHeading
              eyebrow={deliveryHeading.eyebrow}
              title={deliveryHeading.title}
              body={deliveryHeading.body}
            />
            <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
              {deliverableBundles.map((bundle) => (
                <div key={bundle.id} className="bg-bg p-6">
                  <p className="text-sm font-semibold tracking-[0.15em] uppercase">
                    {bundle.title}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {bundle.items.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/*
        검증 항목 — 이 사이트가 "3D 영상이 아니라 엔지니어링 검증"이라고 말하는 근거.
        추상적인 주장 대신 실제로 측정하는 항목을 나열한다.
      */}
        <Section bordered wide>
          <Reveal>
            <SectionHeading
              eyebrow={capabilitiesHeading.eyebrow}
              title={capabilitiesHeading.title}
            />
            <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
              {capabilityGroups.map((group) => (
                <div key={group.id} className="bg-bg p-6">
                  <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
                    {group.title}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {group.items.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {services.map((service) => (
          <Section key={service.id} id={service.id} bordered wide>
            <Reveal>
              <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
                <div>
                  {/* 고객이 사는 단위는 다섯이 아니라 셋이다 — 제품 사다리를 함께 보인다(§5). */}
                  <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint">
                    {service.index}
                    <span className="ml-4 text-accent">PRODUCT {service.tier}</span>
                  </p>
                  <h2 className="mt-6 text-(length:--text-title) leading-tight font-semibold tracking-tight uppercase">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-sm text-faint">{service.titleKo}</p>
                  <p className="mt-8 text-lg leading-relaxed">{service.outcome}</p>
                  <p className="mt-4 leading-relaxed text-muted">{service.detail}</p>

                  <ul className="mt-10 border-t border-line">
                    {service.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="border-b border-line py-4 text-sm text-muted"
                      >
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>

                <MediaSlot slotId={service.mediaSlot} className="aspect-4/3 w-full" />
              </div>
            </Reveal>
          </Section>
        ))}
      </div>
    </div>
  );
}
