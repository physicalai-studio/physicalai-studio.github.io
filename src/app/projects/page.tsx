import Link from "next/link";
import { MediaSlot } from "@/components/media/MediaSlot";
import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { getVisibleProjects } from "@/content/projects";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Projects",
  description:
    "고객의 막힌 지점, 필요한 의사결정, 제공물과 활용 결과로 읽는 로봇 시뮬레이션 케이스 스터디.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getVisibleProjects();

  return (
    <div className="relative">
      <PageBackdrop slotId="projects-backdrop" />
      <div className="relative">
        <Section wide className="pt-40">
          <SectionHeading
            as="h1"
            eyebrow="Projects"
            title="Case Studies"
            body="기술 목록보다 먼저 누가 무엇 때문에 막혀 있었고, 이 작업이 어떤 결정을 바꿨는지 보여드립니다. 그다음에 판단을 뒷받침한 구조와 수치를 공개합니다."
          />
        </Section>

        <Section bordered wide>
          {projects.length === 0 ? (
            <p className="text-muted">공개 준비 중인 케이스 스터디가 곧 등록됩니다.</p>
          ) : (
            <ul className="border-t border-line">
              {projects.map((project) => (
                <li key={project.slug} className="border-b border-line">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group grid gap-8 py-10 md:grid-cols-[1fr_2fr] md:items-center md:gap-16"
                  >
                    <MediaSlot slotId={project.mediaSlot} className="aspect-16/9 w-full" />
                    <div>
                      <h2 className="text-(length:--text-title) font-semibold tracking-tight uppercase transition-colors group-hover:text-accent">
                        {project.title}
                      </h2>
                      <p className="mt-3 font-mono text-[0.6875rem] tracking-widest text-accent uppercase">
                        {project.engagement.customerType}
                      </p>
                      <p className="mt-5 leading-relaxed text-muted">
                        {project.engagement.decision}
                      </p>
                      <p className="mt-6 font-mono text-[0.6875rem] tracking-widest text-faint uppercase">
                        {project.stack.join(" / ")}
                      </p>
                      {!project.isPublished ? (
                        <p className="mt-4 border border-line px-3 py-2 font-mono text-[0.6875rem] tracking-widest text-faint uppercase">
                          draft — 개발 환경에서만 표시됨
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
