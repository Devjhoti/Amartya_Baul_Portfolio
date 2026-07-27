"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import SplitText from "@/components/ui/SplitText";
import { REVEAL_EVENT } from "@/components/ui/RevealText";

/**
 * Full-screen machine panel: mono counter 000→100 bottom-left, the name
 * mask-revealing line by line centre-left, then an upward clip-path wipe.
 * The hero reveal event fires at 60% of the wipe. 2.2s max on desktop, 1.2s
 * simplified on mobile, once per session (repeat visits get a 400ms fade),
 * skipped entirely under reduced motion, and it never traps focus — there is
 * nothing focusable inside and the node unmounts when done. PRD §5.0 · §7.3
 */

const SEEN_KEY = "ab-preloader-seen";

const wasSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};
const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode — preloader will simply run again next load */
  }
};

const fireReveal = () => {
  window.__abRevealed = true;
  window.dispatchEvent(new Event(REVEAL_EVENT));
};

export default function Preloader() {
  const ref = useRef(null);
  const counterRef = useRef(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isMobile, reduceMotion } = ctx.conditions;
        const panel = ref.current;
        if (!panel) return;

        // Skipped entirely: the panel is already display:none via
        // motion-reduce:hidden — just release the hero immediately.
        if (reduceMotion) {
          fireReveal();
          setDone(true);
          return;
        }

        if (wasSeen()) {
          fireReveal();
          gsap.to(panel, {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => setDone(true),
          });
          return;
        }

        // §5.0 timing — 1.1 + 0.2 + 0.9 = 2.2s desktop; simplified 1.2s mobile.
        const t = isMobile
          ? { count: 0.6, hold: 0.1, wipe: 0.5 }
          : { count: 1.1, hold: 0.2, wipe: 0.9 };

        const chars = panel.querySelectorAll(".st-char");
        const obj = { v: 0 };

        gsap.set(chars, { yPercent: 110, willChange: "transform" });
        gsap.set(panel.querySelectorAll("[data-st-hide]"), { visibility: "visible" });

        const tl = gsap.timeline({
          onComplete: () => {
            markSeen();
            setDone(true);
          },
        });

        tl.to(
          obj,
          {
            v: 100,
            duration: t.count,
            ease: "none",
            onUpdate: () => {
              counterRef.current.textContent = String(Math.round(obj.v)).padStart(3, "0");
            },
          },
          0
        );
        // The name reveals only once the display font is really in — revealing
        // fallback glyphs and swapping them mid-panel is a measurable layout
        // shift. On slow connections the counter carries the panel alone.
        const fontsReady = document.fonts?.ready ?? Promise.resolve();
        fontsReady.then(() => {
          if (!panel.isConnected) return;
          gsap.to(chars, {
            yPercent: 0,
            duration: 0.8,
            ease: EASE.out,
            stagger: 0.03,
            onComplete: () => gsap.set(chars, { clearProps: "willChange" }),
          });
        });
        tl.to({}, { duration: t.hold }, t.count);
        tl.set(panel, { willChange: "clip-path" });
        tl.to(panel, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: t.wipe,
          ease: EASE.inOut,
        });
        // Hero begins at 60% of the wipe. PRD §5.0
        tl.call(fireReveal, null, `-=${t.wipe * 0.4}`);
      });
    },
    { scope: ref }
  );

  if (done) return null;

  return (
    <div
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className="ab-preloader fixed inset-0 z-[150] flex flex-col justify-center bg-machine px-[var(--page-margin)] text-chalk motion-reduce:hidden"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <noscript>
        <style>{`.ab-preloader{display:none}`}</style>
      </noscript>

      <div>
        <SplitText
          text="AMARTYA"
          as="p"
          data-st-hide=""
          className="block font-display text-display uppercase leading-display tracking-display"
        />
        <SplitText
          text="BAUL"
          as="p"
          data-st-hide=""
          className="block font-display text-display uppercase leading-display tracking-display"
        />
      </div>

      <p
        ref={counterRef}
        className="absolute bottom-8 left-[var(--page-margin)] font-mono text-mono tracking-mono text-chalk-mute"
      >
        000
      </p>
    </div>
  );
}
