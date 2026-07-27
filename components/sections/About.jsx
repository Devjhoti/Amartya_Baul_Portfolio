import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import { getProfile, getAssets } from "@/lib/content";

/**
 * Two asymmetric columns: duotoned portrait left (machine ground + luminosity
 * blend — the cursor-following colour unmask is Phase 4), bio and stat
 * counters right. Bio names PKG IT in exactly one sentence. PRD §5.6
 */
export default async function About() {
  const [profile, assets] = await Promise.all([getProfile(), getAssets()]);

  return (
    <section id="about" className="bg-concrete py-section-half">
      <div className="container space-y-16">
        <SectionHeader index="03" label="ABOUT" meta="DHAKA, BANGLADESH · GMT+6" />

        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-machine">
              <Image
                src={assets.profile}
                alt="Amartya Baul"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover grayscale mix-blend-luminosity"
              />
            </div>
            <MonoLabel className="mt-3 text-ink-mute">
              AMARTYA BAUL — FULL-STACK DEVELOPER
            </MonoLabel>
          </div>

          <div className="flex flex-col justify-between gap-14 lg:col-span-6 lg:col-start-7">
            <div className="space-y-7">
              <h2 className="max-w-[16ch] text-h2">
                Two years, eleven industries, one standard.
              </h2>
              {profile.bio.map((paragraph) => (
                <p key={paragraph} className="max-w-[54ch] text-body">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="grid grid-cols-3 gap-x-6 border-t border-rule pt-8">
              {profile.stats.map((s) => (
                <li key={s.label}>
                  <p className="font-display text-h2 leading-display tracking-display">
                    {s.value}
                    {s.suffix}
                  </p>
                  <MonoLabel className="mt-3 text-ink-mute">{s.label}</MonoLabel>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
