"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";

/**
 * Two gauges, desktop only (PRD §7.3): a 2px signal progress line across the
 * very top (scaleX, scrubbed — a meter, not a fill), and a bottom-left mono
 * readout of the current section plate, fed by the data-plate-* attributes
 * SectionHeader stamps on every plate. Hidden under reduced motion and on
 * mobile; pages without plates (case studies) get the line only.
 */
export default function ScrollProgress() {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const readoutRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (!isDesktop || reduceMotion) return;

        const bar = barRef.current;
        const readout = readoutRef.current;
        gsap.set(bar, { scaleX: 0, transformOrigin: "0 50%", autoAlpha: 1 });

        const progress = gsap.to(bar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        });

        // rect-based plate tracking on the same update stream as the gauge —
        // element-triggered STs on 1-line-tall plates have degenerate spans.
        // document-level query: useGSAP's scope would confine a string selector
        // to this component's own (plateless) subtree.
        const plates = [...document.querySelectorAll("[data-plate-index]")];
        let visible = false;
        let current = null;
        const watchST = plates.length
          ? ScrollTrigger.create({
              start: 0,
              end: "max",
              onUpdate: () => {
                const line = window.innerHeight * 0.7;
                let next = null;
                for (const el of plates) {
                  if (el.getBoundingClientRect().top < line) next = el;
                }
                if (next === current) return;
                current = next;
                if (next) {
                  textRef.current.textContent = `[ ${next.dataset.plateIndex} ] ${next.dataset.plateLabel}`;
                  if (!visible) {
                    visible = true;
                    gsap.to(readout, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
                  }
                } else if (visible) {
                  visible = false;
                  gsap.to(readout, { autoAlpha: 0, duration: 0.25, ease: "power2.in" });
                }
              },
            })
          : null;

        return () => {
          progress.scrollTrigger?.kill();
          progress.kill();
          watchST?.kill();
        };
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} aria-hidden="true" className="hidden lg:block">
      <div
        ref={barRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-[115] h-0.5 bg-signal opacity-0"
      />
      <div
        ref={readoutRef}
        className="pointer-events-none fixed bottom-5 left-[var(--page-margin)] z-[110] border border-rule-inv bg-machine px-3 py-1.5 opacity-0"
      >
        <p ref={textRef} className="font-mono text-mono uppercase tracking-mono text-chalk-mute" />
      </div>
    </div>
  );
}
