# 실행 명령 (cmd)

작업 위치: `/home/tr-omen-22/Documents/git/homepage`

```bash
cd /home/tr-omen-22/Documents/git/homepage
```

---

## 0. 최초 1회

```bash
npm install
```

---

## 1. 화면 보기

### 방법 A — 정적 빌드 후 서빙 (이 PC 에서 현재 확인된 방법)

```bash
npm run build
npx serve out -l 4321
```

→ 브라우저에서 http://localhost:4321

실제 배포와 동일한 산출물을 본다. 코드를 고치면 `npm run build` 를 다시 실행해야 반영된다.

### 방법 B — 개발 서버 (핫 리로드)

```bash
npm run dev
```

→ http://localhost:3000

> ⚠ **이 PC 에서는 현재 실패한다.** inotify(파일 변경 감시) 한도가 차서 Turbopack 이 크래시한다.
> 아래 §4 를 적용하면 정상 동작한다.

---

## 2. 검증

```bash
npm run verify      # 포맷 + 린트 + 타입 + 테스트 + 빌드 전체
```

개별 실행:

```bash
npm run format      # Prettier 적용 (코드 수정)
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

하네스 검사(SOP):

```bash
bash docs/claude_guideline/coding/checks/adr-fields.sh .
bash docs/claude_guideline/debt/checks/debt-marker.sh src
bash docs/claude_guideline/coding/checks/banned-pattern.sh src
bash docs/claude_guideline/coding/checks/dup-signature.sh src
```

> 하네스 검사는 **빌드 전에** 돌린다. `out/`·`.next/` 산출물이 있으면 오탐이 난다.

---

## 3. 내용 수정

모든 문구·데이터는 `src/content/` 에만 있다. 컴포넌트를 고칠 필요가 없다.

| 고칠 것                  | 파일                        |
| ------------------------ | --------------------------- |
| 브랜드명 · 메뉴 · 연락처 | `src/content/site.ts`       |
| 서비스 5종               | `src/content/services.ts`   |
| 프로젝트 케이스 스터디   | `src/content/projects.ts`   |
| 기술 스택 · 워크플로     | `src/content/technology.ts` |
| 철학 · 창업자            | `src/content/company.ts`    |
| 영상 · 이미지            | `src/content/media.ts`      |
| 색 · 타이포 · 간격       | `src/styles/tokens.css`     |

수정 후 `npm run verify` 로 확인한다. 스키마 위반이면 빌드가 실패한다.

---

## 4. 개발 서버가 안 될 때 — inotify 한도 올리기

증상: `npm run dev` 실행 시 `OS file watch limit reached` / `TurbopackInternalError`.

현재 값 확인:

```bash
cat /proc/sys/fs/inotify/max_user_watches      # 65536
cat /proc/sys/fs/inotify/max_user_instances    # 128  ← 이게 부족하다
```

영구 적용(재부팅 후에도 유지):

```bash
sudo tee /etc/sysctl.d/99-inotify.conf > /dev/null <<'EOF'
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 1024
EOF
sudo sysctl --system
```

적용 확인 후 다시 `npm run dev`.

> 이 PC 는 VSCode · 시뮬레이터 등 감시 프로세스가 많아 인스턴스 128개를 이미 100개 가까이 쓰고 있다.
> 위 설정은 시스템 전역 변경이라 다른 개발 도구에도 함께 도움이 된다.

---

## 5. 배포 (아직 미연결)

Cloudflare Pages 설정 예정 값:

| 항목          | 값              |
| ------------- | --------------- |
| 빌드 명령     | `npm run build` |
| 출력 디렉토리 | `out`           |
| Node 버전     | 22              |

도메인 확정 후 Phase 5 에서 연결한다.
