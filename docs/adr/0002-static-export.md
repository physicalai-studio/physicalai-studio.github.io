# ADR-0002 — 렌더링 모드: 정적 export

## Status

Accepted (2026-08-13)

## Context

Cloudflare Pages(ADR-0001)에 Next.js 를 올리는 방법은 두 가지다.

1. `output: "export"` — 정적 HTML 을 생성해 그대로 서빙
2. `@cloudflare/next-on-pages` — edge 런타임에서 Next.js 서버 기능을 실행

사이트 콘텐츠는 전부 빌드 시점에 확정되는 정적 콘텐츠다. 서버 렌더링이 필요한 화면은 현재 없다.

## Decision

**정적 export(`output: "export"`)** 를 사용한다. 서버 처리가 필요한 문의 폼만 Pages Functions 로 분리한다(ADR-0004).

`next.config.ts` 설정:

- `output: "export"`
- `images: { unoptimized: true }` — 런타임 이미지 최적화가 없으므로 자산을 사전 최적화한다
- `trailingSlash: true` — 정적 호스트에서 경로별 `index.html` 로 서빙

## Consequences

- `next/image` 의 런타임 최적화, ISR, 서버 액션을 쓸 수 없다.
- 동적 라우트(`/projects/[slug]`)는 `generateStaticParams` 로 경로를 전부 나열해야 하고, **최소 1개 이상**이어야 빌드가 성립한다 → debt-004.
- `sitemap.ts` · `robots.ts` 에 `export const dynamic = "force-static"` 이 필요하다.
- 빌드 산출물이 순수 정적 파일이라 호스트 이전 비용이 낮다.

## Rollback

가역. `next-on-pages` 로 전환하려면 `output: "export"` 를 제거하고 어댑터를 추가하면 된다. 페이지 코드 자체는 대부분 그대로 쓸 수 있다.
