# homepage

Physical AI Engineering Studio 홈페이지.

로봇 시뮬레이션 · 디지털 트윈 · Virtual Commissioning · Physical AI 를 다루는 엔지니어링 스튜디오의 공식 웹사이트다.

## 저장소 정보

- 원격: https://github.com/physicalai-studio/physicalai-studio.github.io (public)
- 배포: https://physicalai-studio.github.io/
- 기본 브랜치: `main`
- git 협업 모드: solo

## 실행

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 정적 빌드 → out/
npm run verify     # 포맷 · 린트 · 타입 · 테스트 · 빌드 전체 검증
```

| 스크립트            | 하는 일                |
| ------------------- | ---------------------- |
| `npm run dev`       | 개발 서버              |
| `npm run build`     | 정적 export (`out/`)   |
| `npm run lint`      | ESLint                 |
| `npm run typecheck` | `tsc --noEmit`         |
| `npm test`          | Vitest (콘텐츠 정합성) |
| `npm run format`    | Prettier 적용          |
| `npm run verify`    | 위 전부 순차 실행      |

## 스택

Next.js 16 (App Router, 정적 export) · React 19 · TypeScript · Tailwind CSS 4 · zod

## 구조

```text
src/
├─ app/          # 라우트 (/, /services, /projects, /technology, /about, /contact)
├─ components/   # layout · section · media · common
├─ content/      # 모든 문구·데이터 + zod 스키마 (컴포넌트에 문자열 하드코딩 금지)
├─ lib/          # 메타데이터 생성, 브라우저 설정 훅
└─ styles/       # 디자인 토큰 · 전역 스타일
```

**콘텐츠 수정은 `src/content/` 에서만 한다.** 문구·서비스·프로젝트·기술 스택·미디어 자산이 전부 여기 있으며, 스키마 위반은 빌드를 실패시킨다.

## 문서

| 문서                                                         | 내용                                 |
| ------------------------------------------------------------ | ------------------------------------ |
| [개발 전략](docs/개발_전략.md)                               | 로드맵 · 아키텍처 · 위험             |
| [프로젝트 메타](docs/프로젝트_메타.md)                       | 결정 로그 · 환경 · 미결 사항         |
| [미디어 자산 명세서](docs/미디어_자산_명세서.md)             | 캡처 · 인코딩 규격, 슬롯별 요구 자산 |
| [홈페이지 가이드](docs/홈페이지_가이드_초안.md)              | 제품 사양(원본)                      |
| [디자인 컨셉](docs/디자인_컨셉.md)                           | 디자인 방향(원본)                    |
| [비주얼 컨셉 — 파동과 간섭](docs/비주얼_컨셉_파동과_간섭.md) | 형태 언어 · 개념 대응표 · 적용 계획  |
| [ADR](docs/adr/)                                             | 설계 결정 기록                       |
| [부채 registry](docs/debt/registry.md)                       | 미해결 부채                          |
| [코드 인벤토리](docs/code_inventory/2026-08-13.md)           | 함수표 · 전역표 · 의존성             |

## 현재 상태

Phase 1(기반 구축) 완료. 6개 라우트가 동작하고 정적 빌드가 통과한다.

**미확정**: 브랜드명 · 도메인이 정해지지 않아 `src/content/site.ts` 는 임시값(`example.invalid`)을 쓴다. 배포 전 반드시 교체해야 한다(debt-005).

**미디어**: 실제 시뮬레이션 영상·스크린샷이 아직 없다. 모든 미디어 슬롯이 플레이스홀더 상태이며, [명세서](docs/미디어_자산_명세서.md)대로 캡처해 `src/content/media.ts` 를 교체하면 반영된다.

## 배포

Cloudflare Pages (정적 export). 빌드 명령 `npm run build`, 출력 디렉토리 `out`.
아직 연결하지 않았다. 선택지와 절차는 [docs/배포.md](docs/배포.md) 참고.

> ⚠ GitHub Pages 로 가려면 저장소를 public 으로 바꿔야 하는데, 커밋 이력에
> 재직 회사·고객사명이 담긴 문서가 있다. 공개 전환 전 [docs/배포.md](docs/배포.md) §2 를 반드시 확인할 것.
