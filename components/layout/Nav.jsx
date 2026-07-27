"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Monogram from "@/components/ui/Monogram";
import Button from "@/components/ui/Button";
import MagneticWrap from "@/components/ui/MagneticWrap";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";

/**
 * Thin top bar, transparent over the hero. Past ~85% of a viewport it
 * condenses into a floating pill — top-right on desktop, bottom-centre on
 * mobile — and the active section is marked with a signal dot, tracked by
 * ScrollTrigger. Reduced motion gets the same pill with no animation: nav
 * access after scrolling is function, not decoration. PRD §5.1
 */
const LINKS = [
  ["Work", "/#work", "work"],
  ["About", "/#about", "about"],
  ["Contact", "/#contact", "contact"],
];

export default function Nav() {
  const rootRef = useRef(null);
  const pillRef = useRef(null);
  const [active, setActive] = useState(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { reduceMotion } = ctx.conditions;
        const pill = pillRef.current;
        gsap.set(pill, { autoAlpha: 0, y: reduceMotion ? 0 : 12 });

        let shown = false;
        const toggle = (past) => {
          shown = past;
          if (reduceMotion) {
            gsap.set(pill, { autoAlpha: past ? 1 : 0 });
          } else if (past) {
            gsap.to(pill, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" });
          } else {
            gsap.to(pill, { autoAlpha: 0, y: 12, duration: 0.3, ease: "power2.in" });
          }
        };

        // sections exist on the home page only; rect-based tracking survives
        // the Work pin's spacer without any refresh bookkeeping
        const sections = LINKS.map(([, , id]) => [id, document.getElementById(id)]).filter(
          ([, el]) => el
        );
        let current = null;

        const showST = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const past = self.scroll() > window.innerHeight * 0.85;
            if (past !== shown) toggle(past);

            const line = window.innerHeight * 0.55;
            let next = null;
            for (const [id, el] of sections) {
              if (el.getBoundingClientRect().top < line) next = id;
            }
            if (next !== current) {
              current = next;
              setActive(next);
            }
          },
        });

        return () => showST.kill();
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <header id="top" className="absolute inset-x-0 top-0 z-50 text-chalk">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-[200] focus:bg-machine focus:px-4 focus:py-2 focus:font-mono focus:text-mono focus:uppercase focus:tracking-mono"
        >
          Skip to content
        </a>
        <div className="container flex items-center justify-between py-6">
          <a href="#top" aria-label="Amartya Baul — top of page" className="block">
            <Monogram framed={false} className="h-11 w-11" />
          </a>
          <nav aria-label="Primary" className="flex items-center gap-10">
            <ul className="hidden items-center gap-8 md:flex">
              {LINKS.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="link-draw font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <MagneticWrap>
              <Button href="/#contact" tone="dark" pill>
                Get in touch
              </Button>
            </MagneticWrap>
          </nav>
        </div>
      </header>

      {/* condensed floating pill — §3.3 permits the shadow here */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[110] -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-[var(--page-margin)] lg:top-5 lg:translate-x-0">
        <nav
          ref={pillRef}
          aria-label="Condensed"
          className="pointer-events-auto flex items-center gap-4 rounded-full border border-rule-inv bg-machine py-2 pl-4 pr-2 text-chalk opacity-0 shadow-lg shadow-black/25"
        >
          <Link href="/#top" aria-label="Amartya Baul — top of page" className="block">
            <Monogram framed={false} className="h-5 w-5" />
          </Link>
          <ul className="flex items-center gap-4">
            {LINKS.map(([label, href, id]) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-1.5 font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1 w-1 rounded-full ${active === id ? "bg-signal" : "bg-transparent"}`}
                  />
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/#contact"
            className="rounded-full bg-chalk px-4 py-1.5 font-body text-small font-medium text-ink transition-colors hover:bg-concrete-2"
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </div>
  );
}
