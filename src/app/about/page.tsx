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
        {/*
          디자인 컨셉 §12: Founder 소개보다 Philosophy 를 먼저 보여준다.
          첫 섹션 여백은 다른 본문형 페이지(Services · Projects · Technology)와 같은
          `pt-40` + `SectionHeading` 규격을 쓴다 — docs/타이포그라피.md §3.
        */}
        <Section wide className="pt-40">
          <SectionHeading
            as="h1"
            eyebrow="About"
            title={company.philosophy}
            body={company.philosophyBody}
          />
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
          <SectionHeading eyebrow={company.founder.role} title={company.founder.name} />
          <p className="mt-8 max-w-2xl leading-relaxed text-muted">{company.founder.summary}</p>
        </Section>
      </div>
    </div>
  );
}
