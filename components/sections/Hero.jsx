import HeroFallback from "@/components/webgl/HeroFallback";
import MonoLabel from "@/components/ui/MonoLabel";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import MagneticWrap from "@/components/ui/MagneticWrap";
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
          <MonoLabel className="whitespace-nowrap">
            <span className="text-signal">[ 00 ]</span>
            <span className="ml-3">DHAKA, BD — 20+ BUILDS SHIPPED</span>
          </MonoLabel>
        </div>

        <div className="grid flex-1 grid-cols-1 items-end gap-x-6 gap-y-14 py-16 lg:grid-cols-12">
          <h1 className="text-hero uppercase lg:col-span-8">
            {profile.headline.map((line, i) => (
              <RevealText
                key={line}
                as="span"
                mode="load"
                lineIndex={i}
                text={line}
                className={`block whitespace-nowrap ${
                  i === profile.headlineAccentLine ? "text-signal" : ""
                }`}
              />
            ))}
          </h1>

          <RevealText
            as="div"
            variant="fade"
            mode="load"
            lineIndex={4}
            className="max-w-[36ch] space-y-9 lg:col-span-4 lg:justify-self-end lg:pb-2"
          >
            <p className="text-body text-chalk-mute">{profile.intro}</p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              <MagneticWrap>
                <Button href="#contact" tone="dark">
                  Get in touch <span aria-hidden="true">→</span>
                </Button>
              </MagneticWrap>
              <a
                href="#work"
                className="font-mono text-mono uppercase tracking-mono underline decoration-1 underline-offset-8 transition-colors hover:decoration-signal"
              >
                See the work
              </a>
            </div>
          </RevealText>
        </div>

        {/* Labels stack below lg and never wrap — line counts must be identical
            in the fallback and real mono, or the swap shifts the whole hero. */}
        <div className="flex flex-col items-start gap-2 border-t border-rule-inv pb-6 pt-4 lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
          <MonoLabel className="whitespace-nowrap text-chalk-mute">
            AMARTYA BAUL — FULL-STACK DEVELOPER
          </MonoLabel>
          <MonoLabel className="whitespace-nowrap text-chalk-mute">[ SCROLL ↓ ]</MonoLabel>
        </div>
      </div>
    </section>
  );
}
