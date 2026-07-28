"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";

/**
 * What I do — three numbered service plates (client direction: replaces the
 * Industries specimen board). Machine-room language on the site's smoke:
 * hairlined glass cards, ghosted display indices, signal-lit marks, a square
 * bullet checklist and a mono CTA riding to contact.
 *
 * Motion (desktop + motion only): the plates pitch up out of the floor in
 * sequence, then each assembles — mark pops, ghost index slides home, the
 * checklist hairline draws and its rows file in. At rest the plates float on
 * desynced bobs (paused offscreen, §9) and tilt toward the pointer like the
 * auditorium walls. SSR markup is the mobile / reduced-motion / no-JS state.
 * PRD §5.8 (revised) · §7.3
 */

const ICONS = {
  code: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="19" cy="5.5" r="2.2" />
      <circle cx="19" cy="18.5" r="2.2" />
      <path d="M7 11l9.8-4.6M7 13l9.8 4.6" />
    </svg>
  ),
  gauge: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 17.5a8 8 0 1 1 16 0" />
      <path d="M12 17.5 16.5 12" strokeWidth="1.8" />
      <circle cx="12" cy="17.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const SERVICES = [
  {
    index: "01",
    icon: "code",
    title: "Full-Stack Web Development",
    body: "Complete production websites, end to end — React or Next.js up front, Node.js and a real data layer behind. Built for businesses that sell, book and quote through them, not for design awards.",
    points: [
      "Clean, handover-ready architecture",
      "Fast on a mid-range phone, on mobile data",
      "SEO and a performance budget from day one",
    ],
  },
  {
    index: "02",
    icon: "api",
    title: "APIs & Integrations",
    body: "REST APIs designed, secured and documented — and wired into whatever the business already runs: payments, mail, storage, authentication.",
    points: [
      "JWT authentication done properly",
      "Documented, testable endpoints",
      "Queries tuned under real load",
    ],
  },
  {
    index: "03",
    icon: "gauge",
    title: "Rebuilds & Performance Rescue",
    body: "Slow, ageing sites moved onto a modern stack without losing traffic or uptime. Measured before, measured after — the numbers are the deliverable.",
    points: [
      "Speed measured, not promised",
      "Migrations without downtime",
      "Mobile-first refinement",
    ],
  },
];

export default function Services() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (!isDesktop || reduceMotion) return;

        const root = rootRef.current;
        const cards = gsap.utils.toArray("[data-card]", root);
        const cleanups = [];

        gsap.set(cards, {
          y: 64,
          autoAlpha: 0,
          rotationX: 8,
          transformPerspective: 900,
        });

        cards.forEach((card, i) => {
          const icon = card.querySelector("[data-svc-icon]");
          const ghost = card.querySelector("[data-svc-ghost]");
          const line = card.querySelector("[data-svc-line]");
          const points = gsap.utils.toArray("[data-svc-point]", card);
          const cta = card.querySelector("[data-svc-cta]");

          gsap.set(icon, { scale: 0.3, autoAlpha: 0 });
          gsap.set(ghost, { x: 28, autoAlpha: 0 });
          gsap.set(line, { scaleX: 0, transformOrigin: "0 50%" });
          gsap.set(points, { x: -16, autoAlpha: 0 });
          gsap.set(cta, { autoAlpha: 0 });

          const tl = gsap
            .timeline({ paused: true, delay: i * 0.15 })
            .to(card, { y: 0, autoAlpha: 1, rotationX: 0, duration: 0.85, ease: "power3.out" }, 0)
            .to(icon, { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(1.8)" }, 0.35)
            .to(ghost, { x: 0, autoAlpha: 1, duration: 0.6, ease: EASE.out }, 0.4)
            .to(line, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 0.45)
            .to(points, { x: 0, autoAlpha: 1, duration: 0.5, ease: EASE.out, stagger: 0.08 }, 0.55)
            .to(cta, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.95);

          ScrollTrigger.create({
            trigger: root.querySelector("ul"),
            start: "top 78%",
            once: true,
            onEnter: () => tl.play(),
          });

          // pointer tilt, walls-style — quickTo so it never fights itself
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
          const onMove = (e) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 7);
            rx(((e.clientY - r.top) / r.height - 0.5) * -6);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });

        // idle float — desynced bobs, asleep whenever the section is (§9)
        const bobs = cards.map((card, i) =>
          gsap.to(card, {
            y: i % 2 ? -6 : 6,
            duration: 3.2 + i * 0.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            paused: true,
            delay: 1.6 + i * 0.3,
          })
        );
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => bobs.forEach((t) => (s.isActive ? t.play() : t.pause())),
        });

        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="py-section-half text-chalk">
      <div className="container space-y-14">
        <div className="space-y-10">
          <SectionHeader
            tone="dark"
            index="05"
            label="SERVICES"
            meta="3 WAYS TO ENGAGE"
          />
          <RevealText as="h2" text="What I do." className="max-w-[10ch] text-h2" />
        </div>

        <ul className="grid grid-cols-1 gap-6 [perspective:1400px] lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li
              key={s.index}
              data-card=""
              className="group relative flex flex-col border border-white/15 bg-white/[0.04] p-7 transition-colors [will-change:transform] hover:border-white/35"
            >
              {/* ghosted display index, the card's registration mark */}
              <span
                data-svc-ghost=""
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-4 font-display text-[4.5rem] leading-none tracking-display text-white/[0.07] transition-colors group-hover:text-white/[0.12]"
              >
                {s.index}
              </span>

              <span
                data-svc-icon=""
                className="flex h-11 w-11 items-center justify-center border border-rule-inv bg-white/[0.05] text-signal"
              >
                {ICONS[s.icon]}
              </span>

              <h3 className="mt-6 max-w-[18ch] text-h3 font-medium leading-snug">
                {s.title}
              </h3>
              <p className="mt-3 text-body leading-relaxed text-chalk-mute">{s.body}</p>

              <ul className="relative mt-6 flex-1 space-y-2.5 pt-5">
                {/* the checklist's hairline draws itself in */}
                <span
                  data-svc-line=""
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full bg-rule-inv"
                />
                {s.points.map((point) => (
                  <li key={point} data-svc-point="" className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] bg-signal"
                    />
                    <span className="text-small leading-relaxed text-chalk">{point}</span>
                  </li>
                ))}
              </ul>

              <MonoLabel as="p" data-svc-cta="" className="mt-7">
                <a href="#contact" className="link-draw">
                  DISCUSS A PROJECT <span aria-hidden="true">↗</span>
                </a>
              </MonoLabel>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
