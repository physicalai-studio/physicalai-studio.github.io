import type { MetadataRoute } from "next";
import { getVisibleProjects } from "@/content/projects";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/basePath";

/** 정적 export 대상임을 명시한다 (`output: "export"` 요구사항). */
export const dynamic = "force-static";

/** 정적 라우트 목록. 새 페이지를 추가하면 이 배열에도 추가한다. */
const STATIC_PATHS = ["/", "/services", "/projects", "/technology", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPaths = getVisibleProjects().map((project) => `/projects/${project.slug}`);

  return [...STATIC_PATHS, ...projectPaths].map((path) => ({
    url: absoluteUrl(site.baseUrl, path),
  }));
}
