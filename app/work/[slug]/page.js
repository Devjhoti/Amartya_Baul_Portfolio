import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import MonoLabel from "@/components/ui/MonoLabel";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import CaseEmbed from "@/components/work/CaseEmbed";
import { getProjects, getProject, getAgency } from "@/lib/content";

/**
 * Case study — PRD §5.5. Order: hero (client, sector, year) → meta table →
 * full-width live embed reusing LiveRig → Challenge → Approach → Outcome →
 * Open live site → next project. Challenge/approach/outcome render only once
 * Phase 6 writes them from the real sites — nothing is invented to fill the
 * gap. Statically generated for all 11 slugs.
 */

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.client} — Case Study · Amartya Baul`,
    description: `${project.client}: a production website for the ${project.sector.toLowerCase()} sector, designed and built at PKG IT. Live, running, and embedded on this page.`,
  };
}

function MetaRow({ label, children }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 border-b border-rule py-4">
      <MonoLabel as="dt" className="col-span-4 text-ink-mute sm:col-span-3">
        {label}
      </MonoLabel>
      <dd className="col-span-8 font-body text-body sm:col-span-9">{children}</dd>
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

  return (
    <>
      <Nav />
      <main id="content">
        {/* hero — client, sector, year. PRD §5.5 */}
        <header className="bg-machine pb-16 pt-32 text-chalk">
          <div className="container space-y-10">
            <div className="flex items-baseline justify-between gap-6 border-t border-rule-inv pt-4">
              <MonoLabel>
                <span className="text-signal">[ {no} ]</span>
                <span className="ml-3">CASE STUDY</span>
              </MonoLabel>
              <MonoLabel className="text-chalk-mute">BUILD {no} / {String(projects.length).padStart(2, "0")}</MonoLabel>
            </div>
            <div className="grid grid-cols-1 items-end gap-y-6 lg:grid-cols-12 lg:gap-x-6">
              <RevealText
                as="h1"
                text={project.client}
                className="text-display lg:col-span-8"
              />
              <MonoLabel className="text-chalk-mute lg:col-span-4 lg:justify-self-end">
                {project.sector} · {project.year}
              </MonoLabel>
            </div>
          </div>
        </header>

        <div className="bg-concrete py-section-half">
          <div className="container space-y-20">
            {/* meta table — row order per PRD §5.5 */}
            <dl className="border-t border-rule lg:max-w-[70%]">
              <MetaRow label="SECTOR">{project.sector}</MetaRow>
              <MetaRow label="ROLE">{project.role}</MetaRow>
              <MetaRow label="AGENCY">
                <span className="flex items-center gap-3">
                  {agency.name}
                  <span className="relative inline-block h-5 w-16">
                    <Image
                      src={agency.logo}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain object-left opacity-70 brightness-0"
                    />
                  </span>
                </span>
              </MetaRow>
              <MetaRow label="STACK">{project.stack.join(" · ")}</MetaRow>
              <MetaRow label="YEAR">{project.year}</MetaRow>
              {project.duration ? <MetaRow label="DURATION">{project.duration}</MetaRow> : null}
              <MetaRow label="TYPE">
                {project.type === "internal" ? "Internal — PKG IT's own site" : "Client work, delivered at PKG IT"}
              </MetaRow>
            </dl>

            {/* full-width live embed, same rig, same rules. PRD §5.5 · §6 */}
            <CaseEmbed project={project} />

            {copyBlocks.map((block, i) => (
              <section key={block.key} className="grid grid-cols-1 gap-y-4 border-t border-rule pt-6 lg:grid-cols-12 lg:gap-x-6">
                <MonoLabel as="h2" className="lg:col-span-3">
                  <span className="text-signal">[ {String(i + 1).padStart(2, "0")} ]</span>
                  <span className="ml-3">{block.label}</span>
                </MonoLabel>
                {block.key === "challenge" ? (
                  <p className="max-w-[58ch] text-body lg:col-span-8 lg:col-start-5">{block.body[0]}</p>
                ) : (
                  <ul className="max-w-[58ch] space-y-3 text-body lg:col-span-8 lg:col-start-5">
                    {block.body.map((item) => (
                      <li key={item} className="border-l border-rule pl-4">{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              <Button href={project.url} external>
                Open live site <span aria-hidden="true">↗</span>
              </Button>
            </div>

            {/* next project — horizontal wipe via the curtain. PRD §5.5 */}
            <div className="border-t border-rule pt-10">
              <MonoLabel className="text-ink-mute">NEXT BUILD</MonoLabel>
              <Link
                href={`/work/${next.slug}`}
                data-transition="horizontal"
                className="group mt-4 inline-block"
              >
                <span className="block font-display text-h2 leading-display tracking-display transition-colors group-hover:text-ink-mute">
                  {next.client}
                </span>
                <MonoLabel as="span" className="mt-3 block text-ink-mute">
                  {next.sector} · {next.year} <span aria-hidden="true">→</span>
                </MonoLabel>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
