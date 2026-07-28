"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import DirtBike from "./DirtBike";
import createSmoke from "./preloaderSmoke";

const REVEAL_EVENT = "ab:reveal";
const SEEN_KEY = "ab:intro";

const fireReveal = () => {
  if (typeof window === "undefined") return;
  window.__abRevealed = true;
  document.querySelectorAll("[data-st-hide]").forEach((el) => {
    el.style.visibility = "visible";
  });
  window.dispatchEvent(new Event(REVEAL_EVENT));
};

/**
 * Intro panel — purely cosmetic; the page underneath is revealed on mount and
 * nothing is ever gated on it.
 *
 * The choreography (client direction): the name stands up domino by domino in
 * CSS — that runs from the SSR paint, before hydration — then GSAP takes the
 * letters over and plays the sequence. A dirt bike falls in from above and
 * lands on the name (squash, screen shake, a shockwave through the letters,
 * dust off both contact points, a headlight flash), settles through its
 * bounces; the role drops out from behind it onto a hairline surface and
 * bounces there; then the bike revs, wheelies and accelerates off to the
 * right — and the wipe follows it out.
 *
 * The physics is derived, not eyeballed: one gravity constant and one
 * restitution give every height and duration (h' = e²h, t = √(2h/g)),
 * `power2.in` IS the ½gt² curve, and the wheel spin is solved from distance
 * over tyre radius so the tyres never skate.
 *
 * Cost discipline: it plays ONCE per session (the body-start script in
 * layout.js stamps the flag before this panel exists, so a repeat visit never
 * flashes it); any click, scroll or key skips straight to the wipe; mobile
 * runs a shortened cut; reduced motion and no-JS skip the panel entirely.
 * PRD §5.0 · §7.3 · §9
 */

// Screen-space physics. G is tuned for weight; E is a heavy bike's bounce.
const G = 6500;
const E = 0.42;
const fallTime = (h) => Math.sqrt((2 * Math.max(h, 0.5)) / G);

const NAME_LINES = ["AMARTYA", "BAUL"];
const ROLE = "Full-Stack Developer";

// Second load onward in a session: the name still stands up, then the panel
// leaves — the pre-bike intro, kept as the short cut. Set this to 0 to give
// every load the full sequence instead.
const SHORT_MS = 1150;

export default function Preloader() {
  // 0 = playing | 1 = wiping | 2 = gone
  const [phase, setPhase] = useState(0);
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // The page is never gated on the panel.
    fireReveal();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(2);
      return;
    }
    // The full show is a first-impression piece; a reload in the same session
    // gets the short cut rather than the whole ride again.
    const repeat = SHORT_MS > 0 && document.documentElement.hasAttribute("data-intro-seen");
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode — the full sequence simply plays again */
    }

    let smoke = null;
    let tl = null;

    const runCounter = (seconds) => {
      const c = { v: 0 };
      tl.to(
        c,
        {
          v: 100,
          duration: seconds,
          ease: "none",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(c.v)).padStart(3, "0");
            }
          },
        },
        0
      );
    };

    // The short cut: the CSS domino is already running on its own, so there is
    // nothing to drive but the counter and the exit. The bike, role, surface
    // and streak stay in their hidden resting states and never light up.
    const buildShort = () => {
      tl = gsap.timeline({ onComplete: () => setPhase(1) });
      runCounter(SHORT_MS / 1000);
    };

    const buildFull = () => {
      const root = rootRef.current;
      const stage = root.querySelector("[data-stage]");
      const bike = root.querySelector("[data-bike]");
      const body = bike.querySelector(".bk-body");
      const wheelR = bike.querySelector(".bk-wheel-r");
      const wheelF = bike.querySelector(".bk-wheel-f");
      const flash = bike.querySelector(".bk-flash");
      const pipe = bike.querySelector(".bk-exhaust");
      const letters = gsap.utils.toArray(".ab-pre-ch", root);
      const surface = root.querySelector("[data-surface]");
      const role = root.querySelector("[data-role]");
      const streak = root.querySelector("[data-streak]");

      const compact = window.innerWidth < 1024;

      /* ---------------------------------------- measurements, before any set */
      const bikeBox = bike.getBoundingClientRect();
      const roleBox = role.getBoundingClientRect();
      const canvasBox = canvasRef.current.getBoundingClientRect();

      const fallH = bikeBox.bottom + 90; // in from clear of the viewport
      const tyreR = (bikeBox.width * 26) / 240; // rolling radius, screen px
      const exitX = window.innerWidth - bikeBox.left + bikeBox.width + 60;
      const roleH = Math.max(roleBox.top - (bikeBox.top + bikeBox.height * 0.5), 90);
      const contactY = bikeBox.bottom - canvasBox.top;

      // the letter the bike comes down on — the shockwave starts there
      const bikeMidX = bikeBox.left + bikeBox.width * 0.5;
      let hitIndex = 0;
      let best = Infinity;
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - bikeMidX);
        if (d < best) {
          best = d;
          hitIndex = i;
        }
      });

      /* ---------------------------------------- smoke */
      smoke = createSmoke(canvasRef.current, () => {
        const p = pipe.getBoundingClientRect();
        const c = canvasRef.current.getBoundingClientRect();
        return { x: p.left + p.width / 2 - c.left, y: p.top + p.height / 2 - c.top };
      });

      /* ---------------------------------------- initial states */
      gsap.set(bike, {
        y: -fallH,
        rotation: -7,
        transformOrigin: "21.7% 79.5%", // the rear axle, in viewBox terms
        autoAlpha: 1,
      });
      gsap.set(role, { y: -roleH, autoAlpha: 0 });
      // Pin every SVG origin in user units. Letting GSAP infer them from the
      // bounding box is what threw the wheels across the panel — svgOrigin is
      // unambiguous, and GSAP caches it for every later tween on the element.
      gsap.set(wheelR, { svgOrigin: "52 101" });
      gsap.set(wheelF, { svgOrigin: "196 101" });
      gsap.set(body, { svgOrigin: "120 127" }); // squash toward the tyres
      gsap.set(flash, { svgOrigin: "191 39" });

      tl = gsap.timeline({ onComplete: () => setPhase(1) });

      /* ---------------------------------------- the name changes hands
       * The CSS domino owns the letters until here — its fill-forwards beats
       * inline styles, so the animation has to be switched off in the same
       * beat the resting transform is written, or they snap back flat.
       */
      const domino = compact ? 0.42 : 0.5;
      tl.add(() => {
        letters.forEach((el) => {
          el.style.animation = "none";
        });
        gsap.set(letters, { rotation: 0, opacity: 1, transformOrigin: "50% 100%" });
        smoke?.idle();
      }, domino);

      /* ---------------------------------------- the fall */
      const t0 = domino + 0.02;
      const tF = fallTime(fallH);
      tl.to(bike, { y: 0, duration: tF, ease: "power2.in" }, t0)
        .to(bike, { rotation: 0, duration: tF, ease: "power2.out" }, t0)
        .to([wheelR, wheelF], { rotation: 210, duration: tF, ease: "none" }, t0);

      /* ---------------------------------------- impact */
      const tHit = t0 + tF;
      tl.to(body, { scaleY: 0.88, scaleX: 1.06, duration: 0.07, ease: "power2.out" }, tHit)
        .to(
          body,
          { scaleY: 1, scaleX: 1, duration: 0.55, ease: "elastic.out(1.1, 0.34)" },
          tHit + 0.07
        )
        .to(
          stage,
          {
            keyframes: { x: [0, -6, 5, -3, 1, 0], y: [0, 5, -3, 2, 0, 0] },
            duration: 0.3,
            ease: "none",
          },
          tHit
        )
        .to(flash, { opacity: 0.9, duration: 0.1, ease: "power2.out" }, tHit)
        .to(flash, { opacity: 0, duration: 0.45, ease: "power2.in" }, tHit + 0.1)
        // the shockwave travels the name outward from the contact point
        .to(
          letters,
          {
            y: 11,
            scaleY: 0.84,
            duration: 0.1,
            ease: "power2.out",
            stagger: { each: 0.014, from: hitIndex },
          },
          tHit
        )
        .to(
          letters,
          {
            y: 0,
            scaleY: 1,
            duration: 0.85,
            ease: "elastic.out(1, 0.36)",
            stagger: { each: 0.014, from: hitIndex },
          },
          tHit + 0.1
        )
        .add(() => {
          const b = bike.getBoundingClientRect();
          const c = canvasRef.current.getBoundingClientRect();
          smoke?.burst(b.left + b.width * 0.22 - c.left, contactY, 1);
          smoke?.burst(b.left + b.width * 0.82 - c.left, contactY, 0.7);
        }, tHit);

      /* ---------------------------------------- the bounces, e² apart */
      let t = tHit;
      let h = fallH;
      for (let i = 0; i < 3; i++) {
        h *= E * E;
        const th = fallTime(h);
        tl.to(bike, { y: -h, duration: th, ease: "power2.out" }, t).to(
          bike,
          { y: 0, duration: th, ease: "power2.in" },
          t + th
        );
        if (i < 2) {
          tl.to(body, { scaleY: 0.95, duration: 0.05, ease: "power2.out" }, t + th * 2).to(
            body,
            { scaleY: 1, duration: 0.32, ease: "elastic.out(1, 0.4)" },
            t + th * 2 + 0.05
          );
        }
        t += th * 2;
      }
      const tRest = t;
      tl.to(
        [wheelR, wheelF],
        { rotation: "+=340", duration: tRest - tHit + 0.35, ease: "power2.out" },
        tHit
      );

      /* ---------------------------------------- the surface, then the role */
      tl.to(surface, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, tHit + 0.18);

      const tRole = tHit + 0.34;
      const tRF = fallTime(roleH);
      tl.to(role, { autoAlpha: 1, duration: 0.14 }, tRole).to(
        role,
        { y: 0, duration: tRF, ease: "power2.in" },
        tRole
      );
      let t2 = tRole + tRF;
      tl.to(role, { scaleY: 0.78, scaleX: 1.08, duration: 0.06, ease: "power2.out" }, t2).to(
        role,
        { scaleY: 1, scaleX: 1, duration: 0.55, ease: "elastic.out(1, 0.4)" },
        t2 + 0.06
      );
      let h2 = roleH;
      for (let i = 0; i < 2; i++) {
        h2 *= E * E;
        const th2 = fallTime(h2);
        tl.to(role, { y: -h2, duration: th2, ease: "power2.out" }, t2).to(
          role,
          { y: 0, duration: th2, ease: "power2.in" },
          t2 + th2
        );
        t2 += th2 * 2;
      }

      /* ---------------------------------------- rev, wheelie, gone */
      const tRev = Math.max(tRest, t2) + 0.14;
      const burn = compact ? 0.28 : 0.36;
      tl.add(() => smoke?.rev(), tRev)
        .to(
          bike,
          {
            keyframes: { x: [0, 1.6, -1.2, 1, 0], y: [0, -1.2, 1, -1.6, 0] },
            duration: 0.16,
            ease: "none",
            repeat: 1,
          },
          tRev
        )
        // the rear wheel spins up against the surface — a standing burnout
        .to(wheelR, { rotation: "+=1100", duration: burn, ease: "power1.in" }, tRev);

      const tLift = tRev + burn;
      tl.to(bike, { rotation: -32, duration: 0.28, ease: "power2.out" }, tLift);

      const tGo = tLift + (compact ? 0.16 : 0.2);
      const run = compact ? 0.48 : 0.55;
      // rolling without slipping: the spin is solved from the ground covered
      const spin = (exitX / tyreR) * (180 / Math.PI);
      tl.add(() => smoke?.launch(), tGo)
        .to(bike, { x: exitX, duration: run, ease: "power2.in" }, tGo)
        .to(bike, { rotation: -9, duration: run * 0.8, ease: "power2.out" }, tGo + 0.1)
        .to([wheelR, wheelF], { rotation: `+=${spin}`, duration: run, ease: "power2.in" }, tGo)
        .to(streak, { autoAlpha: 0.85, duration: 0.08 }, tGo)
        .to(streak, { scaleX: 1, duration: run, ease: "power2.in" }, tGo)
        .to(streak, { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, tGo + run * 0.55)
        .add(() => smoke?.stop(), tGo + run * 0.8);

      const tEnd = tGo + run;

      /* ---------------------------------------- the counter, over it all */
      runCounter(tEnd * 0.94);
    };

    const ctx = gsap.context(repeat ? buildShort : buildFull, rootRef);

    /* ---------------------------------------- skip, and a hard failsafe */
    const skip = () => {
      tl?.pause();
      smoke?.stop();
      setPhase(1);
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("keydown", skip, { once: true });
    const bail = setTimeout(() => setPhase(2), 8000);

    return () => {
      clearTimeout(bail);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("keydown", skip);
      smoke?.destroy();
      ctx.revert();
    };
  }, []);

  // the wipe runs in CSS; unmount once it has left
  useEffect(() => {
    if (phase !== 1) return;
    const t = setTimeout(() => setPhase(2), 620);
    return () => clearTimeout(t);
  }, [phase]);

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
          overflow: hidden;
          clip-path: inset(0% 0% 0% 0%);
        }
        .ab-pre.ab-pre--wipe {
          clip-path: inset(0% 0% 100% 0%);
          transition: clip-path 0.55s cubic-bezier(0.76, 0, 0.24, 1);
        }
        /* the stage's top edge IS the contact line: the names are its first
           child, so the bike's bottom:100% rests exactly on the name */
        .ab-pre-stage { position: relative; }
        .ab-pre-smoke {
          position: absolute;
          left: -12%;
          top: -180%;
          width: 124%;
          height: 340%;
          pointer-events: none;
          z-index: 2;
        }
        .ab-pre-names { position: relative; z-index: 1; }
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
        /* domino fall — each character lies flat at its bottom-left corner and
           stands up in sequence. Pure CSS so it runs from the SSR paint, before
           hydration; GSAP takes the letters over once they have landed. */
        .ab-pre-ch {
          display: inline-block;
          transform-origin: bottom left;
          transform: rotate(-90deg);
          opacity: 0;
          animation: ab-domino 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          will-change: transform, opacity;
        }
        @keyframes ab-domino {
          to { transform: rotate(0deg); opacity: 1; }
        }
        .ab-pre-bike {
          position: absolute;
          left: 7%;
          bottom: 100%;
          width: clamp(168px, 21vw, 300px);
          color: var(--chalk);
          z-index: 3;
          visibility: hidden;
          will-change: transform;
        }
        /* NO transform-box/transform-origin on the SVG parts: GSAP measures
           SVG origins off getBBox itself, and declaring them here as well
           applies the offset twice — the wheels end up across the panel. */
        .ab-pre-streak {
          position: absolute;
          left: 7%;
          right: -14%;
          bottom: 100%;
          height: 2px;
          background: var(--signal);
          transform: scaleX(0);
          transform-origin: 0 50%;
          opacity: 0;
          z-index: 1;
        }
        /* line-height 0 kills the line box's leading, so the surface sits
           tight under the role instead of floating a strut's height below */
        .ab-pre-floor { position: relative; z-index: 1; margin-top: 3.2rem; line-height: 0; }
        .ab-pre-role {
          display: inline-block;
          font-family: var(--font-archivo), system-ui, sans-serif;
          font-weight: 650;
          font-stretch: 110%;
          letter-spacing: -0.01em;
          font-size: var(--fs-h3);
          line-height: 1;
          color: var(--signal);
          margin: 0;
          transform-origin: 50% 100%;
          visibility: hidden;
        }
        /* the surface it lands on */
        .ab-pre-surface {
          display: block;
          height: 1px;
          margin-top: 0.7rem;
          background: var(--rule-inv);
          transform: scaleX(0);
          transform-origin: 0 50%;
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
        /* a repeat load keeps the panel — it just runs the short cut; only
           reduced motion and no-JS drop it entirely */
        @media (prefers-reduced-motion: reduce) {
          .ab-pre { display: none; }
        }
      `}</style>

      <noscript>
        <style>{`.ab-pre{display:none}`}</style>
      </noscript>

      <div
        ref={rootRef}
        aria-hidden="true"
        role="presentation"
        className={`ab-pre${phase === 1 ? " ab-pre--wipe" : ""}`}
      >
        <div className="ab-pre-stage" data-stage>
          <canvas ref={canvasRef} className="ab-pre-smoke" />

          <div className="ab-pre-names">
            {NAME_LINES.map((word, line) => (
              <p key={word} className="ab-pre-name">
                {word.split("").map((ch, i) => (
                  <span
                    key={i}
                    className="ab-pre-ch"
                    // one continuous domino run across both lines
                    style={{
                      animationDelay: `${
                        ((line === 0 ? 0 : NAME_LINES[0].length) + i) * 0.035 + 0.03
                      }s`,
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <div className="ab-pre-floor">
            <p className="ab-pre-role" data-role>
              {ROLE}
            </p>
            <span className="ab-pre-surface" data-surface />
          </div>

          <span className="ab-pre-streak" data-streak />
          <DirtBike className="ab-pre-bike" data-bike />
        </div>

        <p className="ab-pre-counter" ref={counterRef}>
          000
        </p>
      </div>
    </>
  );
}
