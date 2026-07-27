"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import { EASE, DUR } from "@/lib/motion";

/**
 * Number roll for the stats: renders the final value on the server (SEO and
 * no-JS read the real number), then rolls 0 → value on scroll-in. Text-content
 * only — no layout properties animate; tabular figures stop digit-width
 * jitter. Skipped under reduced motion. PRD §7.3
 */
export default function Counter({ value, suffix = "", className = "" }) {
  const ref = useRef(null);
  const numRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        if (ctx.conditions.reduceMotion) return;

        const obj = { v: value };
        const render = () => {
          numRef.current.textContent = Math.round(obj.v);
        };

        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 90%",
          once: true,
          onEnter: () => {
            obj.v = 0;
            render();
            gsap.to(obj, {
              v: value,
              duration: DUR.hero,
              ease: EASE.expo,
              onUpdate: render,
            });
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`[font-variant-numeric:tabular-nums] ${className}`}>
      <span ref={numRef}>{value}</span>
      {suffix}
    </span>
  );
}
