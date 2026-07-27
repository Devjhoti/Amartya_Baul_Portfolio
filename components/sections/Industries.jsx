import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import SectorChip from "@/components/ui/SectorChip";
import { getProjects } from "@/lib/content";

/**
 * The materials sample board: 11 hairlined cells with the procedural sector
 * chips at 88px, no gaps — a continuous specimen sheet. Hover desaturates the
 * chip and flags the label in signal (CSS only; sector filtering of the
 * project index arrives in Phase 3). PRD §5.8 · §2.7
 */
export default async function Industries() {
  const projects = await getProjects();
  const counts = projects.reduce((acc, p) => {
    acc[p.sector] = (acc[p.sector] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="bg-concrete-2 py-section-half">
      <div className="container space-y-14">
        <SectionHeader
          index="05"
          label="INDUSTRIES SERVED"
          meta="11 SECTORS"
          headingAs="h2"
        />

        <ul className="grid grid-cols-2 border-l border-t border-rule md:grid-cols-3 lg:grid-cols-5">
          {projects.map((p) => {
            const n = counts[p.sector];
            return (
              <li
                key={p.slug}
                className="group flex flex-col gap-6 border-b border-r border-rule p-6"
              >
                <SectorChip
                  sector={p.chip}
                  size={88}
                  label={`${p.sector} material sample`}
                  className="transition-[filter] group-hover:grayscale"
                />
                <div>
                  <MonoLabel className="transition-colors group-hover:text-signal">
                    {p.sector}
                  </MonoLabel>
                  <p className="mt-1 text-small text-ink-mute">
                    {n} build{n > 1 ? "s" : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
