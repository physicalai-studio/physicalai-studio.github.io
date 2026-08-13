import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMetadataInput = {
  title: string;
  description?: string;
  path: string;
};

/**
 * 페이지 메타데이터를 만든다.
 *
 * 제목 · 설명 · canonical 규칙을 한 곳에 모아 페이지마다 어긋나는 것을 막는다.
 * 실제 도메인은 `site.baseUrl` 이며 브랜드 확정 시 그 값만 교체한다 (프로젝트_메타.md D1).
 */
export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const resolvedDescription = description ?? site.description;

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${site.brand}`,
      description: resolvedDescription,
      url: path,
      siteName: site.brand,
      type: "website",
    },
  };
}
