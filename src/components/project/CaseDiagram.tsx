import { Fragment } from "react";
import type { CaseDiagram as CaseDiagramData } from "@/content/schema";

/**
 * 연결 관계 다이어그램.
 *
 * 아키텍처 구성도가 계층을 그린다면 이쪽은 **계층 사이**를 그린다.
 * 시뮬레이션 결함은 대개 계층 안이 아니라 경계에서 나온다 — 단위 · 부호 · 주기 · 좌표계가
 * 바뀌는 지점. 그 지점을 화면에 드러내는 것이 이 컴포넌트의 목적이다.
 *
 * 구성도와 같은 형식 언어를 쓴다: 1px 선 · 채움 없음 · 모노 라벨 · 액센트는 되돌아오는 경로에만.
 */
export function CaseDiagram({ diagram }: { diagram: CaseDiagramData }) {
  return (
    <figure>
      <h3 className="text-sm font-semibold tracking-[0.15em] uppercase">{diagram.title}</h3>

      <div className="mt-8">
        {diagram.kind === "interfaces" ? (
          <InterfaceMap edges={diagram.edges} />
        ) : (
          <LoopPath steps={diagram.steps} returnLabel={diagram.returnLabel} />
        )}
      </div>

      <figcaption className="mt-6 max-w-2xl text-sm leading-relaxed text-faint">
        {diagram.caption}
      </figcaption>
    </figure>
  );
}

/**
 * 경계 목록.
 *
 * 표가 아니라 **선으로만 나뉜 목록**이다(타이포그래피 §4). 화면이 좁아지면 두 단이 한 단으로
 * 접히고, 열 제목 없이도 읽히도록 각 행이 스스로 설명하게 썼다.
 */
function InterfaceMap({
  edges,
}: {
  edges: Extract<CaseDiagramData, { kind: "interfaces" }>["edges"];
}) {
  return (
    <ul className="border-t border-line">
      {edges.map((edge) => (
        <li
          key={`${edge.from}→${edge.to}`}
          className="grid gap-4 border-b border-line py-7 md:grid-cols-12 md:gap-8"
        >
          <p className="font-mono text-sm leading-relaxed md:col-span-4">
            {edge.from}
            <span aria-hidden="true" className="mx-2 text-faint">
              →
            </span>
            {edge.to}
          </p>
          <div className="md:col-span-8">
            <p className="text-sm leading-relaxed">{edge.payload}</p>
            <p className="mt-2 text-xs leading-relaxed text-faint">
              {edge.rate ? (
                <span className="mr-3 font-mono tracking-[0.1em] uppercase">{edge.rate}</span>
              ) : null}
              {edge.boundary}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * 닫힌 루프.
 *
 * 걸음을 가로로 잇고, 아래쪽 'ㄷ' 자 선으로 마지막 걸음을 첫 걸음에 되돌린다.
 * 되돌아오는 경로를 그리지 않으면 이 그림은 그냥 순서도가 된다.
 */
function LoopPath({
  steps,
  returnLabel,
}: {
  steps: Extract<CaseDiagramData, { kind: "loop" }>["steps"];
  returnLabel: string;
}) {
  return (
    <div>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-0">
        {steps.map((step, index) => (
          <Fragment key={step.label}>
            {index > 0 ? (
              <div
                aria-hidden="true"
                className="flex items-center justify-center text-faint md:px-3"
              >
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </div>
            ) : null}

            <div className="flex-1 border border-line px-4 py-4">
              <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-faint">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm leading-snug font-medium">{step.label}</p>
              {step.note ? (
                <p className="mt-1.5 text-xs leading-relaxed text-faint">{step.note}</p>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>

      {/* 되돌아오는 경로 — 좌우 세로선이 양 끝 걸음에서 내려오는 'ㄷ' 자 모양이 된다. */}
      <div className="border-x border-b border-line px-4 py-4">
        <p className="text-xs leading-relaxed text-muted">
          <span aria-hidden="true" className="mr-2 font-mono text-accent">
            ↺
          </span>
          {returnLabel}
        </p>
      </div>
    </div>
  );
}
