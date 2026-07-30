"use client";

import { useEffect, useState } from "react";
import { openPalette } from "@/lib/palette";

/**
 * The visible door to the command palette. Three shapes for three slots — the
 * top bar, the condensed desktop pill, the phone dock — because a keyboard
 * shortcut nobody can see is a feature only the author uses.
 *
 * The key hint resolves after mount: the markup is identical on the server for
 * everyone, then Windows and Linux get CTRL instead of ⌘. Rendering the wrong
 * key is worse than rendering it a frame late.
 */
function SearchGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.4 10.4 L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function PaletteTrigger({ variant = "bar", className = "" }) {
  const [hint, setHint] = useState("⌘K");

  useEffect(() => {
    const mac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
    if (!mac) setHint("CTRL K");
  }, []);

  const common =
    "inline-flex items-center justify-center text-chalk-mute transition-colors hover:text-chalk";

  if (variant === "dock") {
    return (
      <button
        type="button"
        onClick={openPalette}
        aria-label="Open the command palette"
        // hidden on the narrowest phones: below 360px the dock's three items
        // already fill the margins exactly, and nothing may hang over them
        className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-chalk-mute transition-colors active:bg-white/[0.06] active:text-chalk min-[360px]:inline-flex ${className}`}
      >
        <SearchGlyph />
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={openPalette}
        aria-label="Open the command palette"
        title="Search — ⌘K"
        className={`${common} gap-2 rounded-full border border-rule-inv px-3 py-1 font-mono text-mono uppercase tracking-mono ${className}`}
      >
        <SearchGlyph />
        <span className="min-w-[3.4em] text-left">{hint}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Open the command palette"
      title="Search — ⌘K"
      className={`${common} h-11 gap-2.5 rounded-full border border-rule-inv px-3 font-mono text-mono uppercase tracking-mono md:px-4 ${className}`}
    >
      <SearchGlyph />
      <span className="hidden min-w-[3.4em] text-left md:inline">{hint}</span>
    </button>
  );
}
