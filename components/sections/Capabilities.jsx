import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import { getCapabilities } from "@/lib/content";

/**
 * A spec table, not a badge wall: four hairlined rows, mono system label left,
 * items wrapping right. Hovering a row lifts it and recedes the others (CSS
 * only — the staggered clip-path reveal is Phase 2). PRD §5.7
 */
export default async function Capabilities() {
  const capabilities = await getCapabilities();
  const total = capabilities.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="bg-concrete py-section-half">
      <div className="container space-y-14">
        <div className="space-y-10">
          <SectionHeader
            index="04"
            label="CAPABILITIES"
            meta={`4 SYSTEMS · ${total} ITEMS`}
          />
          <h2 className="max-w-[14ch] text-h2">What the work runs on.</h2>
        </div>

        <ul className="group/table border-t border-rule">
          {capabilities.map((row) => (
            <li
              key={row.group}
              className="grid grid-cols-1 gap-y-3 border-b border-rule py-9 transition-opacity hover:!opacity-100 group-hover/table:opacity-40 lg:grid-cols-12 lg:gap-x-6"
            >
              <MonoLabel className="text-ink-mute lg:col-span-3">{row.group}</MonoLabel>
              <p className="flex flex-wrap gap-x-8 gap-y-2 lg:col-span-9">
                {row.items.map((item) => (
                  <span key={item} className="text-h3 font-medium">
                    {item}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
