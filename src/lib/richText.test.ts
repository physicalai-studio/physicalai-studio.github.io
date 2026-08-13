import { describe, expect, it } from "vitest";
import { hasUnparsedMarkup, parseInline } from "./richText";

describe("parseInline", () => {
  it("마크업이 없으면 평문 한 조각을 돌려준다", () => {
    expect(parseInline("평범한 문장")).toEqual([{ text: "평범한 문장", isStrong: false }]);
  });

  it("문장 가운데의 강조를 잘라낸다", () => {
    expect(parseInline("앞 **가운데** 뒤")).toEqual([
      { text: "앞 ", isStrong: false },
      { text: "가운데", isStrong: true },
      { text: " 뒤", isStrong: false },
    ]);
  });

  it("문장 처음과 끝의 강조도 잘라낸다", () => {
    expect(parseInline("**처음**")).toEqual([{ text: "처음", isStrong: true }]);
  });

  it("강조를 여러 번 쓸 수 있다", () => {
    const segments = parseInline("**하나** 와 **둘**");
    expect(segments.filter((segment) => segment.isStrong).map((segment) => segment.text)).toEqual([
      "하나",
      "둘",
    ]);
  });

  it("빈 문자열은 조각이 없다", () => {
    expect(parseInline("")).toEqual([]);
  });
});

describe("hasUnparsedMarkup", () => {
  it("짝이 맞는 마크업은 남기지 않는다", () => {
    expect(hasUnparsedMarkup("정상 **강조** 문장")).toBe(false);
  });

  it("열고 닫지 않은 별표를 잡는다", () => {
    // 배포된 페이지에 별표가 그대로 나갔던 결함(2026-08-13)의 회귀 테스트다.
    expect(hasUnparsedMarkup("**열기만 한 문장")).toBe(true);
    expect(hasUnparsedMarkup("별표 * 하나")).toBe(true);
  });
});
