type SectionHeadingProps = {
  /** 섹션 번호나 분류 라벨. 작게, 넓은 자간으로 표시한다. */
  eyebrow?: string;
  title: string;
  body?: string;
  /** 페이지 최상단 제목이면 `h1`, 그 외 섹션은 `h2`. */
  as?: "h1" | "h2";
};

/** 섹션 제목 블록. 타이포 스케일을 이 한 곳에서만 정의한다 (디자인 컨셉 §6). */
export function SectionHeading({ eyebrow, title, body, as = "h2" }: SectionHeadingProps) {
  const Heading = as;
  const titleSize = as === "h1" ? "text-(length:--text-headline)" : "text-(length:--text-title)";

  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-6 font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className={`${titleSize} leading-[1.05] font-semibold tracking-tight uppercase`}>
        {title}
      </Heading>
      {body ? <p className="mt-6 max-w-2xl leading-relaxed text-muted">{body}</p> : null}
    </div>
  );
}
