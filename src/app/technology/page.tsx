import { Reveal } from "@/components/common/Reveal";
import { MediaSlot } from "@/components/media/MediaSlot";
import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { fidelityHeading, fidelityLayers } from "@/content/delivery";
import { technologyGroups, workflowSteps } from "@/content/technology";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Technology",
  description: "각 기술이 프로젝트에서 실제로 어떤 역할을 하는지 기술합니다.",
  path: "/technology",
});

export default function TechnologyPage() {
  const deliveryGroups = technologyGroups.filter((group) => group.stage === "delivery");
  const researchGroups = technologyGroups.filter((group) => group.stage === "research");
  return (
    <div className="relative">
      <PageBackdrop slotId="technology-backdrop" />
      <div className="relative">
        <Section wide className="pt-40">
          <SectionHeading
            as="h1"
            eyebrow="Technology"
            title="Engineering Stack"
            body="기술 이름을 나열하는 대신, 각 기술이 이 파이프라인에서 맡는 역할을 적습니다."
          />
        </Section>

        <Section bordered wide>
          <SectionHeading eyebrow="Workflow" title="Problem → Deploy" />
          <ol className="mt-12 grid gap-px border border-line bg-line md:grid-cols-5">
            {workflowSteps.map((step, index) => (
              <li key={step.id} className="bg-bg p-6">
                <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 text-sm font-semibold tracking-[0.15em] uppercase">
                  {step.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/*
          충실도 선언 — "실제와 같습니다"를 대신하는 자리(사업_정의.md §6 ②).
          층을 나눠 적으면 고객이 이 환경에서 어떤 질문에 답할 수 있는지 스스로 판단한다.
        */}
        <Section bordered wide>
          <SectionHeading
            eyebrow={fidelityHeading.eyebrow}
            title={fidelityHeading.title}
            body={fidelityHeading.body}
          />
          <dl className="mt-12 border-t border-line">
            {fidelityLayers.map((layer) => (
              <div
                key={layer.code}
                className="grid gap-2 border-b border-line py-6 md:grid-cols-[5rem_10rem_1fr] md:items-baseline md:gap-8"
              >
                <dt className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint">
                  {layer.code}
                </dt>
                <dd className="text-sm font-semibold tracking-[0.15em] uppercase">{layer.title}</dd>
                <dd className="text-sm leading-relaxed text-muted">{layer.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section bordered wide>
          <SectionHeading
            eyebrow="Delivery Stack"
            title="현재 프로젝트에 사용하는 기술"
            body="아래 항목은 모델 구성, 검증, 실기 연동과 인계에 실제로 사용하는 기술입니다."
          />
        </Section>

        {deliveryGroups.map((group) => (
          <Section key={group.id} id={group.id} bordered wide>
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
                <div>
                  <h2 className="text-(length:--text-title) font-semibold tracking-tight uppercase">
                    {group.title}
                  </h2>
                  {group.mediaSlot ? (
                    <MediaSlot slotId={group.mediaSlot} className="mt-8 aspect-square w-full" />
                  ) : null}
                </div>
                <dl className="border-t border-line">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="grid gap-2 border-b border-line py-6 md:grid-cols-[1fr_2fr] md:gap-8"
                    >
                      <dt className="font-medium">{item.name}</dt>
                      <dd className="text-sm leading-relaxed text-muted">{item.role}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </Section>
        ))}

        <Section bordered wide>
          <SectionHeading
            eyebrow="Research Extension"
            title="요건이 맞을 때 확장하는 연구 기술"
            body="강화학습·모방학습과 Foundation Policy는 기본 납품 범위가 아닙니다. 고객이 정책, 데이터와 평가 기준을 보유한 경우 테스트베드 위에 연결할 범위를 별도로 합의합니다."
          />
        </Section>

        {researchGroups.map((group) => (
          <Section key={group.id} id={group.id} bordered wide>
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
                <h2 className="text-(length:--text-title) font-semibold tracking-tight uppercase">
                  {group.title}
                </h2>
                <dl className="border-t border-line">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="grid gap-2 border-b border-line py-6 md:grid-cols-[1fr_2fr] md:gap-8"
                    >
                      <dt className="font-medium">{item.name}</dt>
                      <dd className="text-sm leading-relaxed text-muted">{item.role}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </Section>
        ))}
      </div>
    </div>
  );
}
