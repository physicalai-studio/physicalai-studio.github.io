import { mediaManifestSchema, type MediaAsset } from "./schema";

/**
 * 미디어 자산 매니페스트 (ADR-0005).
 *
 * 규칙:
 * - 영상 원본을 저장소에 커밋하지 않는다. 외부 스토리지/CDN 의 URL 만 여기에 둔다.
 *   (사전 최적화된 정지 이미지는 `public/media/` 에 둔다.)
 * - 모든 자산은 공개 근거(`clearance`)를 가진다. `pending` 자산은 게시하지 않는다.
 * - 제3자 자산(`licensed`)은 출처(`credit`)가 필수이며 화면에 표기된다.
 * - 자산이 준비되기 전까지 `kind: "placeholder"` 로 두면 전 페이지가 그대로 렌더된다.
 *
 * 각 슬롯에 필요한 자산의 촬영 규격은 docs/미디어_자산_명세서.md 를 따른다.
 */
export const mediaManifest = mediaManifestSchema.parse({
  // 절차적으로 생성한 배경(scripts/gen-fields.py). 사진이 아니라 수식이라 라이선스가 자유롭고
  // 사이트 듀오톤과 정확히 같은 초록을 쓴다. 실제 시뮬레이션 영상이 준비되면 교체한다(debt-007).
  "home-hero": {
    kind: "image",
    src: "/media/home-hero-field.webp",
    alt: "어두운 배경 위에 겹쳐진 초록빛 고리 형태의 추상 광장(光場)",
    clearance: "self-produced",
  },
  // 마무리 CTA 배경. 히어로와 같은 방식으로 생성하되 형상이 다르다(두 파동원의 간섭 무늬).
  "home-contact": {
    kind: "image",
    src: "/media/home-contact-field.webp",
    alt: "두 파동원이 만드는 초록빛 간섭 무늬 추상 이미지",
    clearance: "self-produced",
  },
  // About 페이지 전체 배경 — 퍼져 나가는 파면(WAVEFRONT). 역량의 범위를 말하는 자리.
  "about-backdrop": {
    kind: "image",
    src: "/media/about-field.webp",
    alt: "가로로 길게 늘어난 초록빛 고리 형태의 광장(光場)",
    clearance: "self-produced",
  },
  // Contact 페이지 전체 배경 — 홈 CTA 와 같은 간섭 무늬를 넓고 조용하게.
  "contact-backdrop": {
    kind: "image",
    src: "/media/contact-page-field.webp",
    alt: "오른쪽을 가리키는 초록빛 V 자 파면",
    clearance: "self-produced",
  },
  // 본문 페이지 전체 배경 3종 — About·Contact 보다 밝고 파동의 중심이 화면 안에 있다.
  "services-backdrop": {
    kind: "image",
    src: "/media/services-field.webp",
    alt: "중심에서 퍼지는 발광에 어두운 마디 띠가 새겨진 정상파",
    clearance: "self-produced",
  },
  "projects-backdrop": {
    kind: "image",
    src: "/media/projects-field.webp",
    alt: "두 직교 평면파가 만드는 초록빛 격자 간섭 무늬",
    clearance: "self-produced",
  },
  "technology-backdrop": {
    kind: "image",
    src: "/media/technology-field.webp",
    alt: "발원점이 보이는 초록빛 동심 파면",
    clearance: "self-produced",
  },
  "service-feasibility": {
    kind: "image",
    src: "/media/collision-validation.webp",
    alt: "휴머노이드 다리의 충돌 메시와 관절 한계가 와이어프레임으로 표시된 검증 화면",
    clearance: "self-produced",
  },
  "service-poc": {
    kind: "image",
    src: "/media/simulation-poc.webp",
    alt: "이동 로봇과 로봇팔이 파레트 앞에서 작업 자세를 취한 시뮬레이션 화면",
    clearance: "self-produced",
  },
  "service-vc": {
    kind: "image",
    src: "/media/industrial-cell.webp",
    alt: "제조 라인에서 동작 중인 산업용 로봇 셀",
    clearance: "licensed",
    credit: {
      holder: "Lexington Medical, Inc.",
      license: "CC0 1.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lexington_Medical,_Inc._Manufacturing_Robot_Arm.jpg",
    },
  },
  "service-twin": {
    kind: "image",
    src: "/media/digital-twin-pointcloud.webp",
    alt: "LiDAR 로 스캔한 도시 교차로의 3차원 포인트 클라우드",
    clearance: "licensed",
    credit: {
      holder: "Daniel L. Lu",
      isModified: true,
      license: "CC BY 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Ouster_OS1-64_lidar_point_cloud_of_intersection_of_Folsom_and_Dore_St,_San_Francisco.png",
    },
  },
  "technology-actuator": {
    kind: "image",
    src: "/media/actuator-harmonic-drive.webp",
    alt: "로봇 관절에 쓰이는 하모닉 드라이브(파동 기어) 내부 구조",
    clearance: "licensed",
    credit: {
      holder: "wdwd",
      isModified: true,
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Harmonic_Drive.jpg",
    },
  },
  "service-physical-ai": {
    kind: "image",
    src: "/media/physical-ai.webp",
    alt: "테스트 리그에 장착된 휴머노이드 하체의 물리 검증 환경",
    clearance: "self-produced",
  },
  "project-machine-tending": {
    kind: "placeholder",
    intent: "좁은 표적 통과 작업 — 공구 자세와 접근 경로가 보이는 컷",
  },
  "project-navigation": {
    kind: "placeholder",
    intent: "다중 LiDAR 병합 결과 — 두 스캔이 하나로 합쳐진 점군 화면",
  },
  "project-amr-manipulator": {
    kind: "image",
    src: "/media/amr-manipulator.webp",
    alt: "AMR 베이스 위에 로봇팔이 결합된 통합 물류 시뮬레이션 화면",
    clearance: "self-produced",
  },
  "project-humanoid": {
    kind: "image",
    src: "/media/humanoid.webp",
    alt: "휴머노이드 다리 관절의 충돌 형상과 조인트 프레임 시각화",
    clearance: "self-produced",
  },
});

/** 슬롯 ID 로 자산을 조회한다. 등록되지 않은 슬롯은 플레이스홀더로 폴백한다. */
export function getMediaAsset(slotId: string): MediaAsset {
  return (
    mediaManifest[slotId] ?? {
      kind: "placeholder",
      intent: `미등록 슬롯: ${slotId}`,
    }
  );
}

/** 게시 가능한 자산인지 판정한다. 공개 근거가 확인되지 않은 자산은 노출하지 않는다. */
export function isPublishableAsset(asset: MediaAsset): boolean {
  return asset.kind === "placeholder" ? false : asset.clearance !== "pending";
}
