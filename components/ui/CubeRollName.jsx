"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";

/**
 * Cube-roll wordmark (client direction, GSAP port — no framer-motion): every
 * character is a four-faced prism on its X axis. NOT a continuous spin — a
 * continuous one left every glyph permanently mid-roll and the name read as
 * ghost soup. Split-flap instead: the name rests fully readable, and every
 * few seconds one clean quarter-flip ripples through it character by
 * character, the incoming face fading in as the outgoing fades out. Four
 * steps close the full revolution, so the loop restart is seamless. The
 * static SSR state is the front face alone — exactly what mobile, reduced
 * motion and no-JS keep. Rolling only while the footer is on screen (§9).
 */
const TURN = 0.65; // s per quarter flip
const HOLD = 2.35; // s at rest between flips
const STAGGER = 0.1; // s per character — the wave

export default function CubeRollName({ text, className = "" }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (!isDesktop || reduceMotion) return;

        const root = rootRef.current;
        const chars = gsap.utils.toArray(".cr-char", root);
        const tweens = [];
        const STEP = TURN + HOLD;

        chars.forEach((char, i) => {
          // rotating -X, the face at +90 (bottom) is the one carried INTO
          // view — so the arrival order is front, bottom, back, top. (The
          // first cut had top second: its -90 placement landed at -180 after
          // the turn, backface-hidden — the whole name vanished on hold.)
          const faces = [".cr-front", ".cr-bottom", ".cr-back", ".cr-top"].map(
            (sel) => char.querySelector(sel)
          );
          const tl = gsap.timeline({ repeat: -1, delay: i * STAGGER });
          for (let k = 0; k < 4; k++) {
            const at = k * STEP;
            tl.to(
              char,
              { rotationX: -(k + 1) * 90, duration: TURN, ease: "power3.inOut" },
              at
            )
              .to(faces[k], { opacity: 0, duration: TURN * 0.85 }, at)
              .to(faces[(k + 1) % 4], { opacity: 1, duration: TURN * 0.85 }, at + TURN * 0.15);
          }
          // pad the final hold so the loop breathes before restarting
          tl.set(char, {}, 4 * STEP);
          tweens.push(tl);
        });

        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => tweens.forEach((tw) => (s.isActive ? tw.play() : tw.pause())),
        });

        return () => tweens.forEach((tw) => tw.kill());
      });
    },
    { scope: rootRef }
  );

  // opacity animates ONLY on the leaf faces — anywhere higher it would
  // flatten the preserve-3d chain (the orbit taught us that the hard way)
  const faceBase = "block whitespace-pre [backface-visibility:hidden]";

  return (
    <p
      ref={rootRef}
      aria-label={text}
      // deep perspective — at this width a shallow one shears the edge glyphs
      className={`inline-block [perspective:1600px] [transform-style:preserve-3d] ${className}`}
    >
      {text.split(/(\s+)/).map((word, w) =>
        /^\s+$/.test(word) ? (
          <span key={`s${w}`} aria-hidden="true">
            &nbsp;
          </span>
        ) : (
          <span
            key={`w${w}`}
            aria-hidden="true"
            className="inline-block [transform-style:preserve-3d]"
          >
            {word.split("").map((ch, c) => (
              <span
                key={c}
                className="cr-char relative inline-block [transform-style:preserve-3d] [will-change:transform]"
              >
                <span className={`cr-front relative ${faceBase} [transform:translateZ(0.55em)]`}>
                  {ch}
                </span>
                <span
                  className={`cr-top absolute inset-0 opacity-0 ${faceBase} [transform:rotateX(-90deg)_translateZ(0.55em)]`}
                >
                  {ch}
                </span>
                <span
                  className={`cr-bottom absolute inset-0 opacity-0 ${faceBase} [transform:rotateX(90deg)_translateZ(0.55em)]`}
                >
                  {ch}
                </span>
                <span
                  className={`cr-back absolute inset-0 opacity-0 ${faceBase} [transform:rotateX(180deg)_translateZ(0.55em)]`}
                >
                  {ch}
                </span>
              </span>
            ))}
          </span>
        )
      )}
    </p>
  );
}
