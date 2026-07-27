"use client";

import { useState, useEffect, useRef } from "react";

const REVEAL_EVENT = "ab:reveal";

const fireReveal = () => {
  if (typeof window === "undefined") return;
  window.__abRevealed = true;
  document.querySelectorAll("[data-st-hide]").forEach((el) => {
    el.style.visibility = "visible";
  });
  window.dispatchEvent(new Event(REVEAL_EVENT));
};

/**
 * Intro panel — purely cosmetic. Content is revealed immediately on mount.
 * Phase 0 (0-900ms): panel visible, counter counts to 100
 * Phase 1 (900-1500ms): panel wipes upward via CSS transition
 * Phase 2: component unmounts
 * PRD §5.0 · §7.3
 */
export default function Preloader() {
  // 0 = visible | 1 = wiping | 2 = gone
  const [phase, setPhase] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    // Fire content reveal immediately — nothing is ever gated
    fireReveal();

    // Counter runs AFTER hydration, owned by React — a pre-hydration inline
    // script mutating this text was a guaranteed hydration mismatch (#418)
    // that took the whole page down.
    let raf = 0;
    let startTs = null;
    const tick = (ts) => {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / 900, 1);
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setPhase(1), 900);   // begin wipe
    const t2 = setTimeout(() => setPhase(2), 1500);  // unmount after wipe

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === 2) return null;

  return (
    <>
      <style>{`
        .ab-pre {
          position: fixed;
          inset: 0;
          z-index: 150;
          background: var(--machine);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 var(--page-margin);
          clip-path: inset(0% 0% 0% 0%);
        }
        .ab-pre.ab-pre--wipe {
          clip-path: inset(0% 0% 100% 0%);
          transition: clip-path 0.55s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .ab-pre-name {
          font-family: var(--font-archivo), system-ui, sans-serif;
          font-weight: 650;
          font-stretch: 110%;
          letter-spacing: -0.03em;
          line-height: 0.88;
          font-size: var(--fs-display);
          color: var(--chalk);
          text-transform: uppercase;
          margin: 0;
        }
        .ab-pre-counter {
          position: absolute;
          bottom: 2rem;
          left: var(--page-margin);
          font-family: var(--font-martian), ui-monospace, monospace;
          font-size: 0.6875rem;
          letter-spacing: 0.14em;
          color: var(--chalk-mute);
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        /* reduced motion: the cosmetic panel is skipped entirely */
        @media (prefers-reduced-motion: reduce) {
          .ab-pre { display: none; }
        }
      `}</style>

      <noscript>
        <style>{`.ab-pre{display:none}`}</style>
      </noscript>

      <div
        aria-hidden="true"
        role="presentation"
        className={`ab-pre${phase === 1 ? " ab-pre--wipe" : ""}`}
      >
        <div>
          <p className="ab-pre-name">AMARTYA</p>
          <p className="ab-pre-name">BAUL</p>
        </div>

        <p className="ab-pre-counter" ref={counterRef}>000</p>
      </div>
    </>
  );
}
