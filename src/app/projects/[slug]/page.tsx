import { notFound } from "next/navigation";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { allProjects, findProjectBySlug } from "@/content/projects";
import { buildPageMetadata } from "@/lib/seo";

/** 정적 export 이므로 사전에 생성할 경로를 모두 나열한다. 목록 밖 경로는 404. */
export const dynamicParams = false;

/**
 * 미게시 항목까지 경로를 생성한다.
 *
 * `output: "export"` 는 동적 라우트에 최소 1개의 경로를 요구하므로, 게시 항목이 0건인 동안에도
 * 빌드가 성립해야 한다. 대신 미게시 페이지는 목록 · 사이트맵에서 제외하고 `noindex` 를 붙여
 * 검색에 노출되지 않게 한다. 미게시 본문에는 실적 주장을 두지 않는다.
 */
export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) return {};

  const metadata = buildPageMetadata({
    title: project.title,
    description: project.subtitle,
    path: `/projects/${project.slug}`,
  });

  if (!project.isPublished) {
    return { ...metadata, robots: { index: false, follow: false } };
  }
  return metadata;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) notFound();

  /** 가이드 §9 가 정한 케이스 스터디 5단 구조. 순서를 바꾸지 않는다. */
  const caseStudySections = [
    { label: "PROBLEM", body: project.problem },
    { label: "ENVIRONMENT", body: project.environment },
    { label: "SIMULATION", body: project.simulation },
    { label: "VERIFICATION", body: project.verification },
    { label: "RESULT", body: project.result },
  ];

  return (
    <>
      <Section wide className="pt-40">
        <SectionHeading as="h1" eyebrow={project.stack.join(" / ")} title={project.title} />
        <p className="mt-6 text-muted">{project.subtitle}</p>
        {!project.isPublished ? (
          <p className="mt-8 inline-block border border-line px-4 py-3 font-mono text-[0.6875rem] tracking-widest text-faint uppercase">
            draft — 작성 중인 케이스 스터디입니다 (검색 미노출)
          </p>
        ) : null}
      </Section>

      <Section wide>
        <MediaSlot slotId={project.mediaSlot} className="aspect-16/9 w-full" />
      </Section>

      <Section bordered>
        <dl className="border-t border-line">
          {caseStudySections.map((entry) => (
            <div key={entry.label} className="grid gap-4 border-b border-line py-10 md:grid-cols-3">
              <dt className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
                {entry.label}
              </dt>
              <dd className="leading-relaxed md:col-span-2">{entry.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
