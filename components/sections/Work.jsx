import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";
import { getProjects } from "@/lib/content";

/**
 * Selected Work, static state: alternating asymmetric poster grid with proto
 * label plates, and the scannable index table beneath — the fast path for
 * scanners and crawlers. The pinned Live Rig replaces the grid in Phase 3;
 * the table stays. PRD §5.4 · §3.6 attribution per §2.2.1
 */
export default async function Work() {
  const projects = await getProjects();

  return (
    <section id="work" className="bg-concrete py-section-half">
      <div className="container space-y-20">
        <div className="space-y-10">
          <SectionHeader index="02" label="SELECTED WORK" meta="11 BUILDS · ALL LIVE" />
          <RevealText as="h2" text="Live work, running right now." className="max-w-[13ch] text-display" />
        </div>

        <ol className="grid grid-cols-1 gap-y-24 lg:grid-cols-12 lg:gap-x-6">
          {projects.map((p, i) => {
            const wide = i % 2 === 0;
            return (
              <li
                key={p.slug}
                className={
                  wide
                    ? "lg:col-span-7 lg:col-start-1"
                    : "lg:col-span-5 lg:col-start-8 lg:mt-32"
                }
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="OPEN ↗"
                  className="group block space-y-4"
                >
                  <div className="relative aspect-[1440/900] overflow-hidden border border-rule bg-machine-2">
                    <Image
                      src={p.poster}
                      alt={`${p.client} — ${p.sector} website`}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pt-3">
                    <MonoLabel>
                      <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
                      <span className="ml-3">
                        {p.client} — {p.sector}
                      </span>
                    </MonoLabel>
                    <MonoLabel className="text-ink-mute">
                      {p.year} · OPEN <span aria-hidden="true">↗</span>
                    </MonoLabel>
                  </div>
                  <MonoLabel className="text-ink-mute">
                    {p.type === "internal"
                      ? "INTERNAL · PKG IT"
                      : "CLIENT · DELIVERED AT PKG IT"}
                  </MonoLabel>
                </a>
              </li>
            );
          })}
        </ol>

        <div className="space-y-8">
          <MonoLabel className="text-ink-mute">PROJECT INDEX — ALL 11</MonoLabel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-t border-rule text-left">
              <thead>
                <tr className="border-b border-rule">
                  {["NO", "CLIENT", "SECTOR", "YEAR", "LINK"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="py-3 pr-6 font-mono text-mono font-normal uppercase tracking-mono text-ink-mute"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.slug} className="border-b border-rule">
                    <td className="py-4 pr-6 font-mono text-mono uppercase tracking-mono text-signal-dim">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="py-4 pr-6 font-medium">{p.client}</td>
                    <td className="py-4 pr-6 text-ink-mute">{p.sector}</td>
                    <td className="py-4 pr-6 font-mono text-mono uppercase tracking-mono text-ink-mute">
                      {p.year}
                    </td>
                    <td className="py-4">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-mono uppercase tracking-mono underline decoration-1 underline-offset-4 transition-colors hover:decoration-signal"
                      >
                        OPEN <span aria-hidden="true">↗</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
