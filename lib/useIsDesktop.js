"use client";

import { useSyncExternalStore } from "react";
import { MM } from "@/lib/gsap";

/**
 * React-side mirror of the gsap.matchMedia() breakpoints, for logic that lives
 * in state rather than in tweens (e.g. the iframe lifecycle). Uses the same MM
 * condition strings so the two systems can never disagree. SSR-safe: false on
 * the server, resolved before paint on the client. PRD §8.2
 */
function subscribe(query) {
  return (onChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe(MM.isDesktop),
    () => window.matchMedia(MM.isDesktop).matches,
    () => false
  );
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe(MM.reduceMotion),
    () => window.matchMedia(MM.reduceMotion).matches,
    () => false
  );
}
