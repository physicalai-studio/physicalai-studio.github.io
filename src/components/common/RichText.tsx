import { parseInline } from "@/lib/richText";

/**
 * 콘텐츠 문자열의 `**강조**` 를 굵은 글자로 렌더한다.
 *
 * 조각만 돌려주므로 감싸는 요소(`<p>` · `<li>` 등)는 호출부가 정한다 —
 * 문단 태그를 여기서 정해 버리면 목록 안에서 쓸 수 없다.
 *
 * 강조는 본문색(`--color-fg`)으로 올린다. 본문이 `text-muted` 인 자리에서
 * 굵기와 밝기가 함께 올라가야 강조로 읽힌다(타이포그래피 §6).
 * **액센트 초록은 쓰지 않는다** — 본문에 액센트를 넣지 않는다는 규칙이 우선한다.
 */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((segment, index) =>
        segment.isStrong ? (
          <strong key={index} className="font-semibold text-fg">
            {segment.text}
          </strong>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
