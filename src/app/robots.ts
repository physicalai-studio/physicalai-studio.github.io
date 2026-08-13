import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/basePath";

/** 정적 export 대상임을 명시한다 (`output: "export"` 요구사항). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl(site.baseUrl, "/sitemap.xml"),
  };
}
