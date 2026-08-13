# 이슈 · 수정 로그 (Issues and Fixes)

> 최신 항목이 위로 온다(prepend). 형식: `### [Fix] 제목` + 문제·원인·해결·파일·상태 5필드.
> 파일명·경로 정규형: `docs/issues_and_fixes/issues_and_fixes.md` (변종 금지).

---

## 2026-08-13

### [Fix] 히어로 배경 이미지가 보이지 않고 카피가 오른쪽으로 밀림 (Tailwind 위치 클래스 충돌)

- **문제**: 홈 최상단이 검은 배경만 보이고, 히어로 카피가 화면 오른쪽 절반으로 밀려 렌더됨.
- **원인**: `MediaSlot` 은 출처 표기를 우하단에 고정하려고 내부에서 `relative` 를 쓴다(`src/components/media/MediaSlot.tsx:27` frameClass). 히어로가 여기에 `absolute` 를 `className` 으로 넘겼는데, **Tailwind 는 클래스 나열 순서가 아니라 스타일시트 정의 순서로 승자가 정해지고 `.relative` 가 `.absolute` 보다 뒤에 온다.** 그래서 `absolute` 가 무시되어 배경이 문서 흐름에 남았고, flex 아이템으로 가로 절반을 차지하며 카피를 밀어냈다. 동시에 `-z-10` 때문에 시각적으로는 보이지 않아 "검은 여백"으로 보였다.
- **해결**: 배경을 절대배치 래퍼(`<div class="absolute inset-0">`)로 감싸고 `MediaSlot` 에는 `h-full w-full` 만 넘긴다. 음수 z-index 제거, 카피 컨테이너에 `relative` 부여. Contact 섹션도 같은 구조로 통일(2곳).
- **파일**: `src/app/page.tsx`, `src/components/media/MediaSlot.tsx`(prop 주석에 금지 사항 명시)
- **상태**: 완료 — 생성 HTML 로 구조 확인, `npm run verify` 통과.

#### 재발 방지

`MediaSlot` 의 `className` prop 주석에 **"위치 지정 클래스(`absolute`·`fixed`)를 넘기지 말 것, 배경으로 깔려면 절대배치 래퍼로 감쌀 것"** 을 명시했다. 같은 함정이 다른 페이지에서 반복될 수 있는 구조였다.

---

### [Fix] 스크롤 리빌이 긴 섹션을 영구히 숨김 (IntersectionObserver 임계값)

- **문제**: `/services` 페이지에서 첫 제목만 보이고 그 아래 본문이 전부 보이지 않음. 서버가 내려주는 HTML 에는 내용이 있으나 `opacity:0` 상태로 고정.
- **원인**: `Reveal` 이 두 가지 결함을 가졌다.
  1. 서버 렌더 결과에 `opacity: 0` 을 인라인으로 박아, 자바스크립트가 늦거나 실패하면 본문이 영구히 보이지 않음.
  2. `IntersectionObserver` 임계값을 `0.15`(요소의 15% 가 보일 때)로 설정 — **뷰포트보다 약 6.7배 이상 긴 요소는 그 비율에 영원히 도달하지 못해 발화하지 않는다.** 서비스 5종 블록과 홈의 질문 목록이 이 조건에 걸렸다.
- **해결**: 원칙을 "콘텐츠는 기본이 보이는 상태"로 변경. 서버 렌더에 숨김 스타일을 넣지 않고, 마운트 이후 **화면 밖에 있는 요소에만** 클라이언트에서 숨김을 적용한다(첫 화면 깜빡임 방지). 임계값은 `0`(비율 조건 제거) + `rootMargin` 으로 대체. 모션 축소 설정이면 아무것도 하지 않는다.
- **파일**: `src/components/common/Reveal.tsx` (전면 재작성, 약 40줄)
- **상태**: 완료 — 빌드 산출물의 `opacity:0` 개수 6 → **0** 확인.

---

### [Fix] `npm run dev` 가 Turbopack 패닉으로 즉시 종료됨 (inotify 인스턴스 한도)

- **문제**: `npm run dev` 실행 시 개발 서버가 `Ready in 170ms` 까지 도달한 직후 크래시. 모든 라우트가 응답하지 않음(curl 결과 `000`). 2회 재시도 모두 동일.

  ```
  FATAL: An unexpected Turbopack error occurred.
  Error [TurbopackInternalError]: Unable to watch /home/tr-omen-22/Documents/git/homepage/src/app/contact
  Caused by: OS file watch limit reached.
  ```

- **원인**: 코드 결함이 아니라 **호스트 OS 의 inotify 리소스 고갈**. Turbopack 은 파일 변경 감시를 위해 inotify 인스턴스를 요구하는데, 이 PC 는 한도가 기본값이고 이미 대부분을 다른 프로세스(VSCode · 시뮬레이터 등)가 점유하고 있었다.

  | 항목                                      | 값         |
  | ----------------------------------------- | ---------- |
  | `/proc/sys/fs/inotify/max_user_instances` | **128**    |
  | 측정 시점 사용 중 인스턴스                | **약 100** |
  | `/proc/sys/fs/inotify/max_user_watches`   | 65536      |

  증거: 패닉 메시지의 `OS file watch limit reached` + 위 `/proc` 값. 소스 코드에는 해당 문자열이 없고, 같은 코드로 `npm run build`(감시 불필요)는 정상 통과했다 → 코드가 아니라 감시 리소스 문제로 확정.

- **해결**: 저장소 코드 변경 **0줄**. 호스트 sysctl 한도를 상향한다(시스템 전역 변경, sudo 필요).

  ```bash
  sudo tee /etc/sysctl.d/99-inotify.conf > /dev/null <<'EOF'
  fs.inotify.max_user_watches = 524288
  fs.inotify.max_user_instances = 1024
  EOF
  sudo sysctl --system
  ```

  적용 전 임시 우회: `npm run build && npx serve out -l 4321` — 감시 없이 정적 산출물을 서빙하므로 영향받지 않는다.

- **파일**: `cmd.md` (§1 방법 A/B, §4 해결 절차 신규 작성). 소스 코드 미변경.
- **상태**: 완료 — 사용자 환경에서 상향 적용 후 `npm run dev` 정상 동작 확인(2026-08-13).

#### 재발 방지

- `cmd.md` §4 에 증상 → 원인 → 해결 절차를 상시 문서화했다.
- 이 한도는 **머신 단위 설정**이라 저장소를 옮기면 다시 발생한다. 새 개발 PC 에서 `npm run dev` 가 죽으면 먼저 `/proc/sys/fs/inotify/max_user_instances` 를 확인한다.

---

### [Fix] 케이스 스터디 본문의 강조 마크업이 화면에 별표로 노출됨

- **문제**: 배포된 `/projects/<slug>/` 페이지 본문에 `**위치 제어에 대한 결론은 …**` 처럼 별표 두 개가 그대로 보였다. 강조로 읽혀야 할 문장이 오히려 잡음이 됐다.
- **원인**: 콘텐츠 계층(`src/content/projects.ts`)의 본문은 **문자열**이고(ADR-0003), 페이지는 그 문자열을 그대로 `{entry.body}` 로 출력한다. 마크다운을 해석하는 단계가 애초에 없었는데, 문서를 쓰듯 `**강조**` 를 적어 넣었다. 빌드·테스트는 문자열의 내용을 보지 않으므로 전부 통과했다 — **타입도 스키마도 잡을 수 없는 종류의 결함**이었다.
- **해결**:
  1. `src/lib/richText.ts` — `**강조**` 하나만 해석하는 최소 파서. 마크다운 라이브러리를 넣지 않았다(콘텐츠에 링크·원시 HTML 이 섞이면 "문구는 콘텐츠 계층, 구조는 컴포넌트" 경계가 무너진다).
  2. `src/components/common/RichText.tsx` — 조각을 `<strong>` 으로 렌더. 감싸는 태그는 호출부가 정한다.
  3. `hasUnparsedMarkup()` + 콘텐츠 회귀 테스트 — 짝이 맞지 않는 `**` 나 평문 렌더 자리(다이어그램·계측값)에 들어간 마크업을 빌드 전에 잡는다.
- **파일**: `src/lib/richText.ts`(신규), `src/lib/richText.test.ts`(신규), `src/components/common/RichText.tsx`(신규), `src/app/projects/[slug]/page.tsx`, `src/content/content.test.ts`
- **상태**: 완료 — 빌드 산출물의 `**` 개수 1 → **0**, `<strong>` 렌더 확인.

#### 재발 방지

- **평문으로 렌더되는 자리에는 마크업을 금지**하고 테스트로 강제했다. 다이어그램 노드 라벨·`caption`·`feedback`·계측값이 여기 해당한다. 렌더러가 있는 자리(5단 본문·설계 판단)와 없는 자리를 사람이 기억하는 대신 테스트가 지킨다.
- 문서에 쓰던 습관이 콘텐츠 문자열에 그대로 들어온 사고다. **콘텐츠 계층은 마크다운이 아니다** — 지원하는 표기는 굵게 하나뿐이며, 그 사실을 `타이포그라피.md` §8 에 적었다.
