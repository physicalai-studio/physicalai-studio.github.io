import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** 한 화면을 통째로 쓰는 섹션 — "ONE SCREEN, ONE MESSAGE" (디자인 컨셉 §16). */
  fullHeight?: boolean;
  /** 상단 구분선. 섹션 경계를 카드가 아니라 선 하나로 표현한다. */
  bordered?: boolean;
  wide?: boolean;
  className?: string;
};

export function Section({
  children,
  id,
  fullHeight = false,
  bordered = false,
  wide = false,
  className = "",
}: SectionProps) {
  const heightClass = fullHeight ? "min-h-svh flex items-center" : "";
  const paddingClass = fullHeight ? "py-24" : "py-(--spacing-section)";
  const borderClass = bordered ? "border-t border-line" : "";

  return (
    <section id={id} className={`${heightClass} ${paddingClass} ${borderClass} ${className}`}>
      <Container wide={wide}>{children}</Container>
    </section>
  );
}
