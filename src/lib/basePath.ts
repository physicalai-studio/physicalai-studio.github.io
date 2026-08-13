/**
 * 배포 경로 접두사.
 *
 * GitHub Pages 프로젝트 사이트처럼 하위 경로(`/homepage`)에 배포되면 모든 절대 경로에
 * 접두사가 필요하다. Next.js 는 `next/link` 와 `next/image` 에는 `basePath` 를 자동 적용하지만
 * **`<img src>` 같은 원시 속성에는 적용하지 않는다.** 그래서 그런 경로는 이 함수를 거친다.
 *
 * 루트 도메인 배포(Cloudflare Pages 등)에서는 빈 문자열이라 아무 영향이 없다.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** `/media/x.webp` → `/homepage/media/x.webp` (접두사가 설정된 경우). */
export function withBasePath(path: string): string {
  if (!BASE_PATH) return path;
  // 외부 URL 은 그대로 둔다 — 영상은 외부 스토리지에 있을 수 있다(ADR-0005).
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_PATH}${path}`;
}

/**
 * 사이트 절대 URL 을 만든다.
 *
 * `new URL("/services", "https://x.github.io/homepage")` 는 선행 슬래시 때문에
 * `https://x.github.io/services` 가 되어 **하위 경로가 날아간다.** 그래서 문자열로 잇는다.
 */
export function absoluteUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}
