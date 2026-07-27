"use client";

import { useRef } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";

/**
 * Decorative cursor: a chalk difference dot on a lerped follow. Over
 * [data-magnetic] it swells and leans into the element; over [data-cursor] it
 * becomes the signal disc with the contextual mono label (the Live Rig's
 * OPEN ↗ in Phase 3). Desktop only, gone under reduced motion. Hit areas and
 * text carets stay native — the .has-cursor class is added only while this is
 * live, and inputs keep their native cursor. PRD §7.3 · §8.6
 */
export default function Cursor() {
  const rootRef = useRef(null);
  const circleRef = useRef(null);
  const labelRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (!isDesktop || reduceMotion) return;

        const root = rootRef.current;
        const circle = circleRef.current;
        const label = labelRef.current;

        document.documentElement.classList.add("has-cursor");
        gsap.set(root, { xPercent: -50, yPercent: -50, autoAlpha: 0, willChange: "transform" });

        const xTo = gsap.quickTo(root, "x", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(root, "y", { duration: 0.35, ease: "power3.out" });

        let magnetEl = null;
        let shown = false;

        const onMove = (e) => {
          if (!shown) {
            shown = true;
            gsap.to(root, { autoAlpha: 1, duration: 0.2 });
          }
          if (magnetEl) {
            // glue toward the magnetic element's centre, keeping a little pointer drift
            const r = magnetEl.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            xTo(cx + (e.clientX - cx) * 0.25);
            yTo(cy + (e.clientY - cy) * 0.25);
          } else {
            xTo(e.clientX);
            yTo(e.clientY);
          }
        };

        const onOver = (e) => {
          const labelled = e.target.closest?.("[data-cursor]");
          magnetEl = e.target.closest?.("[data-magnetic]") ?? null;

          if (labelled) {
            label.textContent = labelled.getAttribute("data-cursor");
            circle.classList.remove("bg-chalk", "mix-blend-difference");
            circle.classList.add("bg-signal");
            gsap.to(circle, { scale: 7, duration: 0.3, ease: "power3.out" });
            gsap.to(label, { autoAlpha: 1, duration: 0.2 });
          } else {
            label.textContent = "";
            circle.classList.add("bg-chalk", "mix-blend-difference");
            circle.classList.remove("bg-signal");
            gsap.to(circle, { scale: magnetEl ? 1.8 : 1, duration: 0.3, ease: "power3.out" });
            gsap.to(label, { autoAlpha: 0, duration: 0.15 });
          }
        };

        const onLeaveWindow = () => {
          shown = false;
          gsap.to(root, { autoAlpha: 0, duration: 0.2 });
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseover", onOver);
        document.documentElement.addEventListener("mouseleave", onLeaveWindow);

        return () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseover", onOver);
          document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
          document.documentElement.classList.remove("has-cursor");
        };
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[140] hidden lg:block"
    >
      <span ref={circleRef} className="block h-3 w-3 rounded-full bg-chalk mix-blend-difference" />
      <span
        ref={labelRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-mono uppercase tracking-mono text-ink opacity-0"
      />
    </div>
  );
}
