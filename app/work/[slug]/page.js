import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import MonoLabel from "@/components/ui/MonoLabel";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import TechIcon from "@/components/ui/TechIcon";
import CaseEmbed from "@/components/work/CaseEmbed";
import PageScrub from "@/components/work/PageScrub";
import { getProjects, getProject, getAgency } from "@/lib/content";
// frame counts written by scripts/generate-shots.mjs alongside the strips
import shotFrames from "@/data/shots.json";

/**
 * Case study — PRD §5.5, redesigned onto the site's own ground. The page used
 * to sit on light concrete while every homepage section moved to the fixed
 * smoke; it reads as one site now.
 *
 * The order is an argument: the name, then the thing running live, then the
 * spec sheet holding station beside the written story, then their whole page
 * scrubbed past the glass, then the way out. Challenge/approach/outcome render
 * only where Phase 6 wrote them from the real sites — nothing is invented to
 * fill the gap, and the block numbering closes over whatever is present.
 * Statically generated for all 11 slugs.
 */

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const title = `${project.client} — Case Study · Amartya Baul`;
  const description = `${project.client}: a production website for the ${project.sector.toLowerCase()} sector, designed and built at PKG IT. Live, running, and embedded on this page.`;
  return {
    title,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`/og/${slug}.png`] },
  };
}

function SpecRow({ label, children }) {
  return (
    <div className="border-t border-rule-inv py-3">
      <MonoLabel as="dt" className="text-chalk-mute">
        {label}
      </MonoLabel>
      <dd className="mt-1.5 font-mono text-[0.92rem] uppercase tracking-[0.08em] text-chalk">
        {children}
      </dd>
    </div>
  );
}

export default async function CaseStudy({ params }) {
  const { slug } = await params;
  const [project, projects, agency] = await Promise.all([
    getProject(slug),
    getProjects(),
    getAgency(),
  ]);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const no = String(index + 1).padStart(2, "0");

  const copyBlocks = [
    { key: "challenge", label: "CHALLENGE", body: project.challenge ? [project.challenge] : [] },
    { key: "approach", label: "APPROACH", body: project.approach },
    { key: "outcome", label: "OUTCOME", body: project.outcome },
  ].filter((b) => b.body.length > 0);

  // 01 is the live screen; the written blocks follow; the scrub closes it out
  const pad = (n) => String(n).padStart(2, "0");
  const scrubIndex = pad(copyBlocks.length + 2);

  return (
    <>
      <Nav />
      <main id="content" className="text-chalk">
        {/* ── the name */}
        <header className="pb-14 pt-32">
          <div className="container space-y-10">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-inv pt-4">
              <MonoLabel className="whitespace-nowrap">
                <span className="text-signal">[ {no} ]</span>
                <span className="ml-3">CASE STUDY</span>
              </MonoLabel>
              <MonoLabel className="whitespace-nowrap text-chalk-mute">
                BUILD {no} / {String(projects.length).padStart(2, "0")}
              </MonoLabel>
            </div>
            <div className="grid grid-cols-1 items-end gap-y-6 lg:grid-cols-12 lg:gap-x-6">
              <RevealText as="h1" text={project.client} className="text-display lg:col-span-8" />
              <MonoLabel className="text-chalk-mute lg:col-span-4 lg:justify-self-end">
                {project.sector} · {project.year}
              </MonoLabel>
            </div>
            {project.tagline ? (
              <RevealText as="p" variant="fade" className="max-w-[62ch] text-body text-chalk-mute">
                {project.tagline}
              </RevealText>
            ) : null}
          </div>
        </header>

        <div className="container space-y-24 pb-section-half">
          {/* ── 01 · running now */}
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-inv pt-4">
              <MonoLabel className="whitespace-nowrap">
                <span className="text-signal">[ 01 ]</span>
                <span className="ml-3">RUNNING NOW</span>
              </MonoLabel>
              <MonoLabel className="whitespace-nowrap text-chalk-mute">
                LIVE SITE · NOT A SCREENSHOT
              </MonoLabel>
            </div>
            <div className="mt-8">
              <CaseEmbed project={project} />
            </div>
          </section>

          {/* ── the spec sheet holds station beside the written story */}
          <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-6">
            <aside className="lg:col-span-4">
              <div
                className="border border-white/15 bg-white/[0.04] p-6 lg:sticky lg:top-28"
                style={{
                  boxShadow:
                    "0 24px 48px -24px rgba(0,0,0,0.6), inset 1px 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <MonoLabel className="text-chalk-mute">SPEC SHEET</MonoLabel>
                <dl className="mt-4">
                  <SpecRow label="SECTOR">{project.sector}</SpecRow>
                  <SpecRow label="ROLE">{project.role}</SpecRow>
                  <SpecRow label="AGENCY">
                    <span className="flex items-center gap-3">
                      {agency.name}
                      <span className="relative inline-block h-4 w-14">
                        <Image
                          src={agency.logo}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain object-left opacity-80"
                        />
                      </span>
                    </span>
                  </SpecRow>
                  <SpecRow label="YEAR">{project.year}</SpecRow>
                  {project.duration ? (
                    <SpecRow label="DURATION">{project.duration}</SpecRow>
                  ) : null}
                  <SpecRow label="TYPE">
                    {project.type === "internal" ? "INTERNAL · PKG IT" : "CLIENT · PKG IT"}
                  </SpecRow>
                </dl>

                <div className="mt-5 border-t border-rule-inv pt-4">
                  <MonoLabel className="text-chalk-mute">BUILT WITH</MonoLabel>
                  <ul className="mt-3 flex flex-wrap gap-2.5">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        title={tech}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-rule-inv bg-white/[0.05] text-signal"
                      >
                        <TechIcon name={tech} className="h-5 w-5" />
                        <span className="sr-only">{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            <div className="space-y-16 lg:col-span-7 lg:col-start-6">
              {copyBlocks.map((block, i) => (
                <section key={block.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-inv pt-4">
                    <MonoLabel as="h2" className="whitespace-nowrap">
                      <span className="text-signal">[ {pad(i + 2)} ]</span>
                      <span className="ml-3">{block.label}</span>
                    </MonoLabel>
                  </div>
                  {block.key === "challenge" ? (
                    <RevealText
                      as="p"
                      variant="fade"
                      className="mt-6 max-w-[58ch] text-body leading-relaxed text-chalk"
                    >
                      {block.body[0]}
                    </RevealText>
                  ) : (
                    <ul className="mt-6 max-w-[58ch] space-y-4">
                      {block.body.map((item) => (
                        <li key={item} className="flex gap-4">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-signal"
                          />
                          <span className="text-body leading-relaxed text-chalk">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>

          {/* ── the journey down their page, drawn past the gate */}
          <PageScrub
            src={`/shots/${project.slug}.webp`}
            alt={`${project.client} — the site as it appears while scrolling, frame by frame`}
            index={scrubIndex}
            frames={shotFrames[project.slug] ?? 0}
          />

          {/* ── the way out */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            <Button href={project.siteUrl ?? project.url} tone="dark" external>
              Open live site <span aria-hidden="true">↗</span>
            </Button>
            <Link href="/#work" className="link-draw font-mono text-mono uppercase tracking-mono">
              Back to the auditorium
            </Link>
          </div>

          <div className="border-t border-rule-inv pt-10">
            <MonoLabel className="text-chalk-mute">NEXT BUILD</MonoLabel>
            <Link
              href={`/work/${next.slug}`}
              data-transition="horizontal"
              className="group mt-4 inline-block"
            >
              <span className="block font-display text-h2 uppercase leading-display tracking-display transition-colors group-hover:text-signal">
                {next.client}
              </span>
              <MonoLabel as="span" className="mt-3 block text-chalk-mute">
                {next.sector} · {next.year} <span aria-hidden="true">→</span>
              </MonoLabel>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
