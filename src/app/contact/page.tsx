import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { contactDescription, contactPage } from "@/content/contact";
import { site } from "@/content/site";
import { engagement } from "@/content/engagement";
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

          <div className="mt-24 grid gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="What to Send" title="있는 자료부터 보내주세요" />
              <ul className="mt-8 border-t border-line">
                {engagement.inquiry.inputs.map((input) => (
                  <li key={input} className="border-b border-line py-4 text-sm text-muted">
                    {input}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading
                eyebrow="First Response"
                title="범위부터 확인합니다"
                body={engagement.inquiry.response}
              />
              <p className="mt-8 text-sm leading-relaxed text-muted">
                {engagement.inquiry.confidentiality}
              </p>
            </div>
          </div>

          <div className="mt-24">
            <SectionHeading eyebrow="Engagement" title="문의에서 인계까지" />
            <ol className="mt-8 grid gap-px border border-line bg-line md:grid-cols-4">
              {engagement.inquiry.steps.map((step, index) => (
                <li key={step} className="bg-bg p-6">
                  <p className="font-mono text-(length:--text-eyebrow) text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </div>
  );
}
