import MonoLabel from "@/components/ui/MonoLabel";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import MagneticWrap from "@/components/ui/MagneticWrap";
import HeroPortrait from "./HeroPortrait";
import { getProfile, getAssets } from "@/lib/content";

/**
 * The thesis, redesigned: compact headline column on the left (same character
 * reveals), the 3D portrait rig on the right — the cutout popping out of a
 * chassis-language backdrop with floating stat plates. Headline steps down
 * from the fs-hero token to a column-scale clamp so the left side reads as a
 * plate, not a poster. PRD §5.2 (layout revised on client direction)
 */
export default async function Hero() {
  const [profile, assets] = await Promise.all([getProfile(), getAssets()]);

  const stats = profile.stats.map((s) => ({
    value: `${s.value}${s.suffix}`,
    label: s.label,
  }));

  return (
    // transparent over the site-wide atmosphere — the smoke that used to live
    // here is now the fixed layer behind every section
    <section className="relative overflow-hidden text-chalk">
      <div className="container relative z-10 flex min-h-dvh flex-col">
        <div className="mt-24 flex items-baseline justify-between border-t border-rule-inv pt-4">
          <MonoLabel className="whitespace-nowrap">
            <span className="text-signal">[ 00 ]</span>
            <span className="ml-3">DHAKA, BD — 20+ BUILDS SHIPPED</span>
          </MonoLabel>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-x-6 gap-y-14 py-12 lg:grid-cols-12">
          <div className="space-y-9 lg:col-span-6">
            <h1 className="text-[clamp(2.25rem,4.4vw,4.25rem)] uppercase">
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
              className="max-w-[38ch] space-y-9"
            >
              <p className="text-body text-chalk-mute">{profile.intro}</p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
                <MagneticWrap>
                  <Button href="#contact" tone="dark">
                    Get in touch <span aria-hidden="true">→</span>
                  </Button>
                </MagneticWrap>
                <a href="#work" className="link-draw font-mono text-mono uppercase tracking-mono">
                  See the work
                </a>
              </div>
            </RevealText>
          </div>

          <div className="lg:col-span-6">
            <HeroPortrait
              photo={assets.portraitCutout}
              stats={stats}
              fact="LIVE SITES, NOT SCREENSHOTS"
            />
          </div>
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
