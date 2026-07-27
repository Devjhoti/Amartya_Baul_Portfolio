import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import { getProjects, getAgency } from "@/lib/content";

/**
 * Trusted By — the only social-proof element and the only logo marquee on the
 * site. Static logo wall in this phase; the two counter-rotating velocity-
 * reactive rows arrive in Phase 4. All 11 logos silhouetted to one treatment,
 * PKG IT once at the end behind a signal divider, captioned AGENCY. PRD §5.3
 */
export default async function Marquee() {
  const [projects, agency] = await Promise.all([getProjects(), getAgency()]);

  return (
    <section className="bg-machine pb-28 pt-10 text-chalk">
      <div className="container space-y-14">
        <SectionHeader
          tone="dark"
          index="01"
          label="TRUSTED BY"
          meta="11 BRANDS · DELIVERED AT PKG IT"
          headingAs="h2"
        />

        <ul className="flex flex-wrap items-start gap-x-16 gap-y-12">
          {projects.map((p) => (
            <li key={p.slug} className="group relative">
              <div className="relative h-8 w-28">
                <Image
                  src={p.logo}
                  alt={`${p.client} logo`}
                  fill
                  sizes="112px"
                  className="object-contain opacity-55 brightness-0 invert transition-opacity group-hover:opacity-100"
                />
              </div>
              <MonoLabel className="pointer-events-none absolute left-0 top-full mt-3 whitespace-nowrap text-chalk-mute opacity-0 transition-opacity group-hover:opacity-100">
                {p.client}
              </MonoLabel>
            </li>
          ))}

          <li aria-hidden="true" className="h-8 w-px self-center bg-signal" />

          <li className="group relative">
            <div className="relative h-8 w-28">
              <Image
                src={agency.logo}
                alt={`${agency.name} logo`}
                fill
                sizes="112px"
                className="object-contain opacity-55 brightness-0 invert transition-opacity group-hover:opacity-100"
              />
            </div>
            <MonoLabel className="mt-3 text-chalk-mute">{agency.caption}</MonoLabel>
          </li>
        </ul>
      </div>
    </section>
  );
}
