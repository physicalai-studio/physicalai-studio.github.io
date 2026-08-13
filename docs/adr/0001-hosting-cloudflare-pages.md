# ADR-0001 — 호스팅: Cloudflare Pages

## Status

Accepted (2026-08-13)

## Context

회사 홈페이지를 배포할 대상을 정해야 한다. 사이트는 영상 중심이고, 문의 폼에 서버 측 처리가 필요하며, 저장소는 현재 private 이다. 후보는 Cloudflare Pages · Vercel · GitHub Pages 세 가지였다.

## Decision

**Cloudflare Pages** 를 배포 대상으로 한다.

근거:

- 무료 요금제에서 상업적 이용이 허용된다. Vercel 무료(Hobby) 요금제는 상업적 이용을 허용하지 않아 회사 홈페이지에는 유료 전환이 필요하다.
- 대역폭 여유가 있어 영상 중심 사이트에 유리하다. GitHub Pages 는 무료 요금제 기준 저장소 public 이 필수이고 용량·대역폭 제한이 있다.
- Pages Functions 로 문의 폼 수신 경로를 만들 수 있다(ADR-0004).
- 저장소를 private 으로 유지한 채 연결할 수 있다.

## Consequences

- 저장소 공개 범위를 바꿀 필요가 없다.
- Vercel 전용 기능(ISR, `next/image` 런타임 최적화)에 의존하지 않는 구성을 택해야 한다 → ADR-0002.
- 요금제·약관은 변경될 수 있으므로 **실제 배포 직전(Phase 5)에 재확인**한다.

## Rollback

가역. 산출물이 정적 파일(`out/`)이므로 다른 정적 호스트로 옮기는 비용이 낮다. 이전 시 필요한 작업은 배포 파이프라인과 도메인 연결 재설정, 그리고 문의 폼 함수의 재구현뿐이다.
