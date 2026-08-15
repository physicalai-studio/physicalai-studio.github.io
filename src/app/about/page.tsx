import { GateList } from "@/components/section/GateList";
import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { company } from "@/content/company";
import { engagement } from "@/content/engagement";
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

        {/*
          HOW WE WORK 은 업무 순서가 아니라 아이디어가 통과해야 하는 문이다 —
          제목이 그 결과("가정을 근거로 바꾼다")를 먼저 말하고, 목록이 경로를 편다.
        */}
        <Section bordered wide>
          <SectionHeading
            eyebrow="How We Work"
            title={company.howWeWork.title}
            body={company.howWeWork.body}
          />
          <GateList gates={company.howWeWork.gates} className="mt-12" />
        </Section>

        <Section bordered wide>
          <SectionHeading eyebrow={company.founder.role} title={company.founder.name} />
          <p className="mt-8 max-w-2xl leading-relaxed text-muted">{company.founder.summary}</p>
        </Section>

        <Section bordered wide>
          <SectionHeading
            eyebrow={engagement.founderLed.eyebrow}
            title={engagement.founderLed.title}
            body={engagement.founderLed.body}
          />
          <ul className="mt-12 border-t border-line">
            {engagement.founderLed.boundaries.map((boundary) => (
              <li key={boundary} className="border-b border-line py-5 text-sm text-muted">
                {boundary}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
