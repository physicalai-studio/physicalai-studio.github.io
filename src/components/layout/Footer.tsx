import Link from "next/link";
import { Container } from "@/components/common/Container";
import { site } from "@/content/site";
import { telHref } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-line py-16">
      <Container wide>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase">{site.brand}</p>
            <p className="mt-3 max-w-md text-sm text-muted">{site.positioning}</p>
          </div>

          <nav aria-label="푸터 메뉴" className="flex flex-col gap-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="text-sm">
            <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
              contact
            </p>
            <a href={`mailto:${site.contactEmail}`} className="mt-3 block hover:underline">
              {site.contactEmail}
            </a>
            <a href={telHref()} className="mt-1 block hover:underline">
              {site.contactPhone}
            </a>
          </div>
        </div>

        {/*
          TODO(debt-002): 사업자 정보 표기 범위 확정 후 이 자리에 추가한다.
          미확정 상태에서 임의 문구를 넣지 않는다.
        */}
        <p className="mt-12 font-mono text-[0.6875rem] tracking-widest text-faint uppercase">
          © {site.brand}
        </p>
      </Container>
    </footer>
  );
}
