import Link from "next/link";
import { ButtonLink } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Section } from "@/components/section/Section";
import { SectionHeading } from "@/components/section/SectionHeading";
import { company } from "@/content/company";
import { home } from "@/content/home";
import { getVisibleProjects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { technologyGroups, workflowSteps } from "@/content/technology";

/**
 * 홈 (가이드 §8).
 *
 * Full Viewport Hero 아래로 7개 섹션이 이어진다:
 * Problems → Services → Workflow → Projects → Technology → Why → Contact.
 * 각 섹션은 한 가지 메시지만 전달한다 (디자인 컨셉 §16).
 */
export default function HomePage() {
  const projects = getVisibleProjects();

  return (
    <>
      <HeroSection />
      <ProblemsSection />
      <ServicesSection />
      <WorkflowSection />
      {projects.length > 0 ? <ProjectsSection /> : null}
      <TechnologySection />
      <WhySection />
      <ContactSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden">
      {/*
        배경은 절대배치 래퍼 안에 둔다.
        `MediaSlot` 자체가 `relative` 를 쓰므로 호출부에서 `absolute` 를 넘기면 충돌한다
        (Tailwind 는 클래스 나열 순서가 아니라 스타일시트 순서로 이기며, `relative` 가 뒤에 온다).
        그러면 배경이 흐름 안에 남아 카피를 옆으로 밀어낸다 — 그래서 래퍼로 감싼다.
      */}
      <div className="absolute inset-0">
        <MediaSlot slotId={home.hero.mediaSlot} className="h-full w-full" />
        {/*
          텍스트 가독성 확보용 음영. 장식용 그라디언트가 아니다.
          배경 자산이 어두우므로 최소한만 건다 — 세게 걸면 형상이 죽는다.
        */}
        <div className="absolute inset-0 bg-bg/15" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-bg via-bg/55 to-transparent" />
      </div>

      <Container wide className="relative pb-24">
        <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-muted uppercase">
          {site.positioning}
        </p>

        <h1 className="mt-8 max-w-[18ch] text-(length:--text-display) leading-[0.95] font-semibold tracking-tight uppercase">
          {home.hero.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-8 max-w-xl leading-relaxed text-muted">{site.description}</p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={site.cta.secondary.href}>{site.cta.secondary.label}</ButtonLink>
          <ButtonLink href={site.cta.primary.href} variant="solid">
            {site.cta.primary.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/** 01 — 기술 목록보다 고객의 질문을 먼저 보여준다 (가이드 §4). */
function ProblemsSection() {
  return (
    <Section bordered wide>
      <Reveal>
        <SectionHeading
          eyebrow={home.problems.eyebrow}
          title={home.problems.title}
          body={home.problems.body}
        />
        <ul className="mt-16 border-t border-line">
          {home.problems.items.map((question, index) => (
            <li
              key={question}
              className="grid gap-3 border-b border-line py-8 md:grid-cols-[6rem_1fr] md:gap-8"
            >
              <span className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-lg leading-snug md:text-2xl">{question}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/** 02 — 서비스는 결과 중심으로 한 줄씩. 상세는 /services 가 맡는다. */
function ServicesSection() {
  return (
    <Section bordered wide>
      <Reveal>
        <SectionHeading
          eyebrow={home.services.eyebrow}
          title={home.services.title}
          body={home.services.body}
        />
        <ul className="mt-16 border-t border-line">
          {services.map((service) => (
            <li key={service.id} className="border-b border-line">
              <Link
                href={`/services#${service.id}`}
                className="group grid gap-4 py-8 md:grid-cols-[6rem_1fr_1.2fr] md:items-baseline md:gap-8"
              >
                <span className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint">
                  {service.index}
                </span>
                <h3 className="text-(length:--text-title) leading-tight font-semibold tracking-tight uppercase transition-colors group-hover:text-accent">
                  {service.title}
                </h3>
                <p className="leading-relaxed text-muted">{service.outcome}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/** 03 — Problem → Model → Simulate → Validate → Deploy (가이드 §6). */
function WorkflowSection() {
  return (
    <Section bordered wide>
      <Reveal>
        <SectionHeading
          eyebrow={home.workflow.eyebrow}
          title={home.workflow.title}
          body={home.workflow.body}
        />
        <ol className="mt-16 grid gap-px border border-line bg-line md:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <li key={step.id} className="bg-bg p-6">
              <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 text-sm font-semibold tracking-[0.15em] uppercase">{step.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

/** 04 — 게시된 케이스 스터디가 있을 때만 렌더된다(홈에 빈 목록을 두지 않는다). */
function ProjectsSection() {
  const projects = getVisibleProjects();

  return (
    <Section bordered wide>
      <Reveal>
        <SectionHeading
          eyebrow={home.projects.eyebrow}
          title={home.projects.title}
          body={home.projects.body}
        />
        <ul className="mt-16 grid gap-12 md:grid-cols-2">
          {projects.slice(0, 4).map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <MediaSlot slotId={project.mediaSlot} className="aspect-16/9 w-full" />
                <h3 className="mt-6 text-(length:--text-title) font-semibold tracking-tight uppercase transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="mt-2 text-muted">{project.subtitle}</p>
                <p className="mt-4 font-mono text-[0.6875rem] tracking-widest text-faint uppercase">
                  {project.stack.join(" / ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-16">
          <ButtonLink href={home.projects.cta.href}>{home.projects.cta.label}</ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}

/** 05 — 로고 나열 금지. 그룹별 항목 이름만 보여주고 역할 설명은 /technology 로 넘긴다. */
function TechnologySection() {
  return (
    <Section bordered wide>
      <Reveal>
        <SectionHeading
          eyebrow={home.technology.eyebrow}
          title={home.technology.title}
          body={home.technology.body}
        />
        <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {technologyGroups.map((group) => (
            <div key={group.id} className="bg-bg p-6">
              <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
                {group.title}
              </p>
              <ul className="mt-6 space-y-3">
                {group.items.map((item) => (
                  <li key={item.name} className="text-sm">
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <ButtonLink href={home.technology.cta.href}>{home.technology.cta.label}</ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}

/** 06 — 시뮬레이션을 먼저 하는 이유. 회사 원칙을 그대로 재사용한다. */
function WhySection() {
  return (
    <Section bordered wide>
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <MediaSlot slotId={home.why.mediaSlot} className="aspect-4/3 w-full" />
          <div>
            <SectionHeading
              eyebrow={home.why.eyebrow}
              title={home.why.title}
              body={home.why.body}
            />
            <dl className="mt-12 border-t border-line">
              {company.principles.map((principle) => (
                <div key={principle.title} className="border-b border-line py-6">
                  <dt className="text-sm font-semibold tracking-[0.15em] uppercase">
                    {principle.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{principle.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** 07 — 마지막 화면은 문의 하나만 남긴다 (디자인 컨셉 §4). */
function ContactSection() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden border-t border-line">
      {/* 배경 래퍼 — 히어로와 같은 이유로 MediaSlot 을 직접 절대배치하지 않는다. */}
      <div className="absolute inset-0">
        <MediaSlot slotId={home.contact.mediaSlot} className="h-full w-full" />
        {/* 카피가 좌측이므로 왼쪽을 더 눌러 대비를 만든다. */}
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-bg to-transparent" />
      </div>

      <Container wide className="relative">
        <p className="font-mono text-(length:--text-eyebrow) tracking-[0.3em] text-faint uppercase">
          {home.contact.eyebrow}
        </p>
        <h2 className="mt-6 text-(length:--text-headline) leading-[1.05] font-semibold tracking-tight uppercase">
          {home.contact.title}
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{home.contact.body}</p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={site.cta.primary.href} variant="solid">
            {site.cta.primary.label}
          </ButtonLink>
          <ButtonLink href={site.cta.secondary.href}>{site.cta.secondary.label}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
