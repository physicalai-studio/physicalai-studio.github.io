"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** 같은 섹션 안에서 순차 등장시킬 때의 지연(ms). 과하게 쓰지 않는다. */
  delayMs?: number;
  className?: string;
};

const REVEAL_OFFSET_PX = 24;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * 스크롤 진입 시 한 번만 나타나는 페이드 인.
 *
 * 디자인 컨셉 §8 이 허용한 범위(Fade In / Text Reveal)만 구현한다.
 *
 * 설계 원칙 — **콘텐츠는 기본이 보이는 상태다.**
 * 서버 렌더 결과에 `opacity: 0` 을 넣지 않는다. 자바스크립트가 죽거나 늦게 로드되면
 * 본문이 영구히 보이지 않기 때문이다. 숨김은 마운트 이후 클라이언트에서만 적용하고,
 * 그마저도 **화면 밖에 있는 요소에만** 건다(이미 보이는 요소는 깜빡임 없이 그대로 둔다).
 */
export function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    // 이미 뷰포트에 걸쳐 있으면 숨기지 않는다 — 첫 화면이 깜빡이는 것을 막는다.
    const isBelowFold = element.getBoundingClientRect().top > window.innerHeight;
    if (!isBelowFold) return;

    const transition =
      `opacity var(--duration-reveal) var(--ease-out-quiet) ${delayMs}ms, ` +
      `transform var(--duration-reveal) var(--ease-out-quiet) ${delayMs}ms`;

    element.style.transition = transition;
    element.style.opacity = "0";
    element.style.transform = `translateY(${REVEAL_OFFSET_PX}px)`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.style.opacity = "1";
          element.style.transform = "none";
          observer.disconnect();
        }
      },
      {
        // 뷰포트보다 긴 블록도 반드시 발화하도록 비율 조건을 두지 않는다.
        // 비율(threshold)을 쓰면 화면보다 몇 배 긴 요소는 그 비율에 영원히 도달하지 못한다.
        threshold: 0,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
