import type { NextConfig } from "next";

/**
 * 정적 export 로 빌드한다 (ADR-0002).
 * 배포 대상은 Cloudflare Pages 이며, 산출물 `out/` 을 그대로 서빙한다.
 * 서버 런타임이 없으므로 문의 폼은 Pages Functions 로 분리한다 (ADR-0004).
 */
/**
 * 하위 경로 배포 지원.
 * GitHub Pages 프로젝트 사이트는 `/<repo>` 아래에 놓이므로 접두사가 필요하다.
 * 루트 도메인(Cloudflare Pages 등)에 올릴 때는 이 값을 비운다.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  // 정적 export 에서는 next/image 의 런타임 최적화가 동작하지 않는다.
  // 이미지는 커밋 전에 사전 최적화한다 (ADR-0005 미디어 파이프라인).
  images: { unoptimized: true },

  // 정적 호스트에서 경로별 index.html 로 서빙되도록 한다.
  trailingSlash: true,
};

export default nextConfig;
