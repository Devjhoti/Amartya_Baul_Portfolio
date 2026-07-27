"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/useIsDesktop";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";
import LiveRig from "@/components/work/LiveRig";
import ProjectIndex from "@/components/work/ProjectIndex";

/**
 * Orchestrates the pin. Desktop: the stage pins, one viewport of scroll per
 * project, outgoing rig scales down and dims, incoming scales up and boots.
 * Persistent NN / 11 counter and a jump list ride the right edge. The iframe
 * lifecycle lives here: a rig may mount its frame only after 400ms as the
 * active project, at most two frames exist (LRU), anything two or more steps
 * from active is evicted, and a dead frame is never retried. Mobile and
 * reduced motion: no pin, no scale, no iframes — a plain vertical stack of
 * posters and label plates, which is also the no-JS state. PRD §5.4 · §6 · §3.6
 */
export default function Work({ projects, chips }) {
  const stageRef = useRef(null);
  const stRef = useRef(null);
  const idxRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState([]); // LRU of slugs, most recent last
  const [failed, setFailed] = useState([]);
  const isDesktop = useIsDesktop();
  const reduceMotion = usePrefersReducedMotion();
  const allowIframe = isDesktop && !reduceMotion;

  const indexOf = useCallback(
    (slug) => projects.findIndex((p) => p.slug === slug),
    [projects]
  );

  // Iframe lifecycle: prune far/failed frames immediately, admit the active
  // project only after a 400ms dwell. Hard cap 2, LRU eviction. PRD §6.2
  useEffect(() => {
    if (!allowIframe) {
      setMounted((m) => (m.length ? [] : m));
      return;
    }
    const prune = (list) =>
      list.filter(
        (slug) => Math.abs(indexOf(slug) - activeIndex) < 2 && !failed.includes(slug)
      );
    setMounted((m) => {
      const next = prune(m);
      return next.length === m.length && next.every((s, i) => s === m[i]) ? m : next;
    });

    const slug = projects[activeIndex].slug;
    if (failed.includes(slug)) return;
    const dwell = setTimeout(() => {
      setMounted((m) => prune([...m.filter((s) => s !== slug), slug]).slice(-2));
    }, 400);
    return () => clearTimeout(dwell);
  }, [activeIndex, allowIframe, failed, projects, indexOf]);

  const handleFail = useCallback((slug) => {
    setFailed((f) => (f.includes(slug) ? f : [...f, slug]));
    setMounted((m) => m.filter((s) => s !== slug));
  }, []);

  // The pin. Everything here exists only in the isDesktop && !reduceMotion
  // branch and reverts wholesale on breakpoint change or unmount.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop: desk, reduceMotion: reduce } = ctx.conditions;
        if (!desk || reduce) return;

        const stage = stageRef.current;
        const rigs = gsap.utils.toArray("[data-rig]", stage);
        if (rigs.length < 2) return;

        gsap.set(stage, { height: "100vh" });
        gsap.set(rigs, {
          position: "absolute",
          left: "50%",
          xPercent: -50,
          top: "50%",
          yPercent: -50,
          width: "min(100%, calc((100vh - 240px) * 1.6))",
          margin: 0,
        });
        gsap.set(rigs.slice(1), { autoAlpha: 0, scale: 0.94 });

        const swapTo = (idx) => {
          const prev = idxRef.current;
          if (idx === prev) return;
          idxRef.current = idx;
          setActiveIndex(idx);
          gsap.set([rigs[prev], rigs[idx]], { willChange: "transform, opacity" });
          gsap.to(rigs[prev], {
            autoAlpha: 0,
            scale: 0.94,
            duration: 0.5,
            ease: EASE.inOut,
            overwrite: "auto",
            onComplete: () => gsap.set(rigs[prev], { clearProps: "willChange" }),
          });
          gsap.fromTo(
            rigs[idx],
            { autoAlpha: 0, scale: 1.05 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.55,
              ease: EASE.out,
              overwrite: "auto",
              onComplete: () => gsap.set(rigs[idx], { clearProps: "willChange" }),
            }
          );
        };

        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: () => "+=" + (projects.length - 1) * window.innerHeight,
          pin: true,
          snap: {
            snapTo: 1 / (projects.length - 1),
            duration: 0.4,
            ease: "power2.inOut",
          },
          onUpdate: (self) =>
            swapTo(Math.round(self.progress * (projects.length - 1))),
        });
        stRef.current = st;
        // The marquee's logo buttons jump straight to a rig. PRD §5.3
        window.__rigJump = jumpTo;

        return () => {
          delete window.__rigJump;
          stRef.current = null;
          idxRef.current = 0;
          setActiveIndex(0);
        };
      });
    },
    { scope: stageRef, dependencies: [projects.length] }
  );

  const jumpTo = (i) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + i * window.innerHeight;
    if (window.__lenis) window.__lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="work" className="bg-concrete py-section-half">
      <div className="container">
        <div className="space-y-10">
          <SectionHeader index="02" label="SELECTED WORK" meta="11 BUILDS · ALL LIVE" />
          <RevealText
            as="h2"
            text="Live work, running right now."
            className="max-w-[13ch] text-display"
          />
        </div>

        <div ref={stageRef} className="relative mt-16 space-y-16 lg:space-y-0">
          {projects.map((p, i) => (
            <div key={p.slug} data-rig="">
              <LiveRig
                project={p}
                chip={chips?.[p.slug]}
                priority={false}
                mountIframe={mounted.includes(p.slug)}
                failed={failed.includes(p.slug)}
                onFail={handleFail}
              />
            </div>
          ))}

          {/* Persistent counter + jump list — pinned mode only. PRD §5.4 */}
          <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
            <MonoLabel className="text-ink-mute">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </MonoLabel>
            <ol className="pointer-events-auto flex flex-col items-end gap-1.5">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`Go to ${p.client}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                    className={`-mx-2 -my-1 px-2 py-1 font-mono text-mono uppercase tracking-mono transition-colors ${
                      i === activeIndex
                        ? "text-ink underline decoration-signal decoration-2 underline-offset-4"
                        : "text-ink-mute hover:text-ink"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-24">
          <ProjectIndex projects={projects} />
        </div>
      </div>
    </section>
  );
}
