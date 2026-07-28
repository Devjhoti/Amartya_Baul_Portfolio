import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";
import CapabilityOrbit from "@/components/capabilities/CapabilityOrbit";
import { getCapabilities, getProjects } from "@/lib/content";

/**
 * Capabilities as the capability orbit (client direction): four systems on
 * the bottom-centre indicators, each a floating CSS-3D sphere of its tech
 * marks, with a readable mirror column and honest per-tech usage counts
 * pulled from the project stacks — never invented.
 *
 * The spec table remains the ground truth: it is what mobile, reduced motion
 * and no-JS render (and what crawlers read). Desktop with motion sees the
 * orbit instead — the swap is pure CSS (lg + motion-safe), no gate flash.
 * PRD §5.7 (revised)
 */
export default async function Capabilities() {
  const [capabilities, projects] = await Promise.all([
    getCapabilities(),
    getProjects(),
  ]);
  const total = capabilities.reduce((n, g) => n + g.items.length, 0);

  // How many of the 11 shipped builds actually carry each item — exact stack
  // matches only, 0 means the plate simply shows no number.
  const groups = capabilities.map((g) => ({
    group: g.group,
    items: g.items.map((name) => ({
      name,
      count: projects.filter((p) => p.stack.includes(name)).length,
    })),
  }));

  return (
    <section className="py-section-half text-chalk">
      <div className="container space-y-14">
        <div className="space-y-10">
          <SectionHeader
            tone="dark"
            index="04"
            label="CAPABILITIES"
            meta={`4 SYSTEMS · ${total} ITEMS`}
          />
          <RevealText as="h2" text="What the work runs on." className="max-w-[14ch] text-h2" />
        </div>

        {/* the orbit — desktop with motion only */}
        <div className="hidden lg:motion-safe:block">
          <CapabilityOrbit groups={groups} />
        </div>

        {/* the spec table — mobile, reduced motion, no-JS, and the crawlers */}
        <ul className="group/table border-t border-rule-inv lg:motion-safe:hidden">
          {groups.map((row) => (
            <li
              key={row.group}
              className="grid grid-cols-1 gap-y-3 border-b border-rule-inv py-9 transition-opacity hover:!opacity-100 group-hover/table:opacity-40 lg:grid-cols-12 lg:gap-x-6"
            >
              <MonoLabel className="text-chalk-mute lg:col-span-3">{row.group}</MonoLabel>
              <p className="flex flex-wrap gap-x-8 gap-y-2 lg:col-span-9">
                {row.items.map((item) => (
                  <span key={item.name} className="text-h3 font-medium">
                    {item.name}
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
