"use client";

import { useEffect } from "react";
import { play, restore } from "@/lib/sound";

/**
 * Wires the sound layer to the page without touching a single component:
 * three delegated listeners on the document, and every link, button and
 * palette row is covered. Nothing plays until the visitor has switched sound
 * on, so with the default setting this mounts two idle listeners and stops.
 *
 * Hover only answers a real mouse. On a touch screen `pointerover` fires on
 * the tap that is about to fire `pointerdown` too, which would double every
 * press.
 */
const HITS = 'a[href],button,[role="button"],summary,input,textarea,select';

export default function SoundBus() {
  useEffect(() => {
    restore();

    let lastHover = null;
    let lastAt = 0;

    const onOver = (e) => {
      if (e.pointerType !== "mouse") return;
      const el = e.target?.closest?.(HITS);
      if (!el || el === lastHover) return;
      lastHover = el;
      // a fast diagonal across a nav would otherwise machine-gun
      const now = performance.now();
      if (now - lastAt < 60) return;
      lastAt = now;
      play("hover");
    };

    const onOut = (e) => {
      if (e.target === lastHover) lastHover = null;
    };

    const onDown = (e) => {
      if (e.target?.closest?.(HITS)) play("press");
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return null;
}
