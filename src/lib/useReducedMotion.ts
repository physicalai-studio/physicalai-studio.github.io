"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** 서버 렌더 시점에는 사용자 설정을 알 수 없다. 모션 허용을 기본값으로 두고 수화 후 교정한다. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * 사용자의 모션 축소 설정을 구독한다.
 *
 * CSS 만으로는 영상 자동재생을 막을 수 없어 자바스크립트 판정이 필요하다.
 * 브라우저 미디어 쿼리는 React 외부 상태이므로 `useSyncExternalStore` 로 구독한다.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
