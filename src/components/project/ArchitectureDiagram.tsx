import { Fragment } from "react";
import type { Architecture } from "@/content/schema";

/**
 * 시뮬레이션 구성도.
 *
 * **왜 그림 파일이 아닌가** — 다이어그램을 이미지로 구우면 글자가 배경에 박히고
 * (디자인 컨셉 §17), 화면 폭에 따라 읽을 수 없게 되며, 내용을 고칠 때마다 자산을 다시 만든다.
 * 그래서 선과 글자로 그린다. 화면이 좁아지면 가로 흐름이 세로 흐름으로 접힌다.
 *
 * **컨셉과의 관계** — 채움 없이 1px 선만 쓰고, 계층 이름은 모노 대문자로 둔다
 * (비주얼 컨셉 §5 의 노출 예산 안에서 액센트는 초점 계층 하나에만 쓴다).
 * 다이어그램은 데이터 시각화이므로 액센트 사용이 허용되는 자리다(tokens.css).
 */
export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  const { columns, feedback, caption } = architecture;

  return (
    <figure>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-0">
        {columns.map((column, index) => (
          <Fragment key={column.label}>
            {index > 0 ? <FlowArrow /> : null}

            <div className={`flex-1 border ${column.isFocus ? "border-accent/45" : "border-line"}`}>
              <p
                className={`border-b px-4 py-3 font-mono text-(length:--text-eyebrow) tracking-[0.2em] uppercase ${
                  column.isFocus ? "border-accent/45 text-accent" : "border-line text-faint"
                }`}
              >
                {column.label}
              </p>
              <ul>
                {column.nodes.map((node) => (
                  <li key={node.label} className="border-b border-line px-4 py-4 last:border-b-0">
                    <p className="text-sm leading-snug font-medium">{node.label}</p>
                    {node.note ? (
                      <p className="mt-1.5 text-xs leading-relaxed text-faint">{node.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Fragment>
        ))}
      </div>

      {/*
        되돌아오는 경로. 사업 정의(§4)의 닫힌 루프가 그림에서 빠지면
        이 다이어그램은 그냥 파이프라인이 된다.
      */}
      <div className="mt-4 flex flex-col gap-2 border border-line px-4 py-4 sm:flex-row sm:items-baseline sm:gap-6">
        <p className="shrink-0 font-mono text-(length:--text-eyebrow) tracking-[0.2em] text-accent uppercase">
          <span aria-hidden="true">↺</span> feedback
        </p>
        <p className="text-sm leading-relaxed text-muted">{feedback}</p>
      </div>

      <figcaption className="mt-6 max-w-2xl text-sm leading-relaxed text-faint">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * 계층 사이의 흐름 표시.
 *
 * 가로 배치에서는 오른쪽, 세로 배치에서는 아래를 가리킨다.
 * 장식이므로 스크린 리더에서는 감춘다 — 순서는 DOM 이 이미 말한다.
 */
function FlowArrow() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center text-faint md:px-3">
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </div>
  );
}
