import { z } from "zod";

/**
 * 콘텐츠 스키마 (Content Schema)
 *
 * 사이트의 모든 문구·데이터는 `src/content/` 모듈에만 존재하고, 이 스키마로 빌드 타임에 검증된다
 * (ADR-0003 단일 로케일 정책의 전제 — 컴포넌트 내부 문자열 하드코딩 금지).
 * 스키마 위반은 빌드를 실패시킨다.
 */

const nonEmpty = z.string().min(1);

/** URL 경로 조각으로 쓰이는 식별자. 소문자·숫자·하이픈만 허용한다. */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 은 소문자·숫자·하이픈만 사용한다");

/**
 * 미디어 자산의 공개 근거.
 * 실제 프로젝트 캡처는 고객사 자산일 수 있으므로, 근거 없는 자산의 게시를 구조적으로 막는다.
 */
export const clearanceSchema = z.enum([
  "self-produced", // 자체 제작
  "client-approved", // 고객사 공개 승인
  "anonymized", // 익명화 완료
  "licensed", // 제3자 자산 — 라이선스 확인됨. `credit` 필수
  "pending", // 미확인 — 게시 불가
]);

/**
 * 제3자 자산의 출처 표기.
 * `clearance: "licensed"` 인 자산은 이 값을 반드시 가지며, 화면에도 출처가 표시된다.
 */
export const creditSchema = z.object({
  holder: nonEmpty,
  license: nonEmpty,
  sourceUrl: z.url(),
  /**
   * 원본을 편집했는지 여부. CC BY / CC BY-SA 는 **변경 사실 표시**를 요구하므로,
   * 크롭·리사이즈·톤 조정을 했다면 반드시 `true` 로 둔다.
   */
  isModified: z.boolean().optional(),
});

/**
 * 미디어 슬롯 하나의 정의.
 * `kind: "placeholder"` 는 자산 미준비 상태를 뜻하며, 이 상태로도 전 페이지가 렌더된다.
 */
export const mediaAssetSchema = z
  .discriminatedUnion("kind", [
    z.object({
      kind: z.literal("placeholder"),
      /** 이 슬롯에 최종적으로 들어갈 자산 설명 — 캡처 명세서와 대응된다. */
      intent: nonEmpty,
    }),
    z.object({
      kind: z.literal("image"),
      src: nonEmpty,
      alt: nonEmpty,
      clearance: clearanceSchema,
      credit: creditSchema.optional(),
    }),
    z.object({
      kind: z.literal("video"),
      /** 재생 소스. 브라우저 폴백을 위해 순서대로 시도한다. */
      sources: z.array(z.object({ src: nonEmpty, type: nonEmpty })).min(1),
      /** 포스터는 필수 — 영상 로드 전/모바일/모션 축소 설정에서 이 이미지가 대신 표시된다. */
      poster: nonEmpty,
      alt: nonEmpty,
      clearance: clearanceSchema,
      credit: creditSchema.optional(),
    }),
  ])
  // 제3자 자산을 출처 없이 올리는 것을 스키마 단계에서 막는다.
  .refine(
    (asset) => asset.kind === "placeholder" || asset.clearance !== "licensed" || asset.credit,
    {
      message: "clearance 가 'licensed' 인 자산은 credit(출처)이 필수다",
    },
  );

export const mediaManifestSchema = z.record(z.string(), mediaAssetSchema);

/** 서비스 1건. `outcome` 은 "고객이 얻는 결과" — 기술 나열이 아니다 (가이드 §19 Session 03). */
export const serviceSchema = z.object({
  id: slugSchema,
  index: nonEmpty,
  title: nonEmpty,
  titleKo: nonEmpty,
  outcome: nonEmpty,
  detail: nonEmpty,
  deliverables: z.array(nonEmpty).min(1),
  mediaSlot: nonEmpty,
});

/** 프로젝트 케이스 스터디. 가이드 §9 의 5단 구조를 강제한다. */
export const projectSchema = z.object({
  slug: slugSchema,
  title: nonEmpty,
  subtitle: nonEmpty,
  stack: z.array(nonEmpty).min(1),
  /**
   * 게시 여부. `false` 인 항목은 프로덕션 빌드에서 노출되지 않는다.
   * 검증되지 않은 실적 주장이 실수로 배포되는 것을 막는 안전장치다.
   */
  isPublished: z.boolean(),
  problem: nonEmpty,
  environment: nonEmpty,
  simulation: nonEmpty,
  verification: nonEmpty,
  result: nonEmpty,
  mediaSlot: nonEmpty,
});

/** 기술 그룹. 로고 나열이 아니라 "프로젝트에서의 역할"을 서술한다 (가이드 §10). */
export const technologyGroupSchema = z.object({
  id: slugSchema,
  title: nonEmpty,
  /** 그룹을 대표하는 비주얼. 없으면 텍스트만 렌더한다. */
  mediaSlot: nonEmpty.optional(),
  items: z
    .array(
      z.object({
        name: nonEmpty,
        role: nonEmpty,
      }),
    )
    .min(1),
});

export const navItemSchema = z.object({
  label: nonEmpty,
  href: nonEmpty,
});

/**
 * 검증 항목 묶음 — "우리가 실제로 재는 것".
 * 수행 근거가 있는 항목만 넣는다(근거 대장: 저장소 밖 비공개 문서).
 */
export const capabilityGroupSchema = z.object({
  id: slugSchema,
  title: nonEmpty,
  items: z.array(nonEmpty).min(1),
});

export const siteSchema = z.object({
  /** 브랜드명. 미확정 상태이며 결정 시 이 값만 교체한다 (프로젝트_메타.md D1). */
  brand: nonEmpty,
  brandIsProvisional: z.boolean(),
  positioning: nonEmpty,
  description: nonEmpty,
  /** 도메인 미확정. 배포 직전 실제 도메인으로 교체한다 (D1). */
  baseUrl: z.url(),
  contactEmail: z.email(),
  /** 표시용 전화번호. `tel:` 링크는 숫자만 남겨 별도로 만든다. */
  contactPhone: nonEmpty,
  nav: z.array(navItemSchema).min(1),
  cta: z.object({
    primary: navItemSchema,
    secondary: navItemSchema,
  }),
});

export const companySchema = z.object({
  philosophy: nonEmpty,
  philosophyBody: nonEmpty,
  principles: z.array(z.object({ title: nonEmpty, body: nonEmpty })).min(1),
  founder: z.object({
    name: nonEmpty,
    role: nonEmpty,
    summary: nonEmpty,
  }),
});

/** 홈의 섹션 하나를 여는 제목 블록. 본문은 선택이다. */
export const homeSectionSchema = z.object({
  eyebrow: nonEmpty,
  title: nonEmpty,
  body: nonEmpty.optional(),
});

/**
 * 홈 페이지 문구 (가이드 §8).
 * Hero 아래 섹션은 "ONE SCREEN, ONE MESSAGE"(디자인 컨셉 §16)에 따라 하나씩 이어진다.
 */
export const homeSchema = z.object({
  hero: z.object({
    /** 대문자 헤드라인. 줄바꿈 위치를 디자인이 정하므로 줄 단위로 나눠 둔다. */
    headlineLines: z.array(nonEmpty).min(1),
    mediaSlot: nonEmpty,
  }),
  /** 고객이 실제로 가지고 오는 질문 (가이드 §4). 기술 나열보다 문제를 먼저 보여준다. */
  problems: homeSectionSchema.extend({
    items: z.array(nonEmpty).min(1),
  }),
  services: homeSectionSchema,
  workflow: homeSectionSchema,
  projects: homeSectionSchema.extend({ cta: navItemSchema }),
  technology: homeSectionSchema.extend({ cta: navItemSchema }),
  why: homeSectionSchema.extend({
    mediaSlot: nonEmpty,
  }),
  contact: homeSectionSchema.extend({ mediaSlot: nonEmpty }),
});

/** 워크플로 단계 — Problem → Model → Simulate → Validate → Deploy (가이드 §6). */
export const workflowStepSchema = z.object({
  id: slugSchema,
  label: nonEmpty,
  body: nonEmpty,
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type Credit = z.infer<typeof creditSchema>;
export type MediaManifest = z.infer<typeof mediaManifestSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type TechnologyGroup = z.infer<typeof technologyGroupSchema>;
export type CapabilityGroup = z.infer<typeof capabilityGroupSchema>;
export type Site = z.infer<typeof siteSchema>;
export type Company = z.infer<typeof companySchema>;
export type Home = z.infer<typeof homeSchema>;
export type HomeSection = z.infer<typeof homeSectionSchema>;
export type WorkflowStep = z.infer<typeof workflowStepSchema>;
