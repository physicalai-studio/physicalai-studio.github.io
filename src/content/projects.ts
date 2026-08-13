import { projectSchema, type Project } from "./schema";

/**
 * 프로젝트 케이스 스터디 (가이드 §9).
 *
 * ⚠ 아래 항목은 전부 `isPublished: false` 다 — **구조 확인용 골격이며 실적 주장이 아니다.**
 * 실제 내용과 근거가 채워지고 공개 가능 여부가 확인된 뒤에만 `isPublished: true` 로 바꾼다.
 * 검증되지 않은 실적이 프로덕션에 노출되는 것을 막기 위해, 미게시 항목은
 * `getVisibleProjects()` 가 프로덕션 빌드에서 제외한다.
 */
const projects: Project[] = [
  {
    slug: "robot-arm-machine-tending",
    title: "INDUSTRIAL ROBOT MACHINE TENDING",
    subtitle: "공작기계 소재 공급 자동화 검토",
    stack: ["Isaac Sim", "ROS2", "Robot Arm"],
    isPublished: false,
    problem: "(작성 예정) 고객이 해결하고자 한 문제를 한 문단으로 기술한다.",
    environment: "(작성 예정) 사용된 로봇 · 설비 · 환경 구성.",
    simulation: "(작성 예정) 어떤 시뮬레이션을 어떤 조건으로 수행했는지.",
    verification: "(작성 예정) 무엇을 어떤 기준으로 검증했는지.",
    result: "(작성 예정) 검증으로 확인된 결과. 수치 주장은 근거가 있을 때만 기재한다.",
    mediaSlot: "project-machine-tending",
  },
  {
    slug: "amr-manipulator-material-handling",
    title: "AMR + MANIPULATOR",
    subtitle: "이동 로봇과 로봇팔의 통합 물류 시뮬레이션",
    stack: ["Isaac Sim", "ROS2", "AMR", "Digital Twin"],
    isPublished: false,
    problem: "(작성 예정)",
    environment: "(작성 예정)",
    simulation: "(작성 예정)",
    verification: "(작성 예정)",
    result: "(작성 예정)",
    mediaSlot: "project-amr-manipulator",
  },
  {
    slug: "humanoid-manipulation",
    title: "HUMANOID MANIPULATION",
    subtitle: "휴머노이드 조작 작업 학습 환경",
    stack: ["Isaac Lab", "Reinforcement Learning", "Humanoid"],
    isPublished: false,
    problem: "(작성 예정)",
    environment: "(작성 예정)",
    simulation: "(작성 예정)",
    verification: "(작성 예정)",
    result: "(작성 예정)",
    mediaSlot: "project-humanoid",
  },
].map((project) => projectSchema.parse(project));

export const allProjects = projects;

/**
 * 화면에 노출할 프로젝트 목록을 반환한다.
 *
 * 프로덕션에서는 `isPublished: true` 인 항목만 반환하고, 개발 환경에서는 미게시 항목도 포함해
 * 레이아웃을 확인할 수 있게 한다.
 */
export function getVisibleProjects(): Project[] {
  if (process.env.NODE_ENV === "production") {
    return projects.filter((project) => project.isPublished);
  }
  return projects;
}

/** 슬러그로 프로젝트 1건을 찾는다. 없으면 `undefined`. */
export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
