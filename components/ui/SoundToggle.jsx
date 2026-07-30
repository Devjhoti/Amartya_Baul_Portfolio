"use client";

import { useEffect, useState } from "react";
import { restore, subscribe, toggle } from "@/lib/sound";

/**
 * The switch for the sound layer. Renders in the off state on the server for
 * everyone, then picks up the stored preference after mount — the alternative
 * is a hydration mismatch on a control whose whole job is to be trustworthy.
 *
 * Four bars that stand up when sound is on: the same equaliser everybody
 * already reads, drawn in the site's hairline language rather than a speaker
 * icon with a cross through it.
 */
export default function SoundToggle({ className = "" }) {
  const [on, setState] = useState(false);

  useEffect(() => {
    setState(restore());
    return subscribe(setState);
  }, []);

  // Four bars that stand up when sound is on, struck through when it is off.
  // Flattening them to nothing was the first attempt and it read as an
  // ellipsis, not a control — the slash is what makes the off state legible.
  const bars = [0.42, 1, 0.66, 0.28];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
        on ? "text-signal" : "text-chalk-mute hover:text-chalk"
      } ${className}`}
    >
      <span aria-hidden="true" className="relative flex h-4 items-center gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-current transition-[height,opacity] duration-300"
            style={{
              height: `${Math.max(Math.round(h * 16 * (on ? 1 : 0.55)), 3)}px`,
              opacity: on ? 1 : 0.75,
              transitionDelay: `${i * 45}ms`,
            }}
          />
        ))}
        <span
          className="absolute left-1/2 top-1/2 h-[1.5px] w-[19px] origin-center -translate-x-1/2 -translate-y-1/2 rotate-[-38deg] rounded-full bg-current transition-transform duration-300"
          style={{ transform: `translate(-50%,-50%) rotate(-38deg) scaleX(${on ? 0 : 1})` }}
        />
      </span>
      <span className="sr-only">{on ? "on" : "off"}</span>
    </button>
  );
}
