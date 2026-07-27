"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, MM } from "@/lib/gsap";
import { EASE } from "@/lib/motion";

/**
 * GSAP curtain for App Router navigation: a machine panel clip-wipes up over
 * the page, the route changes underneath, the panel wipes off upward.
 * 900ms total on desktop, a 400ms fade on mobile, nothing under reduced
 * motion. Only left-click, same-origin, non-hash, non-download navigations are
 * intercepted — everything else (new tabs, modifier clicks, the browser back
 * button) behaves natively, so history is never broken. The panel contains no
 * focusable elements and unclips completely, so it cannot trap focus.
 * PRD §7.3 · §8.6
 */
export default function PageTransition() {
  const panelRef = useRef(null);
  const coveredRef = useRef(false);
  const firstRef = useRef(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const media = () => ({
      reduce: window.matchMedia(MM.reduceMotion).matches,
      mobile: window.matchMedia(MM.isMobile).matches,
    });

    const cover = () =>
      new Promise((resolve) => {
        const panel = panelRef.current;
        const { reduce, mobile } = media();
        coveredRef.current = true;
        gsap.set(panel, { pointerEvents: "auto" });
        if (reduce) {
          gsap.set(panel, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 });
          resolve();
        } else if (mobile) {
          gsap.set(panel, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.fromTo(
            panel,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.2, ease: "power2.in", onComplete: resolve }
          );
        } else {
          gsap.set(panel, { autoAlpha: 1, willChange: "clip-path" });
          gsap.fromTo(
            panel,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.45,
              ease: EASE.inOut,
              onComplete: resolve,
            }
          );
        }
        // Failsafe: never leave the page covered if navigation stalls.
        setTimeout(() => coveredRef.current && reveal(), 4000);
      });

    const reveal = () => {
      const panel = panelRef.current;
      const { reduce, mobile } = media();
      coveredRef.current = false;
      const park = () =>
        gsap.set(panel, {
          pointerEvents: "none",
          autoAlpha: 0,
          clipPath: "inset(100% 0% 0% 0%)",
          clearProps: "willChange",
        });
      if (reduce) park();
      else if (mobile) gsap.to(panel, { autoAlpha: 0, duration: 0.2, ease: "power2.out", onComplete: park });
      else
        gsap.to(panel, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.45,
          ease: EASE.inOut,
          onComplete: park,
        });
    };

    panelRef.current.__reveal = reveal;

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href?.startsWith("/")) return; // hashes and external URLs stay native
      if (href === window.location.pathname) return;
      e.preventDefault();
      cover().then(() => router.push(href));
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  // Arriving on a new route: wipe off if we covered; back/forward arrives
  // natively uncovered and stays untouched.
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    if (coveredRef.current) {
      requestAnimationFrame(() => panelRef.current?.__reveal?.());
    }
  }, [pathname]);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[130] bg-machine opacity-0"
      style={{ clipPath: "inset(100% 0% 0% 0%)" }}
    />
  );
}
