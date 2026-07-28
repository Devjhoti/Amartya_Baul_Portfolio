"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import MonoLabel from "@/components/ui/MonoLabel";
import ScrambleText from "@/components/ui/ScrambleText";
import TechIcon from "@/components/ui/TechIcon";

/**
 * The capability orbit — §5.7 redesigned on client direction. Each system
 * (Frontend / Backend / Data / Delivery) is a floating sphere of its tech
 * marks; the four indicators bottom-centre switch systems with a morph
 * (outgoing chips collapse into the core, incoming ones assemble out of it).
 *
 * Deliberately NOT WebGL: the page already runs two scenes (smoke, tornado),
 * and a third context for a handful of chips is waste. This is CSS 3D — one
 * rotating preserve-3d wrapper, each chip counter-rotated every tick so it
 * always faces the viewer (billboard), depth sold by per-chip opacity/scale
 * against its rotated z. ~17 DOM nodes, transforms and opacity only, ticker
 * fully stopped offscreen (§9). Mobile and reduced motion never see this —
 * the spec table in Capabilities.jsx is the fallback and the crawlable truth.
 */

const RADIUS = 190; // px — chip orbit radius inside the ~540px stage
const Y_BAND = 0.62; // squash the poles so small counts never read as a line
const BASE_SPIN = 0.12; // rad/s idle rotation
const AUTO_SECONDS = 7;

/** Fibonacci-ish distribution, banded toward the equator. */
function spherePoints(n) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = (n === 1 ? 0 : 1 - (i / (n - 1)) * 2) * Y_BAND;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const a = golden * i + 0.6;
    return {
      x: Math.cos(a) * ring * RADIUS,
      y: y * RADIUS,
      z: Math.sin(a) * ring * RADIUS,
    };
  });
}

export default function CapabilityOrbit({ groups }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const sphereRef = useRef(null);
  const coreBbRef = useRef(null);
  const barRef = useRef(null);
  const listRef = useRef(null);

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  const activeRef = useRef(0);
  const switchToRef = useRef(null);
  const autoRef = useRef(null);
  const enabledRef = useRef(false);
  const inViewRef = useRef(false);
  const pointerOverRef = useRef(false);

  // One flat chip list, every system pre-positioned — all mounted, only the
  // active set visible, so a morph never re-creates DOM mid-tween.
  const chips = useMemo(
    () =>
      groups.flatMap((g, sys) => {
        const pts = spherePoints(g.items.length);
        return g.items.map((item, i) => ({
          ...item,
          sys,
          key: `${g.group}-${item.name}`,
          pos: pts[i],
        }));
      }),
    [groups]
  );

  const wrapEls = useRef([]);
  const bbEls = useRef([]);
  const visEls = useRef([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        // The orbit is display:none outside desktop/motion (CSS) — no engine.
        if (!isDesktop || reduceMotion) return;
        enabledRef.current = true;

        const stage = stageRef.current;
        const sphere = sphereRef.current;

        /* ---------------- initial visibility: only system 0 assembled */
        chips.forEach((c, i) => {
          gsap.set(visEls.current[i], {
            autoAlpha: c.sys === 0 ? 1 : 0,
            scale: c.sys === 0 ? 1 : 0.2,
          });
        });

        /* ---------------- the spin engine */
        let spin = 0.4;
        let tilt = -0.16;
        let tiltTarget = -0.16;
        let vel = 0;
        let slow = 1;
        let dragging = false;
        let lastX = 0;
        let running = false;

        const tick = (time, deltaMS) => {
          const dt = Math.min(deltaMS, 50) / 1000;
          if (!dragging) spin += BASE_SPIN * slow * dt + vel;
          else spin += vel;
          vel *= 0.93;
          tilt += (tiltTarget - tilt) * Math.min(1, dt * 5);

          sphere.style.transform = `rotateX(${tilt}rad) rotateY(${spin}rad)`;
          if (coreBbRef.current) {
            coreBbRef.current.style.transform = `rotateY(${-spin}rad) rotateX(${-tilt}rad)`;
          }

          const sinS = Math.sin(spin);
          const cosS = Math.cos(spin);
          const sinT = Math.sin(tilt);
          const cosT = Math.cos(tilt);
          for (let i = 0; i < chips.length; i++) {
            if (chips[i].sys !== activeRef.current) continue;
            const { x, y, z } = chips[i].pos;
            // rotateY then rotateX — the same order the sphere transform runs
            const z1 = -x * sinS + z * cosS;
            const z2 = y * sinT + z1 * cosT;
            const n = (z2 / RADIUS + 1) / 2; // 0 back … 1 front
            const bb = bbEls.current[i];
            // depth opacity lives on the SAME element as the billboard
            // transform — opacity < 1 anywhere above it would flatten the
            // preserve-3d chain and render every chip edge-on
            bb.style.opacity = 0.38 + 0.62 * n;
            bb.style.transform =
              `rotateY(${-spin}rad) rotateX(${-tilt}rad) scale(${0.84 + 0.26 * n})`;
          }
        };

        const start = () => {
          if (!running) {
            running = true;
            gsap.ticker.add(tick);
          }
        };
        const stop = () => {
          if (running) {
            running = false;
            gsap.ticker.remove(tick);
          }
        };

        /* ---------------- drag to spin, wheel-free, touch-friendly */
        const onDown = (e) => {
          dragging = true;
          lastX = e.clientX;
          vel = 0;
        };
        const onMove = (e) => {
          const rect = stage.getBoundingClientRect();
          tiltTarget = -0.16 + ((e.clientY - rect.top) / rect.height - 0.5) * -0.22;
          if (!dragging) return;
          const dx = e.clientX - lastX;
          lastX = e.clientX;
          spin += dx * 0.005;
          vel = dx * 0.00035;
        };
        const onUp = () => {
          dragging = false;
        };
        const onEnter = () => {
          pointerOverRef.current = true;
          slow = 0.25;
          autoRef.current?.pause();
        };
        const onLeave = () => {
          pointerOverRef.current = false;
          slow = 1;
          dragging = false;
          tiltTarget = -0.16;
          if (inViewRef.current) autoRef.current?.play();
        };
        stage.addEventListener("pointerdown", onDown);
        stage.addEventListener("pointerenter", onEnter);
        stage.addEventListener("pointerleave", onLeave);
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });

        /* ---------------- the morph between systems */
        let morphing = false;
        switchToRef.current = (next) => {
          const cur = activeRef.current;
          if (next === cur || morphing) return;
          morphing = true;
          const out = chips
            .map((c, i) => (c.sys === cur ? visEls.current[i] : null))
            .filter(Boolean);
          const into = chips
            .map((c, i) => (c.sys === next ? visEls.current[i] : null))
            .filter(Boolean);
          gsap
            .timeline({ onComplete: () => (morphing = false) })
            .to(out, {
              scale: 0.2,
              autoAlpha: 0,
              duration: 0.38,
              ease: "power2.in",
              stagger: 0.03,
            })
            .add(() => {
              activeRef.current = next;
              setActive(next);
            })
            .fromTo(
              into,
              { scale: 0.2, autoAlpha: 0 },
              {
                scale: 1,
                autoAlpha: 1,
                duration: 0.55,
                ease: "back.out(1.6)",
                stagger: 0.05,
              },
              "+=0.04"
            );
        };

        /* ---------------- assemble on first sight; sleep offscreen (§9) */
        const first = chips
          .map((c, i) => (c.sys === 0 ? visEls.current[i] : null))
          .filter(Boolean);
        gsap.set(first, { scale: 0.2, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
          onEnter: () =>
            gsap.to(first, {
              scale: 1,
              autoAlpha: 1,
              duration: 0.6,
              ease: "back.out(1.6)",
              stagger: 0.06,
            }),
        });
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => {
            inViewRef.current = s.isActive;
            if (s.isActive) {
              start();
              if (!pointerOverRef.current) autoRef.current?.play();
            } else {
              stop();
              autoRef.current?.pause();
            }
          },
        });

        return () => {
          stop();
          enabledRef.current = false;
          switchToRef.current = null;
          stage.removeEventListener("pointerdown", onDown);
          stage.removeEventListener("pointerenter", onEnter);
          stage.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };
      });
    },
    { scope: rootRef, dependencies: [chips] }
  );

  // Auto-advance: the hairline under the active indicator fills over 7s, then
  // the next system takes the sphere. Re-armed on every switch; paused while
  // hovered or offscreen; never armed outside the desktop/motion branch.
  useEffect(() => {
    if (!enabledRef.current) return;
    const bar = barRef.current;
    if (!bar) return;
    autoRef.current?.kill();
    autoRef.current = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: AUTO_SECONDS,
        ease: "none",
        paused: !inViewRef.current || pointerOverRef.current,
        onComplete: () => switchToRef.current?.((activeRef.current + 1) % groups.length),
      }
    );
    return () => autoRef.current?.kill();
  }, [active, groups.length]);

  // The readable mirror on the left follows the sphere.
  useEffect(() => {
    if (!enabledRef.current || !listRef.current) return;
    gsap.fromTo(
      listRef.current.children,
      { x: -14, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out", stagger: 0.05 }
    );
  }, [active]);

  const g = groups[active];

  return (
    <div ref={rootRef}>
      <div className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-12 lg:gap-x-6">
        {/* the readable panel — what the sphere is showing, in words */}
        <div className="space-y-7 lg:col-span-4" aria-live="polite">
          <div>
            <MonoLabel className="text-chalk-mute">SYSTEM {String(active + 1).padStart(2, "0")}</MonoLabel>
            <p className="mt-2 font-display text-h2 leading-display tracking-display">
              <ScrambleText text={g.group} />
            </p>
          </div>
          <ul ref={listRef} className="space-y-2.5 border-t border-rule-inv pt-5">
            {g.items.map((item) => (
              <li key={item.name} className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[0.92rem] uppercase tracking-[0.08em] text-chalk">
                  {item.name}
                </span>
                {item.count > 0 ? (
                  <MonoLabel as="span" className="shrink-0 text-chalk-mute">
                    {item.count}/11 BUILDS
                  </MonoLabel>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {/* the sphere — decorative twin of the list, so it stays out of the
            accessibility tree; drag to spin */}
        <div className="lg:col-span-8">
          <div
            ref={stageRef}
            aria-hidden="true"
            className="relative mx-auto aspect-square w-full max-w-[540px] cursor-grab select-none [perspective:1100px] [touch-action:pan-y] active:cursor-grabbing"
          >
            <div
              ref={sphereRef}
              className="absolute inset-0 [transform-style:preserve-3d] [will-change:transform]"
            >
              {/* the core plate at the sphere's heart */}
              <div
                className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <div ref={coreBbRef} className="[will-change:transform]">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <MonoLabel as="span" className="text-chalk-mute">
                      {String(g.items.length).padStart(2, "0")} ITEMS
                    </MonoLabel>
                    <span className="font-display text-h3 leading-display tracking-display text-signal">
                      <ScrambleText text={g.group.toUpperCase()} />
                    </span>
                  </div>
                </div>
              </div>

              {chips.map((c, i) => (
                <div
                  key={c.key}
                  ref={(el) => (wrapEls.current[i] = el)}
                  // preserve-3d on EVERY layer between the perspective root
                  // and the billboard — without it the counter-rotation runs
                  // in a flattened plane and the chips render edge-on
                  className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${c.pos.x}px, ${c.pos.y}px, ${c.pos.z}px)`,
                  }}
                >
                  <div ref={(el) => (bbEls.current[i] = el)} className="[will-change:transform]">
                    <div
                      ref={(el) => (visEls.current[i] = el)}
                      onPointerEnter={() => setHovered(c)}
                      onPointerLeave={() => setHovered(null)}
                      className="flex h-16 w-16 items-center justify-center border border-white/15 bg-[rgba(38,46,41,0.82)] text-chalk transition-colors hover:border-signal hover:text-signal"
                      style={{
                        boxShadow:
                          "0 10px 24px -12px rgba(0,0,0,0.6), inset 1px 1px 0 rgba(255,255,255,0.1)",
                      }}
                    >
                      <TechIcon name={c.name} className="h-7 w-7" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* the readout plate — hovered mark, or the standing instruction */}
            <div className="pointer-events-none absolute bottom-0 left-0">
              <MonoLabel className="text-chalk-mute">
                {hovered
                  ? hovered.count > 0
                    ? `${hovered.name} — ${hovered.count}/11 BUILDS`
                    : hovered.name
                  : "DRAG TO SPIN"}
              </MonoLabel>
            </div>
          </div>
        </div>
      </div>

      {/* the four indicators, bottom centre — the carousel's controls */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {groups.map((grp, i) => (
          <button
            key={grp.group}
            type="button"
            onClick={() => switchToRef.current?.(i)}
            aria-pressed={i === active}
            aria-label={`Show ${grp.group} technologies`}
            className="group relative px-1 pb-3 pt-2 font-mono text-mono uppercase tracking-mono transition-colors"
          >
            <span
              className={
                i === active ? "text-signal" : "text-chalk-mute group-hover:text-chalk"
              }
            >
              {String(i + 1).padStart(2, "0")}&nbsp;&nbsp;{grp.group}
            </span>
            <span className="absolute inset-x-0 bottom-0 h-px bg-rule-inv">
              {i === active ? (
                <span
                  ref={barRef}
                  className="block h-full w-full origin-left scale-x-0 bg-signal"
                />
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
