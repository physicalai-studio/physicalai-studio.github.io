import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { site } from "@/content/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Start a Project",
  description: "로봇이 무엇을 해야 하는지 알려주시면 검토 방향을 회신드립니다.",
  path: "/contact",
});

/**
 * Contact (디자인 컨셉 §13).
 *
 * Phase 1 은 진입 화면과 이메일 경로까지다.
 * 입력 폼 · 검증 · 개인정보 수집 동의 · 전송 어댑터는 Phase 4 에서 구현한다 (ADR-0004 확정 후).
 */
export default function ContactPage() {
  return (
    <div className="relative">
      <PageBackdrop slotId="contact-backdrop" />
      <Section wide fullHeight className="relative">
        <div>
          <h1 className="text-(length:--text-headline) leading-[1.05] font-semibold tracking-tight uppercase">
            Start a Project
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            로봇이 무엇을 해야 하는지 알려주세요. 검토 가능한 범위와 접근 방향을 회신드립니다.
          </p>

          <div className="mt-16 border-t border-line pt-8">
            <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
              email
            </p>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-4 inline-block text-(length:--text-title) tracking-tight transition-colors hover:text-accent"
            >
              {site.contactEmail}
            </a>
          </div>

          <SectionHeading
            eyebrow="Coming next"
            title="Project Inquiry Form"
            body="프로젝트 유형과 내용을 입력하는 문의 폼은 다음 단계에서 제공합니다. 그전까지는 이메일로 문의해 주세요."
          />
        </div>
      </Section>
    </div>
  );
}
