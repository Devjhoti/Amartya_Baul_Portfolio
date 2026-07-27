import Monogram from "@/components/ui/Monogram";
import Button from "@/components/ui/Button";
import MagneticWrap from "@/components/ui/MagneticWrap";

/**
 * Thin top bar, transparent over the dark hero. The scroll-condensing floating
 * pill and active-section tracking arrive with the motion core in Phase 2 —
 * this is the static state. PRD §5.1
 */
export default function Nav() {
  return (
    <header id="top" className="absolute inset-x-0 top-0 z-50 text-chalk">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-[200] focus:bg-machine focus:px-4 focus:py-2 focus:font-mono focus:text-mono focus:uppercase focus:tracking-mono"
      >
        Skip to content
      </a>
      <div className="container flex items-center justify-between py-6">
        <a href="#top" aria-label="Amartya Baul — top of page" className="block">
          <Monogram framed={false} className="h-8 w-8" />
        </a>
        <nav aria-label="Primary" className="flex items-center gap-10">
          <ul className="hidden items-center gap-8 md:flex">
            {[
              ["Work", "#work"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <MagneticWrap>
            <Button href="#contact" tone="dark" pill>
              Get in touch
            </Button>
          </MagneticWrap>
        </nav>
      </div>
    </header>
  );
}
