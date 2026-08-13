import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { company } from "@/content/company";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About",
  description: "규모가 아니라 문제를 끝까지 파는 깊이로 일합니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="relative">
      <PageBackdrop slotId="about-backdrop" />
      <div className="relative">
        {/* 디자인 컨셉 §12: Founder 소개보다 Philosophy 를 먼저 보여준다. */}
        <Section wide fullHeight>
          <div>
            <h1 className="max-w-[16ch] text-(length:--text-headline) leading-[1.05] font-semibold tracking-tight uppercase">
              {company.philosophy}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              {company.philosophyBody}
            </p>
          </div>
        </Section>

        <Section bordered wide>
          <SectionHeading eyebrow="Principles" title="How We Work" />
          <dl className="mt-12 border-t border-line">
            {company.principles.map((principle) => (
              <div
                key={principle.title}
                className="grid gap-4 border-b border-line py-8 md:grid-cols-[1fr_2fr] md:gap-16"
              >
                <dt className="text-sm font-semibold tracking-[0.15em] uppercase">
                  {principle.title}
                </dt>
                <dd className="leading-relaxed text-muted">{principle.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section bordered wide>
          <SectionHeading eyebrow={company.founder.role} title="Founder" />
          <p className="mt-8 max-w-2xl leading-relaxed text-muted">{company.founder.summary}</p>
        </Section>
      </div>
    </div>
  );
}
