/**
 * 최소 인라인 마크업 — `**강조**` 하나만 해석한다.
 *
 * **왜 필요한가** — 콘텐츠 계층(`src/content/*.ts`)의 본문은 JSX 가 아니라 문자열이다
 * (ADR-0003). 그래서 문장 안에서 강조 구간을 지정할 방법이 없었고, 케이스 스터디 본문에
 * 적어 둔 `**...**` 가 화면에 별표 그대로 나갔다.
 *
 * **왜 마크다운 파서를 쓰지 않는가** — 파서를 들이면 콘텐츠에 링크·이미지·원시 HTML 이
 * 섞일 수 있고, 그 순간 "문구는 콘텐츠 계층, 구조는 컴포넌트"라는 경계가 무너진다.
 * 실제로 쓰는 강조는 굵게 하나뿐이므로 그것만 지원한다.
 */

/** 문장을 강조 구간과 평문 구간으로 자른 조각. */
export type InlineSegment = {
  text: string;
  isStrong: boolean;
};

/**
 * 별표 두 개로 감싼 구간을 찾는다.
 *
 * 안쪽에 `*` 를 허용하지 않는다 — 허용하면 문장 전체를 한 덩어리로 삼켜
 * 열고 닫지 않은 마크업이 조용히 통과한다.
 */
const STRONG_PATTERN = /\*\*([^*]+)\*\*/g;

/** 문장을 조각으로 자른다. 마크업이 없으면 평문 1개짜리 배열을 돌려준다. */
export function parseInline(source: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let cursor = 0;

  for (const match of source.matchAll(STRONG_PATTERN)) {
    const start = match.index;
    if (start > cursor) {
      segments.push({ text: source.slice(cursor, start), isStrong: false });
    }
    segments.push({ text: match[1]!, isStrong: true });
    cursor = start + match[0].length;
  }

  if (cursor < source.length) {
    segments.push({ text: source.slice(cursor), isStrong: false });
  }
  return segments;
}

/**
 * 해석되지 않고 남은 마크업 기호가 있는지 본다.
 *
 * 짝이 맞지 않는 `**` 는 화면에 별표로 그대로 나가지만 빌드는 통과한다.
 * 콘텐츠 회귀 테스트가 이 함수로 그 상태를 잡는다.
 */
export function hasUnparsedMarkup(source: string): boolean {
  return parseInline(source).some((segment) => !segment.isStrong && segment.text.includes("*"));
}
