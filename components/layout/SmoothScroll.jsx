"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";

/**
 * Lenis smooth scroll, the exact AGENTS.md config, driven by the GSAP ticker
 * so there is exactly one animation clock. Desktop only — native scroll below
 * 1024px and under reduced motion. In-page anchors (nav, back-to-top) ride the
 * same easing. PRD §7.1 · §7.2
 */
export default function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MM, (ctx) => {
      const { isDesktop, reduceMotion } = ctx.conditions;
      if (!isDesktop || reduceMotion) return;

      const lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // Programmatic scrolls (rig jump list, back-to-top) ride the same easing.
      window.__lenis = lenis;

      const onClick = (e) => {
        const link = e.target.closest?.('a[href^="#"]');
        if (!link) return;
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target);
      };
      document.addEventListener("click", onClick);

      return () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
      };
    });
  });

  return null;
}
