"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
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
import Faq from "@/components/sections/Faq";

// Three.js stays out of the main bundle — same treatment as the hero rig. The
// index band's black CSS ground is the no-JS / no-WebGL fallback. §9
const Vortex = dynamic(() => import("@/components/ui/Vortex"), { ssr: false });

/**
 * The machine cinema. A darkened auditorium band: each rig is the screen,
 * pitched back a hair in real perspective, throwing a blurred, mirrored light
 * reflection onto the floor beneath it. The screen-select console floats on
 * the left in 3D, angled toward the screen like a projectionist's panel.
 *
 * The stage does NOT pin (client direction): it is one viewport the page
 * scrolls straight past, and the programme wall is the only way to change
 * screens — a click swaps the active one. Iframe lifecycle is unchanged and
 * leak-tested: mount only after 400ms as the active project, hard cap 2
 * (LRU), evict at two steps away, dead frames never retry. Mobile and reduced
 * motion: a vertical stack of screens with their reflections — also the no-JS
 * state. PRD §5.4 · §6 · §3.6
 */
export default function Work({ projects }) {
  const stageRef = useRef(null);
  const swapRef = useRef(null);
  const idxRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState([]); // LRU of slugs, most recent last
  const [failed, setFailed] = useState([]);
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

  // Guest sites steal their host's scroll as they boot: a focus() or a
  // scrollIntoView inside a frame scrolls every ancestor, this document
  // included, so picking a screen off the programme wall dragged the reader
  // down the page ~1.8s later (and again when the reflection frame loaded).
  // While a frame is booting, hold them where they are — released the instant
  // they scroll, or reach for anything but the wall, themselves.
  useEffect(() => {
    if (!allowIframe || !mounted.length) return;
    const anchor = window.scrollY;
    let armed = true;
    const release = () => {
      armed = false;
    };
    // reaching for anything but the wall counts as taking the wheel back —
    // both events, since a scripted click fires no pointerdown
    const onReach = (e) => {
      if (!e.target?.closest?.("[data-wall-left]")) release();
    };
    const onScroll = () => {
      if (!armed || Math.abs(window.scrollY - anchor) < 2) return;
      if (window.__lenis) window.__lenis.scrollTo(anchor, { immediate: true, force: true });
      else window.scrollTo(0, anchor);
    };
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", release);
    window.addEventListener("pointerdown", onReach, true);
    window.addEventListener("click", onReach, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    const off = setTimeout(release, 6000);
    return () => {
      clearTimeout(off);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
      window.removeEventListener("pointerdown", onReach, true);
      window.removeEventListener("click", onReach, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted, allowIframe]);

  const handleFail = useCallback((slug) => {
    setFailed((f) => (f.includes(slug) ? f : [...f, slug]));
    setMounted((m) => m.filter((s) => s !== slug));
  }, []);

  const handleStatus = useCallback((slug, status) => {
    setStatusMap((m) => (m[slug] === status ? m : { ...m, [slug]: status }));
  }, []);

  // The stage. Everything here exists only in the isDesktop && !reduceMotion
  // branch and reverts wholesale on breakpoint change or unmount. No pin —
  // the programme wall's clicks are the one way to change screens.
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

        // Panel clicks land here; the marquee's logo buttons additionally
        // bring the auditorium into view first. PRD §5.3
        swapRef.current = swapTo;
        window.__rigJump = (i) => {
          if (window.__lenis) window.__lenis.scrollTo(stage);
          else stage.scrollIntoView({ behavior: "smooth" });
          swapTo(i);
        };

        // the auditorium walls: angled toward the screen in real perspective,
        // floating on offset bobs — paused whenever the hall is offscreen (§9)
        const wallL = stage.querySelector("[data-wall-left]");
        const wallR = stage.querySelector("[data-wall-right]");
        if (wallL && wallR) {
          gsap.set(wallL, {
            rotationY: 26,
            transformPerspective: 1200,
            transformOrigin: "left center",
          });
          gsap.set(wallR, {
            rotationY: -26,
            transformPerspective: 1200,
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

        // The rigs just collapsed from a stacked column into one absolute
        // viewport — everything below the stage moved up by ~10 screens, and
        // any trigger that measured itself before this (the FAQ, contact)
        // would wait forever at its stale position. The pinned version got
        // this refresh for free from the pin; without one it is explicit.
        ScrollTrigger.refresh();

        return () => {
          delete window.__rigJump;
          swapRef.current = null;
          idxRef.current = 0;
          setActiveIndex(0);
        };
      });
    },
    { scope: stageRef, dependencies: [projects.length] }
  );

  const jumpTo = (i) => swapRef.current?.(i);

  return (
    <section id="work" className="text-chalk">
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
      </div>

      {/* the auditorium is full-bleed: the walls run from the viewport edges
          to the screen edges, exactly the marked trapezoids */}
      <div
        ref={stageRef}
        className="relative mt-16 space-y-24 px-[var(--page-margin)] pb-20 lg:space-y-0 lg:px-0 lg:pb-0"
      >
          {projects.map((p, i) => (
            <div key={p.slug} data-rig="">
              {/* the screen — pitched back a touch, like looking up at it */}
              <div className="[perspective:1400px]">
                <div className="[transform:rotateX(2deg)] [transform-origin:50%_100%]">
                  <LiveRig
                    project={p}
                    priority={false}
                    mountIframe={mounted.includes(p.slug)}
                    failed={failed.includes(p.slug)}
                    reflectLive={i === activeIndex}
                    onFail={handleFail}
                    onStatus={handleStatus}
                  />
                </div>
              </div>

              {/* mobile has no walls — a slim identity line under the screen */}
              <div className="mt-1 lg:hidden">
                <LabelPlate project={p} />
              </div>
            </div>
          ))}

          {/* left auditorium wall — the full programme, all 11 by name. §5.4 */}
          <div className="pointer-events-none absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 [perspective:1200px] lg:block">
            <div
              data-wall-left=""
              className="pointer-events-auto relative flex h-[86vh] w-[calc((100vw-min(88vw,(100vh-330px)*1.6))/2+34px)] min-w-[270px] flex-col border border-white/20 bg-white/[0.03] px-6 py-7 backdrop-blur-md"
              style={{
                boxShadow:
                  "0 24px 48px -16px rgba(0,0,0,0.7), inset 1px 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <span aria-hidden="true" className="absolute right-0 top-0 h-2 w-2 bg-signal" />
              <div className="flex items-baseline justify-between">
                <MonoLabel as="span" className="text-[0.85rem] text-chalk-mute">
                  PROGRAMME
                </MonoLabel>
                <MonoLabel as="span" className="text-[0.85rem] text-chalk">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </MonoLabel>
              </div>
              {/* every film by name AND mark — big enough to read across an
                  auditorium, click to put it on screen */}
              <ol className="mt-4 flex flex-1 flex-col justify-evenly border-t border-rule-inv pt-3">
                {projects.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Show ${p.client} on screen`}
                      aria-current={i === activeIndex ? "true" : undefined}
                      className={`-mx-2 flex w-full items-center gap-3 px-2 py-1.5 text-left transition-colors ${
                        i === activeIndex
                          ? "text-signal"
                          : "text-[rgba(232,234,229,0.85)] hover:text-chalk"
                      }`}
                    >
                      <span className="shrink-0 font-mono text-mono tracking-mono text-chalk-mute">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`relative h-7 w-9 shrink-0 ${
                          // dark-ink logo, invisible on the machine ground —
                          // inverted until a light/colour export exists
                          p.slug === "anowar-ispat" ? "invert" : ""
                        }`}
                      >
                        <Image
                          src={p.logo}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-contain object-left"
                        />
                      </span>
                      <span className="truncate font-mono text-[0.92rem] uppercase tracking-[0.06em]">
                        {p.client}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <MonoLabel className="mt-3 border-t border-rule-inv pt-4 text-chalk-mute">
                SCREEN SELECT — AUDITORIUM 01
              </MonoLabel>
            </div>
          </div>

          {/* right auditorium wall — the spec sheet with tech marks */}
          <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 [perspective:1200px] lg:block">
            <div
              data-wall-right=""
              className="pointer-events-auto relative flex h-[86vh] w-[calc((100vw-min(88vw,(100vh-330px)*1.6))/2+34px)] min-w-[280px] flex-col border border-white/20 bg-white/[0.03] px-6 py-7 backdrop-blur-md"
              style={{
                boxShadow:
                  "0 24px 48px -16px rgba(0,0,0,0.7), inset 1px 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <span aria-hidden="true" className="absolute left-0 top-0 h-2 w-2 bg-signal" />
              <MonoLabel className="text-[0.85rem] text-chalk-mute">SPEC SHEET</MonoLabel>

              {/* the film now playing — name and a line of truth about it */}
              <div className="mt-3 border-t border-rule-inv pt-4">
                <MonoLabel className="text-chalk-mute">ON SCREEN</MonoLabel>
                <p className="mt-2 font-display text-h2 leading-display tracking-display">
                  <ScrambleText text={projects[activeIndex].client} />
                </p>
                <p className="mt-3 text-body leading-relaxed text-[rgba(232,234,229,0.9)]">
                  {projects[activeIndex].tagline}
                </p>
              </div>

              <dl className="mt-4 flex flex-1 flex-col justify-evenly border-t border-rule-inv pt-3">
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">SECTOR</MonoLabel>
                  <dd className="mt-1 font-mono text-[1rem] uppercase tracking-[0.08em] text-chalk">
                    <ScrambleText text={projects[activeIndex].sector} />
                  </dd>
                </div>
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">YEAR</MonoLabel>
                  <dd className="mt-1 font-mono text-[1rem] uppercase tracking-[0.08em] text-chalk">
                    <ScrambleText text={projects[activeIndex].year} />
                  </dd>
                </div>
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">TYPE</MonoLabel>
                  <dd className="mt-1 font-mono text-[1rem] uppercase tracking-[0.08em] text-chalk">
                    <ScrambleText
                      text={projects[activeIndex].type === "internal" ? "INTERNAL · PKG IT" : "CLIENT · PKG IT"}
                    />
                  </dd>
                </div>
                <div>
                  <MonoLabel as="dt" className="text-chalk-mute">STATUS</MonoLabel>
                  <dd className="mt-1 flex items-center gap-2.5 font-mono text-[1rem] uppercase tracking-[0.08em] text-chalk">
                    {(() => {
                      const s = statusMap[projects[activeIndex].slug] ?? null;
                      const dot =
                        s === "LIVE"
                          ? "bg-signal"
                          : s === "LOADING"
                            ? "animate-pulse bg-signal-dim"
                            : s === "OFFLINE"
                              ? "bg-chalk-mute"
                              : "bg-[rgba(150,160,152,0.4)]";
                      return (
                        <>
                          <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} />
                          {s ?? "STANDBY"}
                        </>
                      );
                    })()}
                  </dd>
                </div>
              </dl>

              {/* marks only, side by side, lit in signal — names live in the
                  title tooltip and for screen readers */}
              <div className="mt-4 border-t border-rule-inv pt-4">
                <MonoLabel className="text-chalk-mute">BUILT WITH</MonoLabel>
                <ul className="mt-3 flex flex-wrap gap-2.5">
                  {projects[activeIndex].stack.map((tech) => (
                    <li
                      key={tech}
                      title={tech}
                      className="flex h-11 w-11 items-center justify-center border border-rule-inv bg-white/[0.05] text-signal transition-colors hover:border-signal"
                    >
                      <TechIcon name={tech} className="h-6 w-6" />
                      <span className="sr-only">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
      </div>

      {/* the FAQ band — the tornado turns behind it on a TRANSPARENT ground,
          its strands tinted to the smoke's own greens so the two read as one
          weather system, not a black poster pasted into the page */}
      <div className="relative flex min-h-dvh flex-col justify-center overflow-hidden border-t border-rule-inv py-section-half text-chalk">
        <div aria-hidden="true" className="absolute inset-0">
          <Vortex
            background="transparent"
            topRadius={380}
            waistRadius={53}
            waistPosition={50}
            bottomRadius={1150}
            twist={3}
            zoom={75}
            speed={10}
            direction="right"
            dots
            dotOptions={{ count: isDesktop ? 8000 : 2200, color: "#d7e0da" }}
            comets
            cometOptions={{ color: "#E5C11F" }}
            lineOptions={{ count: isDesktop ? 240 : 120, glow: 7, color: "#96a098" }}
          />
          {/* machine-toned scrims, not black: a faint veil plus a deeper pool
              over the funnel's core — the answers stay readable dead centre
              while the band's edges dissolve into the site's smoke */}
          {/* arbitrary rgba, not bg-machine/30 — Tailwind v3 cannot put an
              alpha on a var()-defined token and drops the class silently */}
          <div className="absolute inset-0 bg-[rgba(28,34,30,0.3)]" />
          <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_70%_at_50%_55%,rgba(16,20,17,0.62),transparent_74%)]" />
        </div>
        <div className="container relative z-10">
          <Faq />
        </div>
      </div>
    </section>
  );
}
