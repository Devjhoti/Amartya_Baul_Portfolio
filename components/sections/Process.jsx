"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import SectionHeader from "@/components/ui/SectionHeader";
import RevealText from "@/components/ui/RevealText";

/**
 * Four steps as hairlined spec rows — index, name, decision. Animated as a
 * machine gauge (client direction): each row's numeral pops out of a mask,
 * the name and decision slide in, the row's own hairline draws left to
 * right, and a vertical rail beside the list fills with scroll. The step
 * currently crossing the middle of the viewport carries its numeral in
 * signal. All of it desktop + motion only; the SSR rows are the mobile,
 * reduced-motion and no-JS state, untouched. PRD §5.9 · §7.3 · §9
 */
const STEPS = [
  {
    name: "Understand",
    body: "What must the site do for the business, and who actually reads it? A dealer on a phone in a hardware shop is a different reader than a procurement head at a desk. Scope comes from those answers, not from a feature list.",
  },
  {
    name: "Design",
    body: "Structure before decoration: what belongs on each page, in what order, in the client's own material world — spec tables, product data, real photography. No template shopping.",
  },
  {
    name: "Build",
    body: "Next.js, with a performance budget set on day one and checked on a mid-range Android over mobile data — because that is the device most visitors are holding.",
  },
  {
    name: "Ship",
    body: "Deploy, verify against the budget, hand over. Handover includes how to change things, because a site nobody can update starts dying the day it launches.",
  },
];

export default function Process() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        // the whole gauge runs on a phone too — it is masks, slides and a
        // hairline draw, and a phone was getting four flat rows
        if (reduceMotion) return;

        const root = rootRef.current;
        const list = root.querySelector("ol");
        const rows = gsap.utils.toArray("[data-step]", root);

        // the rail — a meter riding the whole list; it only exists on desktop
        const fill = root.querySelector("[data-rail-fill]");
        if (isDesktop && fill) {
          gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
          gsap.to(fill, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 40%", scrub: 0.4 },
          });
        }

        rows.forEach((row) => {
          const num = row.querySelector("[data-step-num]");
          const name = row.querySelector("h3");
          const body = row.querySelector("[data-step-body]");
          const line = row.querySelector("[data-step-line]");

          gsap.set(num, { yPercent: 110 });
          gsap.set(name, { x: -28, autoAlpha: 0 });
          gsap.set(body, { y: 22, autoAlpha: 0 });
          gsap.set(line, { scaleX: 0, transformOrigin: "0 50%" });

          const tl = gsap
            .timeline({ paused: true })
            .to(num, { yPercent: 0, duration: 0.9, ease: EASE.out }, 0)
            .to(name, { x: 0, autoAlpha: 1, duration: 0.7, ease: EASE.out }, 0.12)
            .to(body, { y: 0, autoAlpha: 1, duration: 0.7, ease: EASE.out }, 0.22)
            .to(line, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.1);

          ScrollTrigger.create({
            trigger: row,
            start: "top 82%",
            once: true,
            onEnter: () => tl.play(),
          });

          // the step under the reader's eye carries its numeral in signal
          ScrollTrigger.create({
            trigger: row,
            start: "top 60%",
            end: "bottom 35%",
            onToggle: (s) => row.toggleAttribute("data-active", s.isActive),
          });
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="py-section-half text-chalk">
      <div className="container space-y-14">
        <div className="space-y-10">
          <SectionHeader tone="dark" index="06" label="PROCESS" meta="4 STEPS · EVERY BUILD" />
          <RevealText as="h2" text="The same four steps, every time." className="max-w-[16ch] text-h2" />
        </div>

        <ol className="relative border-t border-rule-inv lg:pl-10">
          {/* the rail — track and scrubbed signal fill, desktop only */}
          <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 hidden w-px bg-rule-inv lg:block">
            <span data-rail-fill="" className="block h-full w-full bg-signal" />
          </span>

          {STEPS.map((step, i) => (
            <li
              key={step.name}
              data-step=""
              className="relative grid grid-cols-1 gap-y-4 py-10 lg:grid-cols-12 lg:gap-x-6"
            >
              {/* the numeral pops out of its own mask */}
              <p aria-hidden="true" className="overflow-hidden lg:col-span-2">
                <span
                  data-step-num=""
                  className="block font-display text-display leading-display tracking-display text-chalk-mute transition-colors duration-500 [[data-active]_&]:text-signal"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </p>
              <h3 className="text-h3 lg:col-span-3 lg:pt-2">{step.name}</h3>
              <p data-step-body="" className="max-w-[58ch] text-body text-chalk-mute lg:col-span-7 lg:pt-2">
                {step.body}
              </p>
              {/* the row's hairline, drawn left to right on arrival */}
              <span
                data-step-line=""
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full bg-rule-inv"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
