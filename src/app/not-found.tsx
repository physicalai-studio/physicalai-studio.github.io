import { ButtonLink } from "@/components/common/Button";
import { Section } from "@/components/section/Section";

export default function NotFound() {
  return (
    <Section fullHeight>
      <div>
        <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
          404
        </p>
        <h1 className="mt-6 text-(length:--text-headline) font-semibold tracking-tight uppercase">
          Page Not Found
        </h1>
        <p className="mt-6 text-muted">요청한 페이지가 존재하지 않습니다.</p>
        <div className="mt-12">
          <ButtonLink href="/">Back to Home</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
