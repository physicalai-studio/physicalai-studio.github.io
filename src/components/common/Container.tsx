import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** 넓은 화면에서 가로 폭을 더 쓰는 변형. 풀블리드 섹션의 텍스트 블록에 사용한다. */
  wide?: boolean;
  className?: string;
};

/** 좌우 여백과 최대 폭을 한 곳에서 관리한다. 페이지가 직접 padding 을 정하지 않는다. */
export function Container({ children, wide = false, className = "" }: ContainerProps) {
  const maxWidth = wide ? "max-w-[1600px]" : "max-w-[1200px]";
  return <div className={`mx-auto w-full ${maxWidth} px-6 md:px-10 ${className}`}>{children}</div>;
}
