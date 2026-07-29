import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";
import TechIcon from "@/components/ui/TechIcon";
import CapabilityOrbit from "@/components/capabilities/CapabilityOrbit";
import { markSrc } from "@/components/ui/techMark";
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

        {/* The same four systems for phones, reduced motion, no-JS and the
            crawlers — the sphere's marks laid flat. Every group is open: on a
            small screen hiding three quarters of the answer behind tabs costs
            more than the scroll it saves. */}
        <div className="space-y-10 lg:motion-safe:hidden">
          {groups.map((row, i) => (
            <section key={row.group}>
              <div className="flex items-baseline justify-between gap-4 border-t border-rule-inv pt-4">
                <MonoLabel>
                  <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ml-3">{row.group.toUpperCase()}</span>
                </MonoLabel>
                <MonoLabel className="text-chalk-mute">
                  {String(row.items.length).padStart(2, "0")} ITEMS
                </MonoLabel>
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                {row.items.map((item) => {
                  const mark = markSrc(item.name);
                  return (
                    <li key={item.name} className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[rgba(223,225,219,0.95)]">
                        {mark ? (
                          <Image
                            src={mark}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 object-contain"
                          />
                        ) : (
                          <TechIcon name={item.name} className="h-5 w-5 text-ink" />
                        )}
                      </span>
                      <span className="min-w-0">
                        {/* wraps rather than truncates — "TAILWIND C…" tells
                            the reader nothing they did not already know */}
                        <span className="block font-mono text-[0.82rem] uppercase leading-tight tracking-[0.06em] text-chalk">
                          {item.name}
                        </span>
                        {item.count > 0 ? (
                          <span className="block font-mono text-[0.62rem] uppercase tracking-mono text-chalk-mute">
                            {item.count}/11 BUILDS
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
