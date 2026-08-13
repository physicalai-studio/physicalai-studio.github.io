import { Reveal } from "@/components/common/Reveal";
import { MediaSlot } from "@/components/media/MediaSlot";
import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { technologyGroups, workflowSteps } from "@/content/technology";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Technology",
  description: "각 기술이 프로젝트에서 실제로 어떤 역할을 하는지 기술합니다.",
  path: "/technology",
});

export default function TechnologyPage() {
  return (
    <div className="relative">
      <PageBackdrop slotId="technology-backdrop" />
      <div className="relative">
        <Section wide className="pt-40">
          <SectionHeading
            as="h1"
            eyebrow="Technology"
            title="Engineering Stack"
            body="기술 이름을 나열하는 대신, 각 기술이 프로젝트에서 맡는 역할을 적습니다."
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

        {technologyGroups.map((group) => (
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
      </div>
    </div>
  );
}
