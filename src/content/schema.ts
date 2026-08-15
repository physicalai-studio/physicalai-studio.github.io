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
  /**
   * 제품 사다리 위치 (사업_정의.md §5). A 는 진입, B 가 핵심 상품, C 는 고급 연구 고객.
   * 서비스가 다섯이어도 **고객이 사는 단위는 셋**이라는 것을 화면에서 드러내기 위한 라벨이다.
   */
  tier: z.enum(["A", "B", "C"]),
  title: nonEmpty,
  titleKo: nonEmpty,
  outcome: nonEmpty,
  detail: nonEmpty,
  deliverables: z.array(nonEmpty).min(1),
  mediaSlot: nonEmpty,
});

/**
 * 아키텍처 다이어그램의 노드 1개.
 *
 * 다이어그램은 그림 파일이 아니라 **선과 글자로 그린다**(디자인 컨셉 §17 — 이미지 안에 글자를
 * 굽지 않는다). 그래서 라벨은 한 줄에 들어갈 길이로 제한하고, 설명은 `note` 로 내린다.
 */
export const architectureNodeSchema = z.object({
  label: z.string().min(1).max(28, "노드 라벨은 한 줄에 들어가야 한다(28자 이내)"),
  note: nonEmpty.optional(),
});

/** 다이어그램의 세로 계층 하나. 왼쪽에서 오른쪽으로 신호가 흐른다. */
export const architectureColumnSchema = z.object({
  /** 계층 이름. 대문자 영문 라벨 (타이포그래피 §5). */
  label: nonEmpty,
  nodes: z.array(architectureNodeSchema).min(1).max(4),
  /** 이 케이스의 무게 중심이 되는 계층. 액센트로 표시하며 다이어그램당 하나만 둔다. */
  isFocus: z.boolean().optional(),
});

/**
 * 시뮬레이션 아키텍처 다이어그램.
 *
 * `feedback` 을 선택 항목으로 두지 않는다 — 계측이 모델로 되돌아가지 않는 구성은
 * 이 스튜디오가 파는 것(docs/사업_정의.md §4 닫힌 루프)이 아니기 때문이다.
 */
export const architectureSchema = z
  .object({
    columns: z.array(architectureColumnSchema).min(3).max(5),
    /** 되돌아오는 경로 — 계측 결과가 어디로 다시 들어가는지. */
    feedback: nonEmpty,
    caption: nonEmpty,
  })
  .refine((diagram) => diagram.columns.filter((column) => column.isFocus).length <= 1, {
    message: "isFocus 는 다이어그램당 하나만 둔다",
  });

/**
 * 경계 하나를 지나는 신호.
 *
 * 시뮬레이션에서 결함이 사는 곳은 계층 안이 아니라 **계층 사이**다 — 단위 · 부호 · 주기 ·
 * 좌표계가 바뀌는 지점. 그래서 "무엇이 흐르는가"보다 **"경계에서 무엇이 바뀌거나 사라지는가"**
 * 를 필수 항목으로 둔다.
 */
export const interfaceEdgeSchema = z.object({
  from: z.string().min(1).max(24),
  to: z.string().min(1).max(24),
  /** 흐르는 값. */
  payload: nonEmpty,
  /** 주기 · 타이밍. 이산화가 결과를 바꾸는 경계에만 적는다. */
  rate: nonEmpty.optional(),
  /** 이 경계에서 바뀌거나 사라지는 것. 비워 둘 수 없다. */
  boundary: nonEmpty,
});

/** 닫힌 루프의 한 걸음. */
export const loopStepSchema = z.object({
  label: z.string().min(1).max(24),
  note: nonEmpty.optional(),
});

/**
 * 케이스에 덧붙이는 보조 다이어그램.
 *
 * 아키텍처 구성도가 "무엇이 있는가"를 그린다면, 이쪽은 **연결 관계 자체**를 그린다.
 * - `interfaces` — 경계별로 흐르는 값과 그 경계에서 바뀌는 것
 * - `loop` — 되돌아오는 경로가 있는 닫힌 루프(결함이 도는 경로 · 제어 루프)
 */
export const caseDiagramSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("interfaces"),
    title: nonEmpty,
    caption: nonEmpty,
    edges: z.array(interfaceEdgeSchema).min(2).max(6),
  }),
  z.object({
    kind: z.literal("loop"),
    title: nonEmpty,
    caption: nonEmpty,
    steps: z.array(loopStepSchema).min(3).max(6),
    /** 마지막 걸음이 첫 걸음으로 돌아가는 경로의 설명. */
    returnLabel: nonEmpty,
  }),
]);

/**
 * 계측값 1건.
 *
 * `value` 는 화면에서 가장 큰 글자가 되므로 짧은 토큰이어야 한다.
 * 근거 없는 값을 쓰지 않는다 — 수치는 전부 실제로 잰 결과다.
 */
export const metricSchema = z.object({
  value: z.string().min(1).max(16),
  label: nonEmpty,
  note: nonEmpty.optional(),
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
  /** 구매자가 기술 기록을 실제 발주 맥락으로 읽을 수 있게 하는 공개 가능한 상업 정보. */
  engagement: z
    .object({
      decision: nonEmpty,
      delivered: nonEmpty,
      disclosure: nonEmpty,
    })
    .optional(),
  /** 케이스 스터디 상단에 놓이는 시뮬레이션 구성도. 사진 대신 이것을 보여준다. */
  architecture: architectureSchema,
  /**
   * 연결 관계를 설명하는 보조 다이어그램. 필요한 만큼만 둔다(최대 3).
   * 없으면 빈 배열을 명시한다 — 생략을 기본값으로 두면 "설명할 연결이 없다"와
   * "아직 안 적었다"가 구분되지 않는다.
   */
  diagrams: z.array(caseDiagramSchema).max(3),
  /** 계측 요약. 본문을 읽지 않아도 "무엇을 쟀는지"가 먼저 보이게 한다. */
  metrics: z.array(metricSchema).min(3).max(6),
  /**
   * 5단 본문. 각 항목은 **문단 배열**이다.
   * 한 문단에 여러 주장을 밀어넣는 대신 문단을 나눠 읽는 속도를 유지한다.
   * 문장 안의 `**강조**` 는 `RichText` 가 해석한다(src/lib/richText.ts).
   */
  problem: z.array(nonEmpty).min(1),
  environment: z.array(nonEmpty).min(1),
  simulation: z.array(nonEmpty).min(1),
  verification: z.array(nonEmpty).min(1),
  result: z.array(nonEmpty).min(1),
  /** 이 프로젝트가 남긴 설계 판단. 실적 자랑이 아니라 다음 프로젝트에 쓰는 원칙이다. */
  lessons: z
    .array(z.object({ title: nonEmpty, body: nonEmpty }))
    .min(2)
    .max(5),
  mediaSlot: nonEmpty,
});

/** 기술 그룹. 로고 나열이 아니라 "프로젝트에서의 역할"을 서술한다 (가이드 §10). */
export const technologyGroupSchema = z.object({
  id: slugSchema,
  title: nonEmpty,
  /** 현재 납품에 쓰는 역량과 고객 요건에 따라 검토하는 연구 확장을 구분한다. */
  stage: z.enum(["delivery", "research"]),
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
 * 검증 항목 묶음 — "우리가 무엇을 재서 물리가 무엇을 허락하는지 밝히는가".
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

/**
 * HOW WE WORK 의 문(門) 하나 (docs/how_we_work.md).
 *
 * 이것은 작업 순서가 아니라 **아이디어가 현실이 되기 위해 통과해야 하는 관문**이다.
 * 그래서 `workflowStepSchema`(운영 루프)와 별개로 둔다 — 둘은 같은 일을 다른 세계관으로
 * 기술한 것이고, 홈페이지에는 이쪽을 쓴다(how_we_work.md §"전체가 하나의 문장").
 */
export const workGateSchema = z.object({
  id: slugSchema,
  index: nonEmpty,
  /** 대문자 영문 라벨 (타이포그래피 §5). */
  title: nonEmpty,
  /** 같은 뜻의 한국어 한 줄. 영문 라벨만으로는 의미가 닫히지 않는다. */
  titleKo: nonEmpty,
  body: nonEmpty,
});

export const companySchema = z.object({
  philosophy: nonEmpty,
  philosophyBody: nonEmpty,
  /**
   * 이 사업이 현실에 접근하는 방법. About 과 홈이 같은 값을 읽는다.
   *
   * `gates` 를 정확히 5개로 못박는 이유: 다섯이 하나의 구조이고, 하나가 빠지면
   * 남은 것이 "흔한 컨설팅 프로세스"로 되돌아간다(how_we_work.md §Abstract).
   * 특히 04(경계 탐색)와 05(현실로 이전)가 빠지면 PASS/FAIL 검증 용역과 구분되지 않는다.
   */
  howWeWork: z.object({
    title: nonEmpty,
    body: nonEmpty,
    gates: z.array(workGateSchema).length(5, "다섯 개의 문이 하나의 구조다"),
  }),
  founder: z.object({
    name: nonEmpty,
    role: nonEmpty,
    summary: nonEmpty,
  }),
});

/** 섹션 하나를 여는 제목 블록. 본문은 선택이다. */
export const sectionHeadingSchema = z.object({
  eyebrow: nonEmpty,
  title: nonEmpty,
  body: nonEmpty.optional(),
});

/** 1인 스튜디오의 수행 경계와 문의 프로토콜. */
export const engagementSchema = z.object({
  founderLed: sectionHeadingSchema.extend({ boundaries: z.array(nonEmpty).min(3) }),
  inquiry: z.object({
    inputs: z.array(nonEmpty).min(3),
    response: nonEmpty,
    confidentiality: nonEmpty,
    steps: z.array(nonEmpty).min(3),
  }),
});

/** 홈의 섹션도 같은 모양이다. 이름만 유지한다. */
export const homeSectionSchema = sectionHeadingSchema;

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
  /** 02 — 고객군. Problems 바로 뒤에 온다(자기 문제를 읽은 직후가 자격 판정 시점). */
  customers: homeSectionSchema,
  services: homeSectionSchema,
  /**
   * 03 — HOW WE WORK.
   * 제목은 `company.howWeWork.title` 이 단일 근원이므로 여기 두지 않는다(문구 드리프트 방지).
   */
  howWeWork: z.object({ eyebrow: nonEmpty, body: nonEmpty }),
  projects: homeSectionSchema.extend({ cta: navItemSchema }),
  technology: homeSectionSchema.extend({ cta: navItemSchema }),
  why: homeSectionSchema.extend({
    mediaSlot: nonEmpty,
  }),
  contact: homeSectionSchema.extend({ mediaSlot: nonEmpty }),
});

/**
 * 고객군 1종 (사업_정의.md §4).
 *
 * **방문자가 자기를 알아보는 자리다.** 그래서 "우리가 무엇을 해준다"가 아니라
 * `has`(이미 가진 것) → `pain`(그래서 겪는 것) → `gets`(그래서 받는 것) 순으로 적는다.
 * 자격 판정을 방문자 스스로 하게 만드는 것이 이 블록의 목적이다.
 */
export const customerSegmentSchema = z.object({
  id: slugSchema,
  label: nonEmpty,
  has: nonEmpty,
  pain: nonEmpty,
  gets: nonEmpty,
});

/**
 * 산출물 묶음 1종 (사업_정의.md §7).
 *
 * `.usd` 파일 하나가 아니라 **묶음**을 판다는 것을 화면에서 보이기 위한 구조다.
 * 무엇이 함께 오는지 적어 두지 않으면 고객은 받은 것을 파일 개수로 센다.
 */
export const deliverableBundleSchema = z.object({
  id: slugSchema,
  title: nonEmpty,
  items: z.array(nonEmpty).min(2),
});

/**
 * 충실도 층 1개 (사업_정의.md §6 ②).
 *
 * **"실제와 같습니다"라고 말하지 않기 위한 장치다.** 무엇을 어느 수준까지 표현했는지를
 * 층으로 나눠 선언하면, 고객은 그 시뮬레이션에서 어떤 질문에 답할 수 있는지 스스로 안다.
 */
export const fidelityLayerSchema = z.object({
  code: nonEmpty,
  title: nonEmpty,
  items: nonEmpty,
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
export type Architecture = z.infer<typeof architectureSchema>;
export type ArchitectureColumn = z.infer<typeof architectureColumnSchema>;
export type CaseDiagram = z.infer<typeof caseDiagramSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type TechnologyGroup = z.infer<typeof technologyGroupSchema>;
export type CapabilityGroup = z.infer<typeof capabilityGroupSchema>;
export type Site = z.infer<typeof siteSchema>;
export type Company = z.infer<typeof companySchema>;
export type WorkGate = z.infer<typeof workGateSchema>;
export type Home = z.infer<typeof homeSchema>;
export type HomeSection = z.infer<typeof homeSectionSchema>;
export type SectionHeadingContent = z.infer<typeof sectionHeadingSchema>;
export type Engagement = z.infer<typeof engagementSchema>;
export type WorkflowStep = z.infer<typeof workflowStepSchema>;
export type CustomerSegment = z.infer<typeof customerSegmentSchema>;
export type DeliverableBundle = z.infer<typeof deliverableBundleSchema>;
export type FidelityLayer = z.infer<typeof fidelityLayerSchema>;
