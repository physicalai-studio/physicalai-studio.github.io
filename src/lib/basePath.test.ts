import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./basePath";

describe("absoluteUrl", () => {
  it("하위 경로가 있는 baseUrl 에서도 경로가 날아가지 않는다", () => {
    // new URL("/services", base) 를 쓰면 하위 경로가 사라진다. 그 회귀를 막는다.
    expect(absoluteUrl("https://x.github.io/homepage", "/services")).toBe(
      "https://x.github.io/homepage/services",
    );
  });

  it("baseUrl 끝의 슬래시를 중복하지 않는다", () => {
    expect(absoluteUrl("https://example.com/", "/sitemap.xml")).toBe(
      "https://example.com/sitemap.xml",
    );
  });

  it("루트 도메인 배포에서도 그대로 동작한다", () => {
    expect(absoluteUrl("https://example.com", "/")).toBe("https://example.com/");
  });
});
