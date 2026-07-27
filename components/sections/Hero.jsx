import HeroFallback from "@/components/webgl/HeroFallback";
import MonoLabel from "@/components/ui/MonoLabel";
import Button from "@/components/ui/Button";
import { getProfile } from "@/lib/content";

/**
 * The thesis. Dark machine ground with the procedural atmosphere behind the
 * type (the WebGL plane replaces it on capable desktops in Phase 4), four
 * stacked display lines with the single signal word, intro and CTAs hung
 * bottom-right in the whitespace the short lines leave. PRD §5.2
 */
export default async function Hero() {
  const profile = await getProfile();

  return (
    <section className="relative overflow-hidden bg-machine text-chalk">
      <HeroFallback className="absolute inset-0 h-full w-full" />

      <div className="container relative z-10 flex min-h-dvh flex-col">
        <div className="mt-24 flex items-baseline justify-between border-t border-rule-inv pt-4">
          <MonoLabel>
            <span className="text-signal">[ 00 ]</span>
            <span className="ml-3">DHAKA, BD — 20+ BUILDS SHIPPED</span>
          </MonoLabel>
        </div>

        <div className="grid flex-1 grid-cols-1 items-end gap-x-6 gap-y-14 py-16 lg:grid-cols-12">
          <h1 className="text-hero uppercase lg:col-span-8">
            {profile.headline.map((line, i) => (
              <span
                key={line}
                className={`block ${i === profile.headlineAccentLine ? "text-signal" : ""}`}
              >
                {line}
              </span>
            ))}
          </h1>

          <div className="max-w-[36ch] space-y-9 lg:col-span-4 lg:justify-self-end lg:pb-2">
            <p className="text-body text-chalk-mute">{profile.intro}</p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              <Button href="#contact" tone="dark">
                Get in touch <span aria-hidden="true">→</span>
              </Button>
              <a
                href="#work"
                className="font-mono text-mono uppercase tracking-mono underline decoration-1 underline-offset-8 transition-colors hover:decoration-signal"
              >
                See the work
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-6 border-t border-rule-inv pb-6 pt-4">
          <MonoLabel className="text-chalk-mute">
            AMARTYA BAUL — FULL-STACK DEVELOPER
          </MonoLabel>
          <MonoLabel className="text-chalk-mute">[ SCROLL ↓ ]</MonoLabel>
        </div>
      </div>
    </section>
  );
}
