"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, MM } from "@/lib/gsap";

/**
 * Mono character scramble for the Live Rig label plate: unresolved characters
 * churn through a technical charset and resolve left to right. Desktop only —
 * mobile and reduced motion render the plain text (PRD §7.3). Screen readers
 * always get the real string via aria-label; the churning glyphs are hidden.
 * Pulled forward from Phase 4 because the label plate spec requires it.
 * PRD §3.6
 */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/·—";

export default function ScrambleText({ text, play = true, className = "" }) {
  const ref = useRef(null);
  const enabledRef = useRef(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MM, (ctx) => {
      enabledRef.current = ctx.conditions.isDesktop && !ctx.conditions.reduceMotion;
    });
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!play || !enabledRef.current) {
      el.textContent = text;
      return;
    }
    const proxy = { p: 0 };
    const tween = gsap.to(proxy, {
      p: 1,
      duration: 0.5,
      ease: "none",
      onUpdate: () => {
        const resolved = Math.floor(proxy.p * text.length);
        let out = text.slice(0, resolved);
        for (let i = resolved; i < text.length; i++) {
          out += text[i] === " " ? " " : CHARSET[(Math.random() * CHARSET.length) | 0];
        }
        el.textContent = out;
      },
      onComplete: () => {
        el.textContent = text;
      },
    });
    return () => tween.kill();
  }, [text, play]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true" ref={ref}>
        {text}
      </span>
    </span>
  );
}
