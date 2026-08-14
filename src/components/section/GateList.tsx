import type { WorkGate } from "@/content/schema";

type GateListProps = {
  gates: readonly WorkGate[];
  className?: string;
};

/**
 * HOW WE WORK 의 다섯 문(docs/how_we_work.md).
 *
 * 홈과 About 이 같은 목록을 그리므로 마크업을 한 곳에만 둔다.
 * 5열 그리드로 늘어놓지 않는 이유는 각 문의 본문이 길기 때문이다 — 번호 · 제목 · 본문을
 * 가로로 배치한 행이 읽는 속도를 유지한다(Problems · Services 섹션과 같은 규격).
 *
 * 순서에 의미가 있으므로(문을 차례로 통과한다) `ol` 로 둔다.
 */
export function GateList({ gates, className }: GateListProps) {
  return (
    <ol className={`border-t border-line ${className ?? ""}`}>
      {gates.map((gate) => (
        <li
          key={gate.id}
          className="grid gap-4 border-b border-line py-8 md:grid-cols-[4rem_1fr_1.6fr] md:gap-8"
        >
          <span className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint">
            {gate.index}
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] uppercase">{gate.title}</h3>
            <p className="mt-2 text-sm text-faint">{gate.titleKo}</p>
          </div>
          <p className="leading-relaxed text-muted">{gate.body}</p>
        </li>
      ))}
    </ol>
  );
}
