"use client";

import { useEffect } from "react";
import { profile } from "@/data/profile";

/**
 * A note for whoever opens the console — which, on a developer's portfolio, is
 * a real slice of the audience and the one that judges hardest. Printed once,
 * in the site's own palette, and never in production logs anyone has to
 * scroll past: three lines, no loop, no listeners.
 */
const MACHINE = "#1C221E";
const SIGNAL = "#E5C11F";
const CHALK = "#E8EAE5";
const MUTE = "#96A098";

export default function ConsoleSignature() {
  useEffect(() => {
    if (window.__abSigned) return;
    window.__abSigned = true;

    const plate = [
      `background:${MACHINE};color:${SIGNAL};font:700 13px/1.9 ui-monospace,monospace;`,
      `letter-spacing:.16em;padding:10px 14px 10px 16px;`,
    ].join("");
    const trail = [
      `background:${MACHINE};color:${CHALK};font:400 13px/1.9 ui-monospace,monospace;`,
      `letter-spacing:.16em;padding:10px 16px 10px 0;`,
    ].join("");

    /* eslint-disable no-console */
    console.log(
      `%c${profile.name.toUpperCase()}%c ${profile.role.toUpperCase()}`,
      plate,
      trail
    );
    console.log(
      `%cHiring, or want one of these built? %c${profile.contact.email}`,
      `color:${MUTE};font:400 12px/1.8 ui-monospace,monospace;`,
      `color:${SIGNAL};font:400 12px/1.8 ui-monospace,monospace;`
    );
    console.log(
      "%cNext.js · GSAP · Three.js — the smoke is a fragment shader in components/webgl/shaders/atmosphere.js, and every screen in the auditorium is the client's live site, not a picture of it.",
      `color:${MUTE};font:400 12px/1.7 ui-monospace,monospace;`
    );
    /* eslint-enable no-console */
  }, []);

  return null;
}
