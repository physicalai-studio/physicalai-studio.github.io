import Link from "next/link";
import { MediaSlot } from "@/components/media/MediaSlot";
import { PageBackdrop } from "@/components/section/PageBackdrop";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { getVisibleProjects } from "@/content/projects";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Projects",
  description: "문제 · 환경 · 시뮬레이션 · 검증 · 결과로 구성된 케이스 스터디.",
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
            body="포트폴리오 갤러리가 아닙니다. 무엇을 세워 넘겼고, 그 위에서 무엇이 돌았고, 그때 무엇이 숫자로 확인되었는지의 기록입니다."
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
                      <p className="mt-3 text-muted">{project.subtitle}</p>
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
