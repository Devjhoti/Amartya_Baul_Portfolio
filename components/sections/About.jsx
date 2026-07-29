import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";
import Counter from "@/components/ui/Counter";
import PortraitUnmask from "@/components/ui/PortraitUnmask";
import { getProfile, getAssets } from "@/lib/content";

/**
 * Two asymmetric columns: duotoned portrait left (machine ground + luminosity
 * blend — the cursor-following colour unmask is Phase 4), bio and stat
 * counters right. Bio names PKG IT in exactly one sentence. PRD §5.6
 */
export default async function About() {
  const [profile, assets] = await Promise.all([getProfile(), getAssets()]);

  return (
    <section id="about" className="py-section-half text-chalk">
      <div className="container space-y-16">
        <SectionHeader tone="dark" index="03" label="ABOUT" meta="DHAKA, BANGLADESH · GMT+6" />

        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
          <RevealText as="div" variant="slide-left" className="lg:col-span-5">
            <PortraitUnmask
              src={assets.profile}
              alt="Amartya Baul"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            {/* the plate under the portrait: the name carries, the role
                answers it in signal */}
            <div className="mt-4">
              <p className="font-display text-h3 uppercase leading-display tracking-display text-chalk">
                {profile.name}
              </p>
              <MonoLabel className="mt-2 text-signal">{profile.role}</MonoLabel>
            </div>
          </RevealText>

          <RevealText
            as="div"
            variant="slide-right"
            className="flex flex-col justify-between gap-14 lg:col-span-6 lg:col-start-7"
          >
            <div className="space-y-7">
              <RevealText
                as="h2"
                text="Two years, eleven industries, one standard."
                className="max-w-[16ch] text-h2"
              />
              {profile.bio.map((paragraph) => (
                <p key={paragraph} className="max-w-[54ch] text-body">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="grid grid-cols-3 gap-x-6 border-t border-rule-inv pt-8">
              {profile.stats.map((s) => (
                <li key={s.label}>
                  {/* client direction: stat figures in the hero's signal yellow */}
                  <p className="font-display text-h2 leading-display tracking-display text-signal">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <MonoLabel className="mt-3 text-chalk-mute">{s.label}</MonoLabel>
                </li>
              ))}
            </ul>
          </RevealText>
        </div>
      </div>
    </section>
  );
}
