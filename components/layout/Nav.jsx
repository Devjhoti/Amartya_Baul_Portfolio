"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Monogram from "@/components/ui/Monogram";
import Button from "@/components/ui/Button";
import MagneticWrap from "@/components/ui/MagneticWrap";
import PaletteTrigger from "@/components/ui/PaletteTrigger";
import SoundToggle from "@/components/ui/SoundToggle";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";

/**
 * Thin top bar, transparent over the hero. Past ~85% of a viewport it
 * condenses — and the two screens get different furniture, because one pill
 * could not serve both: at 390px the desktop pill held a monogram, three
 * links and a button, and the button's label broke across three lines.
 *
 * Desktop keeps that pill, top-right. A phone gets a dock instead: a glass
 * bar across the foot of the screen, monogram to return, two destinations,
 * and Contact filled in chalk so the call to action is the widest thing on
 * it. Contact appears once, not twice — the old pill listed it as a link AND
 * as "Get in touch", both pointing at the same anchor.
 *
 * The active section is marked with a signal dot, tracked by ScrollTrigger.
 * Reduced motion gets the same furniture with no animation: nav access after
 * scrolling is function, not decoration. PRD §5.1
 */
const LINKS = [
  ["Work", "/#work", "work"],
  ["About", "/#about", "about"],
  ["Contact", "/#contact", "contact"],
];

// the dock spells Contact as its filled action, so it is not also a link
const DOCK_LINKS = LINKS.filter(([, , id]) => id !== "contact");

export default function Nav() {
  const rootRef = useRef(null);
  const pillRef = useRef(null);
  const [active, setActive] = useState(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { reduceMotion } = ctx.conditions;
        // one show/hide drives both the desktop pill and the phone dock; only
        // one of the two is ever rendered at a given width
        const condensed = gsap.utils.toArray("[data-condensed]", rootRef.current);
        gsap.set(condensed, { autoAlpha: 0, y: reduceMotion ? 0 : 12 });

        let shown = false;
        const toggle = (past) => {
          shown = past;
          if (reduceMotion) {
            gsap.set(condensed, { autoAlpha: past ? 1 : 0 });
          } else if (past) {
            gsap.to(condensed, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" });
          } else {
            gsap.to(condensed, { autoAlpha: 0, y: 12, duration: 0.3, ease: "power2.in" });
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
          <nav aria-label="Primary" className="flex items-center gap-4 md:gap-8">
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
            <div className="flex items-center gap-1">
              <SoundToggle />
              <PaletteTrigger variant="bar" />
            </div>
            <MagneticWrap>
              <Button href="/#contact" tone="dark" pill>
                Get in touch
              </Button>
            </MagneticWrap>
          </nav>
        </div>
      </header>

      {/* condensed pill, desktop — §3.3 permits the shadow here */}
      <div className="pointer-events-none fixed right-[var(--page-margin)] top-5 z-[110] hidden lg:block">
        <nav
          ref={pillRef}
          data-condensed=""
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
          <SoundToggle className="!h-7 !w-7" />
          <PaletteTrigger variant="pill" />
          <Link
            href="/#contact"
            className="rounded-full bg-chalk px-4 py-1.5 font-body text-small font-medium text-ink transition-colors hover:bg-concrete-2"
          >
            Get in touch
          </Link>
        </nav>
      </div>

      {/* the phone's dock: glass across the foot, the action filled and widest,
          clear of the home indicator */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] px-[var(--page-margin)] pb-[max(0.9rem,env(safe-area-inset-bottom))] lg:hidden">
        <nav
          data-condensed=""
          aria-label="Condensed"
          // No backdrop blur here, and the background is opaque enough not to
          // need one. A blurred fixed bar has to resample everything sliding
          // underneath it on every scroll frame, and this bar is on screen for
          // the entire scroll — it is the most expensive pixel on a phone and
          // the one nobody is looking at. The desktop pill, which is over a
          // still page most of the time, keeps its material.
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-[rgba(24,29,26,0.96)] p-1.5 text-chalk opacity-0"
          style={{
            boxShadow:
              "0 18px 40px -18px rgba(0,0,0,0.85), inset 1px 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* no monogram here: at 320px it was the difference between the
              dock sitting inside its margins and hanging over them, and the
              top bar already carries the mark. The palette takes that slot
              instead, and stands down at the same width for the same reason. */}
          <PaletteTrigger variant="dock" />
          {DOCK_LINKS.map(([label, href, id]) => (
            <a
              key={href}
              href={href}
              aria-current={active === id ? "true" : undefined}
              className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full font-mono text-mono uppercase tracking-mono transition-colors ${
                active === id ? "bg-white/[0.06] text-chalk" : "text-chalk-mute"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1 w-1 rounded-full ${
                  active === id ? "bg-signal" : "bg-transparent"
                }`}
              />
              {label}
            </a>
          ))}

          <Link
            href="/#contact"
            aria-current={active === "contact" ? "true" : undefined}
            className="flex h-11 shrink-0 items-center rounded-full bg-chalk px-4 font-mono text-mono uppercase tracking-mono text-ink transition-colors active:bg-concrete-2 min-[400px]:px-5"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
