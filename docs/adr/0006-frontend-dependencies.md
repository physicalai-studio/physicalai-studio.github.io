# ADR-0006 — 프론트엔드 의존성 채택

## Status

Accepted (2026-08-13)

## Context

coding SOP §3 는 의존성(패키지) 추가 시 License · 취약점 · 대안 3필드를 ADR 에 남기도록 한다. Phase 1 에서 도입한 패키지를 여기에 기록한다.

## Decision

| 패키지                          | 버전        | 용도                 | License    | 대안                             |
| ------------------------------- | ----------- | -------------------- | ---------- | -------------------------------- |
| `next`                          | 16.3.0      | 프레임워크 · 라우팅  | MIT        | Astro, SvelteKit, 순수 정적 생성 |
| `react` / `react-dom`           | 19.2.8      | UI 렌더링            | MIT        | Svelte, Vue                      |
| `zod`                           | ^4.4.3      | 콘텐츠 스키마 검증   | MIT        | valibot, 수동 타입 가드          |
| `tailwindcss`                   | ^4          | 스타일 · 디자인 토큰 | MIT        | CSS Modules, vanilla-extract     |
| `typescript`                    | ^5          | 정적 타입            | Apache-2.0 | JSDoc 타입 주석                  |
| `eslint` + `eslint-config-next` | ^9 / 16.3.0 | 정적 분석            | MIT        | Biome                            |
| `prettier`                      | ^3.9.6      | 포맷 강제            | MIT        | Biome, dprint                    |
| `vitest`                        | ^4.1.10     | 단위 테스트          | MIT        | node:test, Jest                  |

취약점: 설치 시점 `npm audit` 결과 **0건**(2026-08-13, 401 패키지).

**의도적으로 채택하지 않은 것**:

- 카드 중심 UI 킷(shadcn/ui 등) — 디자인 컨셉 §17 "Rounded Card 금지"와 정면 충돌
- three.js 등 3D 렌더 라이브러리 — 가이드 §21 "의미 없는 3D Animation" 금지
- Framer Motion — 디자인 컨셉 §8 이 허용한 효과는 CSS transition + IntersectionObserver 로 충분
- CMS · 상태관리 라이브러리 — 현재 요구 없음

## Consequences

- 의존성 수가 적어 1인 운영의 유지보수 부담이 낮다.
- 애니메이션 요구가 CSS 로 감당되지 않을 만큼 커지면 Framer Motion 도입을 별도 ADR 로 판단한다.
- `npm audit` 은 정기적으로 재실행해야 한다(현재 자동화 없음).

## Rollback

가역. 각 항목은 위 표의 대안으로 교체 가능하다. 단 `next` 교체는 사실상 재작성이므로, 프레임워크 변경은 별도 ADR 로 다룬다.
