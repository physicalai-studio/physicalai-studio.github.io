import type { CustomerSegment } from "@/content/schema";

/**
 * 고객군 표 — 방문자가 **자기를 알아보는** 자리(사업_정의.md §4).
 *
 * 설득 문장을 두지 않는다. `가진 것 → 겪는 것 → 받는 것` 세 칸을 나란히 두면
 * 방문자가 자기 줄을 스스로 찾는다. 판정을 우리가 대신하지 않는 것이 이 블록의 설계다.
 *
 * 카드가 아니라 선으로만 나눈다(타이포그래피 §4). 좁은 화면에서는 세 칸이 한 단으로 접히고,
 * 그때 각 칸이 무엇인지 알 수 있도록 작은 모노 라벨을 함께 접어 둔다.
 */
export function CustomerTable({
  segments,
  className = "",
}: {
  segments: readonly CustomerSegment[];
  className?: string;
}) {
  return (
    <dl className={`border-t border-line ${className}`}>
      {segments.map((segment) => (
        <div
          key={segment.id}
          className="grid gap-6 border-b border-line py-8 md:grid-cols-12 md:gap-10"
        >
          <dt className="text-sm leading-snug font-semibold tracking-[0.05em] md:col-span-3">
            {segment.label}
          </dt>
          <dd className="grid gap-6 md:col-span-9 md:grid-cols-3 md:gap-10">
            <Cell label="has" body={segment.has} />
            <Cell label="pain" body={segment.pain} />
            <Cell label="gets" body={segment.gets} tone="fg" />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * 한 칸. `gets` 만 본문색으로 올린다 — 세 칸 중 방문자가 가져갈 것은 그것 하나다.
 */
function Cell({
  label,
  body,
  tone = "muted",
}: {
  label: string;
  body: string;
  tone?: "muted" | "fg";
}) {
  return (
    <div>
      <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-faint uppercase">{label}</p>
      <p className={`mt-2 text-sm leading-relaxed ${tone === "fg" ? "text-fg" : "text-muted"}`}>
        {body}
      </p>
    </div>
  );
}
