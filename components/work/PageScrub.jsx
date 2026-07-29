"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import MonoLabel from "@/components/ui/MonoLabel";

/**
 * The scroll journey as a film strip drawn past a gate.
 *
 * The live rig above proves the site runs; this shows where scrolling it
 * takes you. Each frame in the strip is a real viewport photographed at an
 * even stop down the page — not a full-page capture, which on these sites
 * (every one of them pins and animates) returns the opening frame stretched
 * over the whole scroll distance and shows almost nothing.
 *
 * The travel is measured rather than guessed: the image's own aspect gives
 * its height at the rendered width, and the scrub carries exactly
 * (height − gate), so the last frame lands flush at the end of the pin.
 *
 * Desktop with motion only. Everywhere else the strip simply renders down the
 * page as a column of stills — no pin, no scrub, every frame still readable,
 * which is also the no-JS state. §5.5 · §9
 */
export default function PageScrub({ src, alt, index = "04", frames = 0 }) {
  const rootRef = useRef(null);
  const [ratio, setRatio] = useState(0); // natural height ÷ width

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (!isDesktop || reduceMotion || !ratio) return;

        const root = rootRef.current;
        const gate = root.querySelector("[data-gate]");
        const strip = root.querySelector("[data-strip]");
        const rail = root.querySelector("[data-rail]");

        const travel = () => Math.max(strip.offsetHeight - gate.clientHeight, 0);
        // roughly a screen of scroll per frame, held within reason
        const distance = () => Math.min(Math.max(travel() * 0.85, 700), 3800);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });
        tl.to(strip, { y: () => -travel(), ease: "none" }, 0);
        if (rail) tl.to(rail, { scaleY: 1, ease: "none" }, 0);
      });
    },
    { scope: rootRef, dependencies: [ratio] }
  );

  return (
    <section ref={rootRef} className="text-chalk">
      <div className="flex items-baseline justify-between gap-6 border-t border-rule-inv pt-4">
        <MonoLabel>
          <span className="text-signal">[ {index} ]</span>
          <span className="ml-3">THE SCROLL</span>
        </MonoLabel>
        <MonoLabel className="text-chalk-mute">
          {frames ? `${String(frames).padStart(2, "0")} FRAMES · ` : ""}SCROLL TO RUN
        </MonoLabel>
      </div>

      <div className="mt-8 flex gap-5">
        {/* the meter: how far down their page the strip has run */}
        <span aria-hidden="true" className="relative hidden w-px shrink-0 bg-rule-inv lg:block">
          <span
            data-rail=""
            className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-signal"
          />
        </span>

        <div
          data-gate=""
          className="relative flex-1 overflow-hidden border border-white/15 bg-machine-2 lg:motion-safe:h-[74vh]"
          style={{
            boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8), inset 1px 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <span aria-hidden="true" className="absolute left-0 top-0 z-20 h-2 w-2 bg-signal" />
          <span aria-hidden="true" className="absolute right-0 top-0 z-20 h-2 w-2 bg-signal" />

          {/* the gate's own darkening at the lips, so frames arrive and leave
              rather than being cut off square */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[rgba(28,34,30,0.85)] to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[rgba(28,34,30,0.85)] to-transparent"
          />

          <div data-strip="" className="[will-change:transform]">
            <Image
              src={src}
              alt={alt}
              width={1440}
              height={ratio ? Math.round(1440 * ratio) : 3600}
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="block h-auto w-full"
              onLoad={(e) =>
                setRatio(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth)
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
