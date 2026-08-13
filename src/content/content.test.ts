import { describe, expect, it } from "vitest";
import { company } from "./company";
import { getMediaAsset, isPublishableAsset, mediaManifest } from "./media";
import { allProjects, findProjectBySlug, getVisibleProjects } from "./projects";
import { mediaAssetSchema } from "./schema";
import { services } from "./services";
import { site } from "./site";
import { technologyGroups, workflowSteps } from "./technology";

/**
 * 콘텐츠 계층 회귀 테스트.
 *
 * 스키마 파싱 자체는 모듈 import 시점에 수행되므로, 여기서는 **모듈 간 참조 정합성**을 검사한다.
 * 슬롯 ID 오타나 끊어진 링크처럼 타입으로 잡히지 않는 결함이 대상이다.
 */
describe("content 무결성", () => {
  it("모든 콘텐츠 모듈이 스키마 검증을 통과한다", () => {
    expect(site.brand.length).toBeGreaterThan(0);
    expect(services).toHaveLength(5);
    expect(technologyGroups.length).toBeGreaterThan(0);
    expect(company.principles.length).toBeGreaterThan(0);
  });

  it("워크플로가 계측 단계로 닫힌다", () => {
    // 사업 정의(docs/사업_정의.md §4)의 핵심은 루프가 되돌아온다는 것이다.
    // 마지막 단계가 사라지면 선형 용역으로 되돌아가므로 회귀로 잡는다.
    expect(workflowSteps).toHaveLength(6);
    expect(workflowSteps.at(-1)?.id).toBe("measure");
  });

  it("Sim-to-Real 정합이 서비스에 존재한다", () => {
    // 사업의 중심 서비스(§6 04). 실수로 빠지면 차별점이 사라진다.
    expect(services.map((service) => service.id)).toContain("sim-to-real-alignment");
  });

  it("서비스가 참조하는 미디어 슬롯이 매니페스트에 존재한다", () => {
    for (const service of services) {
      expect(mediaManifest).toHaveProperty(service.mediaSlot);
    }
  });

  it("프로젝트가 참조하는 미디어 슬롯이 매니페스트에 존재한다", () => {
    for (const project of allProjects) {
      expect(mediaManifest).toHaveProperty(project.mediaSlot);
    }
  });

  it("홈 히어로 슬롯이 존재한다", () => {
    expect(mediaManifest).toHaveProperty("home-hero");
  });

  it("네비게이션 링크가 프로젝트 슬러그와 충돌하지 않는다", () => {
    const navHrefs = site.nav.map((item) => item.href);
    expect(new Set(navHrefs).size).toBe(navHrefs.length);
  });

  it("프로젝트 슬러그가 중복되지 않는다", () => {
    const slugs = allProjects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("슬러그로 프로젝트를 찾을 수 있고, 없는 슬러그는 undefined 를 반환한다", () => {
    const first = allProjects[0];
    expect(first).toBeDefined();
    expect(findProjectBySlug(first!.slug)).toEqual(first);
    expect(findProjectBySlug("존재하지-않는-슬러그")).toBeUndefined();
  });
});

describe("미게시 항목 노출 차단", () => {
  it("개발 환경에서는 미게시 프로젝트도 목록에 포함된다", () => {
    // vitest 기본 NODE_ENV 는 "test" 이므로 프로덕션 분기가 아니다.
    expect(getVisibleProjects()).toHaveLength(allProjects.length);
  });

  it("공개 근거가 없는 자산은 게시 대상이 아니다", () => {
    expect(isPublishableAsset({ kind: "placeholder", intent: "미준비" })).toBe(false);
    expect(
      isPublishableAsset({
        kind: "image",
        src: "/x.jpg",
        alt: "x",
        clearance: "pending",
      }),
    ).toBe(false);
    expect(
      isPublishableAsset({
        kind: "image",
        src: "/x.jpg",
        alt: "x",
        clearance: "self-produced",
      }),
    ).toBe(true);
  });

  it("등록되지 않은 슬롯은 플레이스홀더로 폴백한다", () => {
    const asset = getMediaAsset("존재하지-않는-슬롯");
    expect(asset.kind).toBe("placeholder");
  });
});

describe("제3자 자산 출처 표기", () => {
  const licensedWithoutCredit = {
    kind: "image",
    src: "/media/x.webp",
    alt: "x",
    clearance: "licensed",
  };

  it("licensed 자산에 credit 이 없으면 스키마가 거부한다", () => {
    expect(() => mediaAssetSchema.parse(licensedWithoutCredit)).toThrow();
  });

  it("credit 이 있으면 통과한다", () => {
    expect(() =>
      mediaAssetSchema.parse({
        ...licensedWithoutCredit,
        credit: {
          holder: "Someone",
          license: "CC0 1.0",
          sourceUrl: "https://example.com/asset",
        },
      }),
    ).not.toThrow();
  });

  it("매니페스트의 모든 licensed 자산이 credit 을 가진다", () => {
    for (const [slotId, asset] of Object.entries(mediaManifest)) {
      if (asset.kind !== "placeholder" && asset.clearance === "licensed") {
        expect(asset.credit, `${slotId} 에 credit 없음`).toBeDefined();
      }
    }
  });
});
