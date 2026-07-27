/**
 * Single GSAP registration point. Every component imports gsap, ScrollTrigger
 * and useGSAP from here — never from the packages directly — so plugins are
 * registered exactly once. ScrollTrigger configuration (ignoreMobileResize,
 * refresh after fonts) is wired in Phase 2. PRD §7.4 · §8.2
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
