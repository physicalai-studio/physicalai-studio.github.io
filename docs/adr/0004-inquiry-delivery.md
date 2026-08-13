# ADR-0004 — 문의 수신 경로

## Status

Proposed (2026-08-13) — Phase 4 착수 전 확정 필요

## Context

Contact 페이지의 문의 폼은 개인정보(이름·회사·이메일·문의 내용)를 수집해 전달해야 한다. 정적 export(ADR-0002)라 Next.js 서버 런타임이 없다.

후보:

1. Cloudflare Pages Functions + 외부 이메일 발송 API
2. 외부 폼 서비스(Formspree 등)
3. `mailto:` 링크만 제공

## Decision

(미확정) 현재는 **Contact 페이지에 이메일 주소만 노출**하고, 폼은 Phase 4 에서 구현한다.

구현 시 전제:

- 전송 로직은 `submitInquiry(payload)` 인터페이스 뒤로 분리해, 수단 교체가 UI 에 영향을 주지 않게 한다.
- 스팸 대응(honeypot + rate limit)을 포함한다.
- **개인정보 수집·이용 동의 체크와 개인정보처리방침 페이지 없이는 폼을 공개하지 않는다.**
- 발송 수단은 확정 시점에 직접 확인한다 — 과거 Cloudflare Workers 용 무료 MailChannels 연동은 종료되었다.

## Consequences

- Phase 4 이전까지 문의 경로는 이메일뿐이다.
- 어댑터 인터페이스를 먼저 정의하므로, 수단이 바뀌어도 폼 UI 는 재작성하지 않는다.

## Rollback

가역. 어댑터 교체로 수단을 바꿀 수 있다. 단 개인정보를 외부 서비스로 보내기 시작한 뒤에는 처리방침 고지와 위탁 기재를 함께 갱신해야 한다.
