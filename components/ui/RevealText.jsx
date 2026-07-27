"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import { EASE, STAGGER } from "@/lib/motion";
import SplitText from "./SplitText";

/**
 * Mask reveal for headings: per-character on desktop, per-word on mobile,
 * stagger 0.03, power4.out, 1.1s, each wrapped line offset by 0.08. Fires on
 * scroll by default; mode="load" waits for the preloader's reveal event (the
 * hero starts at 60% of the wipe). Under prefers-reduced-motion nothing is
 * hidden and nothing animates — the SSR text simply stays. PRD §5.2 · §7.3
 */

// Fired by Preloader.jsx at 60% of the exit wipe.
export const REVEAL_EVENT = "ab:reveal";

export default function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  mode = "scroll",
  lineIndex = 0, // for multi-line headlines composed of one RevealText per line
  variant = "chars", // "chars" mask reveal · "fade" for blocks that must ride the same gate
  children,
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (reduceMotion) return; // complete site, no animation

        const el = ref.current;

        if (variant === "fade") {
          gsap.set(el, { autoAlpha: 0, visibility: "visible" });
          const tween = gsap.to(el, {
            autoAlpha: 1,
            duration: 0.9,
            ease: EASE.out,
            paused: true,
            delay: lineIndex * 0.08,
          });
          const fontsReady = Promise.race([
            document.fonts?.ready ?? Promise.resolve(),
            new Promise((r) => setTimeout(r, 1200)),
          ]);
          const play = () => fontsReady.then(() => tween.play());
          if (mode === "load") {
            if (window.__abRevealed) {
              play();
            } else {
              window.addEventListener(REVEAL_EVENT, play, { once: true });
              const fallback = setTimeout(play, 3500);
              return () => {
                clearTimeout(fallback);
                window.removeEventListener(REVEAL_EVENT, play);
              };
            }
          } else {
            ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: play });
          }
          return;
        }

        const words = gsap.utils.toArray(el.querySelectorAll(".st-word"));
        if (!words.length) return;

        // Group by rendered line so wrapped lines get the 0.08 offset.
        const tops = [...new Set(words.map((w) => w.offsetTop))].sort((a, b) => a - b);
        const lineOf = (node) =>
          tops.indexOf((node.classList.contains("st-word") ? node : node.closest(".st-word")).offsetTop);

        const targets = isDesktop
          ? gsap.utils.toArray(el.querySelectorAll(".st-char"))
          : words;

        // per-target delay: line offset + stagger within its line
        const seen = {};
        const delays = targets.map((t) => {
          const line = lineIndex + lineOf(t);
          seen[line] = (seen[line] ?? -1) + 1;
          return line * 0.08 + seen[line] * STAGGER.tight;
        });

        // Characters into the mask first, then the element may become visible
        // again (it was hidden from first paint by .js [data-st-hide] so the
        // font swap reflows invisible text — the CLS guard).
        gsap.set(targets, { yPercent: 110, willChange: "transform" });
        gsap.set(el, { visibility: "visible" });

        const tween = gsap.to(targets, {
          yPercent: 0,
          duration: 1.1,
          ease: EASE.out,
          paused: true,
          stagger: (i) => delays[i],
          onComplete: () => gsap.set(targets, { clearProps: "willChange,transform" }),
        });

        // Never start revealing before the real fonts are in — a swap mid-
        // reveal moves visible glyphs, which is exactly the shift we banned.
        const fontsReady = Promise.race([
          document.fonts?.ready ?? Promise.resolve(),
          new Promise((r) => setTimeout(r, 1200)),
        ]);
        const play = () => fontsReady.then(() => tween.play());

        if (mode === "load") {
          if (window.__abRevealed) {
            play();
          } else {
            window.addEventListener(REVEAL_EVENT, play, { once: true });
            // Safety: never leave the hero hidden if the event is missed.
            const fallback = setTimeout(play, 3500);
            return () => {
              clearTimeout(fallback);
              window.removeEventListener(REVEAL_EVENT, play);
            };
          }
        } else {
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: play,
          });
        }
      });
    },
    { scope: ref }
  );

  if (variant === "fade") {
    return (
      <Tag ref={ref} className={className} data-st-hide="">
        {children}
      </Tag>
    );
  }
  return <SplitText text={text} as={Tag} className={className} ref={ref} data-st-hide="" />;
}
