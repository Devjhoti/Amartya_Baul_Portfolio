"use client";

import { useRef } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";

/**
 * Magnetic pull for CTAs: the child eases toward the pointer while hovered and
 * snaps back elastically on leave. Transform only, desktop only, inert under
 * reduced motion and below 1024px. Tags itself [data-magnetic] so the cursor
 * can react. PRD §7.3
 */
export default function MagneticWrap({ strength = 0.35, className = "", children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (!isDesktop || reduceMotion) return;

        const el = ref.current;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const onEnter = () => gsap.set(el, { willChange: "transform" });
        const onLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.45)",
            onComplete: () => gsap.set(el, { clearProps: "willChange" }),
          });
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        };
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} data-magnetic="" className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
