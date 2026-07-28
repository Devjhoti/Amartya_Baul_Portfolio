import HeroFallback from "@/components/webgl/HeroFallback";
import AtmosphereMount from "@/components/webgl/AtmosphereMount";

/**
 * The hero's smoke, promoted to the site's ground: one fixed viewport-sized
 * layer behind every section (client direction — the whole site rides the
 * atmosphere). Sections are transparent over it; anything with its own scene
 * (the tornado band, case-study plates) keeps an opaque ground and simply
 * covers it.
 *
 * Same two-deck build as the hero had: the procedural SVG enamel is the
 * always-on base — server-rendered, no-JS safe — and the WebGL shader mounts
 * over it only where AtmosphereMount's capability gate allows. Costs nothing
 * extra: it is the same single 30fps plane the hero ran, now simply never
 * scrolled away from.
 */
export default function SiteAtmosphere() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      <HeroFallback className="absolute inset-0 h-full w-full" />
      <AtmosphereMount />
    </div>
  );
}
