import { notFound } from "next/navigation";
import { RichText } from "@/components/common/RichText";
import { ArchitectureDiagram } from "@/components/project/ArchitectureDiagram";
import { CaseDiagram } from "@/components/project/CaseDiagram";
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

      {/*
        케이스 스터디 상단은 사진이 아니라 **구성도**다.
        이 자리에서 답해야 하는 질문은 "무엇이 예쁘게 보이는가"가 아니라
        "무엇을 어디에 연결했고, 계측이 어디로 되돌아가는가"이기 때문이다.
        (목록 카드의 이미지는 그대로 두어 훑어보는 화면의 리듬을 유지한다.)
      */}
      <Section wide>
        <SectionHeading as="h2" eyebrow="Architecture" title="SIMULATION ARCHITECTURE" />
        <div className="mt-12">
          <ArchitectureDiagram architecture={project.architecture} />
        </div>

        {/*
          구성도가 "무엇이 있는가"를 그렸다면, 아래는 **계층 사이**를 그린다.
          시뮬레이션 결함이 사는 곳이 대개 경계이기 때문이다(단위 · 부호 · 주기 · 좌표계).
        */}
        {project.diagrams.map((diagram) => (
          <div key={diagram.title} className="mt-24">
            <CaseDiagram diagram={diagram} />
          </div>
        ))}

        <p className="mt-24 font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
          measured
        </p>
        <dl className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="border-t border-line pt-6">
              <dt className="font-mono text-[0.6875rem] tracking-[0.2em] text-faint uppercase">
                {metric.label}
              </dt>
              <dd>
                <p className="mt-3 text-(length:--text-title) leading-none font-semibold tracking-tight">
                  {metric.value}
                </p>
                {metric.note ? (
                  <p className="mt-3 text-xs leading-relaxed text-faint">{metric.note}</p>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section bordered>
        <dl className="border-t border-line">
          {caseStudySections.map((entry) => (
            <div key={entry.label} className="grid gap-4 border-b border-line py-10 md:grid-cols-3">
              <dt className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
                {entry.label}
              </dt>
              <dd className="space-y-5 leading-relaxed text-muted md:col-span-2">
                {entry.body.map((paragraph, index) => (
                  <p key={index}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section bordered>
        <SectionHeading
          as="h2"
          eyebrow="Notes"
          title="ENGINEERING NOTES"
          body="이 프로젝트가 남긴 판단입니다. 다음 프로젝트에서 같은 자리를 다시 밟지 않기 위해 적어 둡니다."
        />
        <ul className="mt-12 border-t border-line">
          {project.lessons.map((lesson) => (
            <li key={lesson.title} className="grid gap-4 border-b border-line py-10 md:grid-cols-3">
              <h3 className="leading-snug font-semibold">{lesson.title}</h3>
              <p className="leading-relaxed text-muted md:col-span-2">
                <RichText text={lesson.body} />
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
