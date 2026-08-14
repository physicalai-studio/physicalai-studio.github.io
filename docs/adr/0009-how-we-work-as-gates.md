# ADR-0009 — HOW WE WORK 을 프로세스가 아니라 다섯 개의 문으로 정의

## Status

Accepted (2026-08-14)

## Context

`company.principles` 는 7개 항목으로 About 의 "How We Work" 와 홈 06 Why 두 곳을 동시에 채우고 있었다.
그런데 그 목록은 성격이 섞여 있었다 — 역할 경계(`ROBOTS ARE YOURS.`), 파이프라인 단계
(`SIMULATION FIRST` · `ENGINEERING VALIDATION` · `ACCELERATED DEVELOPMENT` · `DEPLOY AND MEASURE`),
범위(`END-TO-END`), 조직 단위(`ONE ENGINEER. MANY AGENTS.`) 가 한 목록에 있었다.

[how_we_work.md](../how_we_work.md) 는 이 사업의 HOW WE WORK 이 업무 프로세스가 아니라
**현실에 접근하는 방법론**이어야 한다고 정리한다. 근거는 이 사업의 일이 본질적으로
"아직 존재하지 않는 시스템이 현실에서 성립하는지를 증명하는 과정"이라는 것이다.
`요구사항 분석 → 설계 → 개발 → 납품` 으로 쓰면 어느 용역사와도 구분되지 않는다.

또 하나의 문제는 홈 03 `Simulation Workflow`(PROBLEM → MODEL → SIMULATE → VALIDATE →
DEPLOY → MEASURE)와의 중복이었다. 문서는 이 둘의 관계를 명시한다 — 같은 일을 다른 세계관으로
기술한 것이며, **홈페이지에는 사고 구조를, 제안서·계약서에는 운영 프로세스를** 쓴다.

## Decision

**HOW WE WORK 을 다섯 개의 문(gate)으로 재정의한다.** 작업 순서가 아니라 아이디어가 현실이
되기 위해 통과해야 하는 관문이다.

> **FROM ASSUMPTION TO EVIDENCE.** — 가정을 근거로 바꾼다.

| 문  | 라벨                    | 뜻                            |
| --- | ----------------------- | ----------------------------- |
| 01  | QUESTION THE ASSUMPTION | 가정을 의심한다               |
| 02  | MODEL THE REALITY       | 현실을 모델로 만든다          |
| 03  | LET PHYSICS CONSTRAIN   | 물리가 가능성을 제한하게 한다 |
| 04  | FIND THE BOUNDARY       | 가능성의 경계를 찾는다        |
| 05  | TRANSFER THE PROOF      | 증명을 현실로 넘긴다          |

부수 결정:

- **`company.principles` 를 폐기하고 `company.howWeWork` 로 대체**한다. 기존 7개 항목 중 파이프라인
  성격의 4개는 다섯 문에 흡수되고, `ROBOTS ARE YOURS.` · `END-TO-END` · `ONE ENGINEER. MANY AGENTS.`
  는 **사이트에서 내려간다**(사용자 결정, 2026-08-14). 역할 경계는 히어로 문구
  ("We Build the Simulation. You Build the Robot.")와 `philosophyBody` 가 계속 진다.
- **홈 03 을 `Simulation Workflow` 에서 `How We Work` 로 교체**한다. 6단 운영 루프는
  `/technology` 에만 남는다 — `workflowSteps` 자체는 그대로 유지하므로 ADR-0008 의 닫힌 루프 정의는 살아 있다.
- **홈 06 Why 에서 목록을 걷어낸다.** 03 이 이미 다섯 문을 펼치므로 같은 값을 한 페이지에서
  두 번 읽히게 두지 않는다(디자인 컨셉 §16).
- 제목 문자열의 단일 근원은 `company.howWeWork.title` 이다. `home.howWeWork` 는 eyebrow 와
  본문만 갖는다 — 홈과 About 의 문구가 갈라지는 것을 스키마 단계에서 막는다.
- `gates` 는 **정확히 5개**로 스키마가 강제한다. 04(경계)와 05(현실 이전)가 이 사업의 차별점이고,
  04 가 빠지면 PASS/FAIL 검증 용역, 05 가 빠지면 "돌아가는 그림"으로 되돌아가기 때문이다.

## Consequences

- HOW WE WORK 이 **팔 것을 말한다** — YES/NO 가 아니라 경계, "될 것 같습니다"가 아니라 근거.
  ADR-0008 이 정한 차별점 3종(신뢰 등급 · 숫자로 준 차이 · 한계 선언)과 같은 곳을 가리킨다.
- 홈에서 조직 서사(`ONE ENGINEER. MANY AGENTS.`)와 역할 경계 원칙이 사라진다. **이것이 이 결정의
  비용이다.** 히어로와 About 철학문이 그 역할을 대신 지므로 완전한 소실은 아니지만, "인시를 팔지
  않는다"는 메시지의 노출은 줄어든다. 되살릴 자리가 필요하면 About 에 별도 절을 두는 것이 다음 후보다.
- 홈 03 과 `/technology` 가 다른 틀을 보여주게 된다. 의도된 분리이며(사고 구조 vs 운영 루프),
  두 문서가 같은 파이프라인을 말한다는 점은 각 파일 주석에 명시했다.
- `gates` 개수 고정은 문구를 늘리려 할 때 빌드를 막는다. 의도된 마찰이다.

## Rollback

가역. 변경은 `src/content/`(company · home · schema)와 렌더 3곳(`app/page.tsx` ·
`app/about/page.tsx` · `components/section/GateList.tsx`)에 한정된다. 되돌리려면 이 ADR 을
`Superseded` 로 표시하고 `companySchema.howWeWork` 를 `principles` 배열로 복원한다 —
기존 7개 문구는 이 저장소 이력에 남아 있다. 스키마가 강제하므로 부분 복원 상태로는 빌드되지 않는다.
