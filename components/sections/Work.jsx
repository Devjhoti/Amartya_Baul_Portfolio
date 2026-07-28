"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/useIsDesktop";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";
import ScrambleText from "@/components/ui/ScrambleText";
import TechIcon from "@/components/ui/TechIcon";
import LiveRig from "@/components/work/LiveRig";
import LabelPlate from "@/components/work/LabelPlate";
import ProjectIndex from "@/components/work/ProjectIndex";

/**
 * The machine cinema. A darkened auditorium band: each rig is the screen,
 * pitched back a hair in real perspective, throwing a blurred, mirrored light
 * reflection onto the floor beneath it. The screen-select console floats on
 * the left in 3D, angled toward the screen like a projectionist's panel.
 *
 * The mechanics are unchanged and leak-tested: the stage pins, one viewport of
 * scroll per project, outgoing screen dims, incoming boots. Iframe lifecycle:
 * mount only after 400ms as the active project, hard cap 2 (LRU), evict at two
 * steps away, dead frames never retry. Mobile and reduced motion: no pin, a
 * vertical stack of screens with their reflections — also the no-JS state.
 * PRD §5.4 · §6 · §3.6
 */
export default function Work({ projects }) {
  const stageRef = useRef(null);
  const stRef = useRef(null);
  const idxRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState([]); // LRU of slugs, most recent last
  const [failed, setFailed] = useState([]);
  const [sectorFilter, setSectorFilter] = useState(null);
  const [statusMap, setStatusMap] = useState({});
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

  const handleStatus = useCallback((slug, status) => {
    setStatusMap((m) => (m[slug] === status ? m : { ...m, [slug]: status }));
  }, []);

  // Industries cells filter the index table down here. PRD §5.8
  useEffect(() => {
    window.__filterIndex = (sector) => {
      setSectorFilter((cur) => (cur === sector ? null : sector));
      const el = document.getElementById("project-index");
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el);
      else el.scrollIntoView({ behavior: "smooth" });
    };
    return () => {
      delete window.__filterIndex;
    };
  }, []);

  const numbered = useMemo(
    () => projects.map((p, i) => ({ ...p, no: i + 1 })),
    [projects]
  );
  const indexProjects = sectorFilter
    ? numbered.filter((p) => p.sector === sectorFilter)
    : numbered;

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
          // screen + floor reflection must fit one viewport
          width: "min(88%, calc((100vh - 330px) * 1.6))",
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

        // the auditorium walls: angled toward the screen in real perspective,
        // floating on offset bobs — paused whenever the hall is offscreen (§9)
        const wallL = stage.querySelector("[data-wall-left]");
        const wallR = stage.querySelector("[data-wall-right]");
        if (wallL && wallR) {
          gsap.set(wallL, {
            rotationY: 24,
            transformPerspective: 1100,
            transformOrigin: "left center",
          });
          gsap.set(wallR, {
            rotationY: -24,
            transformPerspective: 1100,
            transformOrigin: "right center",
          });
          const bobs = [
            gsap.to(wallL, { y: 10, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut", paused: true }),
            gsap.to(wallR, { y: -9, duration: 3.9, yoyo: true, repeat: -1, ease: "sine.inOut", paused: true, delay: 0.4 }),
          ];
          ScrollTrigger.create({
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            onToggle: (s) => bobs.forEach((t) => (s.isActive ? t.play() : t.pause())),
          });
        }

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

  const REFLECTION_MASK =
    "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 85%)";

  return (
    <section id="work" className="bg-machine text-chalk">
      <div className="container pt-section-half">
        <div className="space-y-10">
          <SectionHeader
            tone="dark"
            index="02"
            label="SELECTED WORK"
            meta="NOW SHOWING · 11 BUILDS"
          />
          <RevealText
            as="h2"
            text="Live work, running right now."
            className="max-w-[13ch] text-display"
          />
        </div>

        <div ref={stageRef} className="relative mt-16 space-y-24 pb-20 lg:space-y-0 lg:pb-0">
          {projects.map((p) => (
            <div key={p.slug} data-rig="">
              {/* the screen — pitched back a touch, like looking up at it */}
              <div className="[perspective:1400px]">
                <div className="[transform:rotateX(2deg)] [transform-origin:50%_100%]">
                  <LiveRig
                    project={p}
                    priority={false}
                    mountIframe={mounted.includes(p.slug)}
                    failed={failed.includes(p.slug)}
                    onFail={handleFail}
                    onStatus={handleStatus}
                  />
                </div>
              </div>

              {/* mobile has no walls — a slim identity line under the screen */}
              <div className="mt-1 lg:hidden">
                <LabelPlate project={p} />
              </div>

              {/* screen light reflecting off the auditorium floor */}
              <div
                aria-hidden="true"
                className="pointer-events-none relative mt-3 h-24 overflow-hidden opacity-40 lg:h-32"
                style={{ WebkitMaskImage: REFLECTION_MASK, maskImage: REFLECTION_MASK }}
              >
                <Image
                  src={p.poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="-scale-y-100 object-cover object-bottom blur-[5px]"
                />
              </div>
            </div>
          ))}

          {/* left auditorium wall — the full programme, all 11 by name. §5.4 */}
          <div className="pointer-events-none absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 [perspective:1200px] lg:block">
            <div
              data-wall-left=""
              className="pointer-events-auto relative flex min-h-[min(700px,78vh)] w-[280px] flex-col border border-white/20 bg-white/[0.03] px-6 py-6 backdrop-blur-md"
              style={{
                boxShadow:
                  "0 24px 48px -16px rgba(0,0,0,0.7), inset 1px 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <span aria-hidden="true" className="absolute right-0 top-0 h-2 w-2 bg-signal" />
              <div className="flex items-baseline justify-between">
                <MonoLabel className="text-chalk-mute">PROGRAMME</MonoLabel>
                <MonoLabel className="text-chalk">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </MonoLabel>
              </div>
              <ol className="mt-5 flex flex-1 flex-col justify-center gap-2.5 border-t border-rule-inv pt-5">
                {projects.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Go to ${p.client}`}
                      aria-current={i === activeIndex ? "true" : undefined}
                      className={`-mx-2 -my-1 flex w-full items-baseline gap-3 px-2 py-1 text-left font-mono text-mono uppercase tracking-mono transition-colors ${
                        i === activeIndex
                          ? "text-signal"
                          : "text-chalk-mute hover:text-chalk"
                      }`}
                    >
                      <span className="shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="truncate">{p.client}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <MonoLabel className="mt-5 border-t border-rule-inv pt-4 text-chalk-mute">
                SCREEN SELECT — AUDITORIUM 01
              </MonoLabel>
            </div>
          </div>

          {/* right auditorium wall — the spec sheet with tech marks */}
          <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 [perspective:1200px] lg:block">
            <div
              data-wall-right=""
              className="pointer-events-auto relative flex min-h-[min(700px,78vh)] w-[290px] flex-col border border-white/20 bg-white/[0.03] px-6 py-6 backdrop-blur-md"
              style={{
                boxShadow:
                  "0 24px 48px -16px rgba(0,0,0,0.7), inset 1px 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <span aria-hidden="true" className="absolute left-0 top-0 h-2 w-2 bg-signal" />
              <MonoLabel className="text-chalk-mute">SPEC SHEET</MonoLabel>

              {/* the film now playing — name and a line of truth about it */}
              <div className="mt-4 border-t border-rule-inv pt-4">
                <MonoLabel className="text-chalk-mute">ON SCREEN</MonoLabel>
                <p className="mt-2 font-display text-h3 leading-display tracking-display">
                  <ScrambleText text={projects[activeIndex].client} />
                </p>
                <p className="mt-3 text-small leading-relaxed text-chalk-mute">
                  {projects[activeIndex].tagline}
                </p>
              </div>

              <dl className="mt-5 flex-1 space-y-4 border-t border-rule-inv pt-5">
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">SECTOR</MonoLabel>
                  <MonoLabel as="dd" className="mt-1">
                    <ScrambleText text={projects[activeIndex].sector} />
                  </MonoLabel>
                </div>
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">YEAR</MonoLabel>
                  <MonoLabel as="dd" className="mt-1">
                    <ScrambleText text={projects[activeIndex].year} />
                  </MonoLabel>
                </div>
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">TYPE</MonoLabel>
                  <MonoLabel as="dd" className="mt-1">
                    <ScrambleText
                      text={projects[activeIndex].type === "internal" ? "INTERNAL · PKG IT" : "CLIENT · PKG IT"}
                    />
                  </MonoLabel>
                </div>
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">STATUS</MonoLabel>
                  <MonoLabel as="dd" className="mt-1 flex items-center gap-2">
                    {(() => {
                      const s = statusMap[projects[activeIndex].slug] ?? null;
                      const dot =
                        s === "LIVE"
                          ? "bg-signal"
                          : s === "LOADING"
                            ? "animate-pulse bg-signal-dim"
                            : s === "OFFLINE"
                              ? "bg-chalk-mute"
                              : "bg-chalk-mute/40";
                      return (
                        <>
                          <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${dot}`} />
                          {s ?? "STANDBY"}
                        </>
                      );
                    })()}
                  </MonoLabel>
                </div>
              </dl>

              <div className="mt-5 border-t border-rule-inv pt-4">
                <MonoLabel className="text-chalk-mute">BUILT WITH</MonoLabel>
                <ul className="mt-3 space-y-2">
                  {projects[activeIndex].stack.map((tech) => (
                    <li key={tech} className="flex items-center gap-3">
                      <TechIcon name={tech} className="h-4 w-4 shrink-0 text-chalk" />
                      <MonoLabel as="span" className="text-chalk">{tech}</MonoLabel>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-rule-inv bg-concrete py-section-half text-ink">
        <div className="container">
          <ProjectIndex
            projects={indexProjects}
            filter={sectorFilter}
            onClear={() => setSectorFilter(null)}
          />
        </div>
      </div>
    </section>
  );
}
