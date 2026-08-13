"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

/**
 * 고정 헤더.
 *
 * 배경은 **항상 불투명한 검정**이다. 디자인 컨셉 §9 는 투명으로 시작해 스크롤 시 어두워지는
 * 방식도 허용하지만("변할 수 있다"), 히어로 배경이 밝은 광장(光場)이라 투명 상태에서는
 * 메뉴 글자가 묻힌다. 가독성이 연출보다 우선한다.
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 모바일 메뉴가 열려 있는 동안에는 뒤 페이지가 스크롤되지 않게 한다.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.2em] uppercase"
          onClick={() => setIsMenuOpen(false)}
        >
          {site.brand}
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="주 메뉴">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={site.cta.primary.href}
            className="border border-fg/40 px-5 py-3 text-xs tracking-[0.2em] uppercase transition-colors hover:bg-fg hover:text-bg"
          >
            {site.cta.primary.label}
          </Link>
        </nav>

        <button
          type="button"
          className="text-xs tracking-[0.2em] uppercase md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="모바일 메뉴"
          className="flex h-[calc(100svh-5rem)] flex-col justify-between border-t border-line bg-bg px-6 py-10 md:hidden"
        >
          <ul className="flex flex-col gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-2xl tracking-tight uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={site.cta.primary.href}
            className="border border-fg/40 px-6 py-4 text-center text-xs tracking-[0.2em] uppercase"
            onClick={() => setIsMenuOpen(false)}
          >
            {site.cta.primary.label}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
