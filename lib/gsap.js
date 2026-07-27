/**
 * Single GSAP registration point. Every component imports gsap, ScrollTrigger,
 * useGSAP and the MM breakpoint map from here — never from the packages
 * directly — so plugins register exactly once and every matchMedia() in the
 * codebase agrees on the same three conditions. PRD §7.4 · §8.2
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/** The only breakpoint conditions allowed in gsap.matchMedia(). AGENTS.md §Motion */
export const MM = {
  isDesktop: "(min-width: 1024px)",
  isMobile: "(max-width: 1023px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Mobile URL-bar resize must not re-trigger everything. PRD §7.4
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Recompute trigger positions once real fonts have swapped in. PRD §7.4
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export { gsap, ScrollTrigger, useGSAP };
