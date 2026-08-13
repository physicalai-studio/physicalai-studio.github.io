<!-- kuks_agent_setup:coding -->

## 코드 작성 SOP (coding)

코드 작성/구현/수정 트리거 감지 시 **응답 전 의무 선행 점검**(등록만 알고 건너뛰지 말 것) — 바로 구현 직행 말고 먼저 [docs/claude_guideline/coding/coding.md](docs/claude_guideline/coding/coding.md) 를 Read 한 뒤 절차를 따른다 — 입구 작업분류(trivial fast-path) → 사전조사(함수표·전역변수표 read) → 사전승인(ADR) → 구현 → 검증(테스트·보안, never-self-approve) → 후속갱신(이중 기록). 강제는 `⟦CI:<id>⟧` ↔ `checks/<id>.sh`(pre-commit·CI)만 진짜, 그 외는 `⟦권고⟧`. 명명·스타일은 `conventions.md`, 언어/포맷터는 `stack.md`, 도메인(ros2/embedded/numeric/concurrency/memory)은 트리거 시 `docs/claude_guideline/coding/domains/` 적용.

<!-- kuks_agent_setup:git_workflow -->

- git 작업(commit/push/merge/PR/branch) 트리거 감지 시 **응답 전 의무 선행 점검**(등록만 알고 건너뛰지 말 것): 먼저 docs/claude_guideline/git_workflow/git_workflow.md 를 Read 한 뒤 협업 모드 확인(README `git 협업 모드: solo|team` 선언 우선, 미선언 시 사용자 문의·README 기록 — 자동 default 금지)·커밋 규약·세션 격리 staging(이번 세션 수정 파일만)·다중 원격 push·PR 리뷰 게이트를 따른다. 임의 커밋/푸시 직행 금지.

<!-- kuks_agent_setup:debt -->

## 부채 관리 (debt)

기술·이해·의도 부채/TODO/FIXME 트리거 감지 시 **응답 전 의무 선행 점검**(등록만 알고 건너뛰지 말 것) — 먼저 [docs/claude_guideline/debt/debt.md](docs/claude_guideline/debt/debt.md) 를 Read 한 뒤 절차로 **등록·추적·상환**한다 — 식별된 부채는 `docs/debt/registry.md` 에 등록(id·유형·위치·사유·상태·상환계획), 코드의 `TODO`/`FIXME`/`HACK` 은 debt id 를 참조(`# TODO(debt-042): ...`, 맨 마커는 `⟦CI:debt-marker⟧` 차단). 식별은 작업 SOP(coding §2/§4/§5/§6)가, 등록·추적은 debt 가 소유. 미설치 시 식별만 주석/ADR 에 남김(graceful).

<!-- kuks_agent_setup:code_review -->

- "코드 리뷰"/"코드 분석" 트리거 감지 시 **응답 전 의무 선행 점검**(등록만 알고 건너뛰지 말 것): 먼저 docs/claude_guideline/code_review/review.md 를 Read 한 뒤 9단계 SOP(인벤토리[목적·함수표·전역표·의존성] + severity 평가 + 산출물 docs/code_review/<주제>/YYYY-MM-DD.md(루트 정본+패키지 병기 이중기록) + 플로우차트 .drawio 기록)를 따른다. 일반 탐색+요약으로 대체 금지. (도메인: docs/claude_guideline/code_review/domains/)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
