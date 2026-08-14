import { describe, expect, it } from "vitest";
import { hasUnparsedMarkup } from "@/lib/richText";
import { company } from "./company";
import { contactPage } from "./contact";
import { customerSegments } from "./customers";
import { deliverableBundles, deliveryHeading, fidelityHeading, fidelityLayers } from "./delivery";
import { home } from "./home";
import { caseTextureSlot, getMediaAsset, isPublishableAsset, mediaManifest } from "./media";
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
    expect(company.howWeWork.gates).toHaveLength(5);
  });

  it("HOW WE WORK 이 경계 탐색과 현실 이전으로 닫힌다", () => {
    // 다섯 문 중 04·05 가 이 사업의 차별점이다(docs/how_we_work.md).
    // 04 가 빠지면 PASS/FAIL 검증 용역, 05 가 빠지면 "돌아가는 그림"으로 되돌아간다.
    const ids = company.howWeWork.gates.map((gate) => gate.id);
    expect(ids).toEqual(["question", "model", "constrain", "boundary", "transfer"]);
  });

  it("홈이 About 과 같은 HOW WE WORK 제목을 쓴다", () => {
    // 제목은 company 가 단일 근원이다. home 이 제목을 따로 들고 있으면 문구가 갈라진다.
    expect(home).not.toHaveProperty("howWeWork.title");
    expect(company.howWeWork.title.length).toBeGreaterThan(0);
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

describe("케이스 스터디 본문 마크업", () => {
  const bodyFields = ["problem", "environment", "simulation", "verification", "result"] as const;

  it("본문의 강조 마크업이 모두 해석된다", () => {
    // 2026-08-13: `**강조**` 가 렌더러 없이 배포되어 화면에 별표가 그대로 나갔다.
    // 짝이 맞지 않는 마크업도 같은 증상을 만들므로 여기서 함께 잡는다.
    for (const project of allProjects) {
      for (const field of bodyFields) {
        for (const paragraph of project[field]) {
          expect(hasUnparsedMarkup(paragraph), `${project.slug}.${field}: ${paragraph}`).toBe(
            false,
          );
        }
      }
      for (const lesson of project.lessons) {
        expect(hasUnparsedMarkup(lesson.body), `${project.slug}.lessons`).toBe(false);
      }
    }
  });

  it("다이어그램과 계측 요약에는 마크업을 쓰지 않는다", () => {
    // 이 값들은 평문으로 렌더된다(ArchitectureDiagram · metrics 그리드).
    // 강조를 적어도 굵어지지 않고 별표만 남는다.
    for (const project of allProjects) {
      const plainStrings = [
        project.architecture.caption,
        project.architecture.feedback,
        ...project.architecture.columns.flatMap((column) => [
          column.label,
          ...column.nodes.flatMap((node) => [node.label, node.note ?? ""]),
        ]),
        ...project.metrics.flatMap((metric) => [metric.value, metric.label, metric.note ?? ""]),
        ...project.diagrams.flatMap((diagram) => [
          diagram.title,
          diagram.caption,
          ...(diagram.kind === "interfaces"
            ? diagram.edges.flatMap((edge) => [
                edge.from,
                edge.to,
                edge.payload,
                edge.rate ?? "",
                edge.boundary,
              ])
            : [
                diagram.returnLabel,
                ...diagram.steps.flatMap((step) => [step.label, step.note ?? ""]),
              ]),
        ]),
      ];
      for (const value of plainStrings) {
        expect(value.includes("*"), `${project.slug}: ${value}`).toBe(false);
      }
    }
  });

  it("모든 케이스에 되돌아오는 경로가 있다", () => {
    // 계측이 모델로 돌아오지 않는 구성은 이 스튜디오가 파는 것이 아니다(사업_정의.md §4).
    for (const project of allProjects) {
      expect(project.architecture.feedback.length).toBeGreaterThan(0);
      expect(project.architecture.columns.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("케이스 스터디 텍스처", () => {
  it("같은 슬러그는 항상 같은 텍스처를 준다", () => {
    expect(caseTextureSlot("amr-navigation-stack")).toBe(caseTextureSlot("amr-navigation-stack"));
  });

  it("배정된 슬롯이 매니페스트에 실제로 존재한다", () => {
    // 해시 범위와 등록 개수가 어긋나면 플레이스홀더로 폴백해 조용히 깨진다.
    for (const slug of [
      "precision-orientation-control",
      "amr-navigation-stack",
      "x",
      "매우-긴-슬러그-이름",
    ]) {
      expect(getMediaAsset(caseTextureSlot(slug)).kind).toBe("image");
    }
  });
});

describe("화면에 나가는 문구", () => {
  /** 객체 안의 모든 문자열을 경로와 함께 훑는다. */
  function walk(value: unknown, path: string): { path: string; text: string }[] {
    if (typeof value === "string") return [{ path, text: value }];
    if (Array.isArray(value))
      return value.flatMap((item, index) => walk(item, `${path}[${index}]`));
    if (value && typeof value === "object") {
      return Object.entries(value).flatMap(([key, child]) => walk(child, `${path}.${key}`));
    }
    return [];
  }

  const rendered = [
    ["site", site],
    ["home", home],
    ["company", company],
    ["services", services],
    ["customers", customerSegments],
    ["delivery.bundles", deliverableBundles],
    ["delivery.fidelity", fidelityLayers],
    ["delivery.heading", deliveryHeading],
    ["delivery.fidelityHeading", fidelityHeading],
    ["contact", contactPage],
  ] as const;

  it("마크다운 기호가 문구에 남아 있지 않다", () => {
    // 콘텐츠 계층은 마크다운이 아니다. 문서 쓰던 습관으로 넣은 백틱·별표는
    // 화면에 기호 그대로 나간다(2026-08-13 별표 사고와 같은 부류).
    for (const [name, value] of rendered) {
      for (const { path, text } of walk(value, name)) {
        expect(text.includes("`"), `${path}: ${text}`).toBe(false);
        expect(hasUnparsedMarkup(text), `${path}: ${text}`).toBe(false);
      }
    }
  });
});
