import Link from "next/link";

type ButtonVariant = "solid" | "outline";

type ButtonLinkProps = {
  href: string;
  children: string;
  variant?: ButtonVariant;
};

/**
 * 링크형 버튼.
 *
 * 디자인 컨셉 §3: 테두리 + 투명 배경으로 시작해 hover 시 흰색으로 채운다.
 * 그림자 · 그라디언트 · 라운드를 쓰지 않는다.
 */
export function ButtonLink({ href, children, variant = "outline" }: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center border px-8 py-4 text-xs tracking-[0.2em] uppercase transition-colors duration-300";
  const styles: Record<ButtonVariant, string> = {
    outline: "border-fg/40 text-fg hover:bg-fg hover:text-bg",
    solid: "border-fg bg-fg text-bg hover:bg-transparent hover:text-fg",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
