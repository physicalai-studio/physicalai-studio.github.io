import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { contactDescription, contactPage } from "@/content/contact";
import { site } from "@/content/site";
import { telHref } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: contactPage.title,
  description: contactDescription,
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
            {contactPage.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{contactPage.body}</p>

          <div className="mt-16 grid gap-10 border-t border-line pt-8 sm:grid-cols-2">
            <div>
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
            <div>
              <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
                phone
              </p>
              <a
                href={telHref()}
                className="mt-4 inline-block text-(length:--text-title) tracking-tight transition-colors hover:text-accent"
              >
                {site.contactPhone}
              </a>
            </div>
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
