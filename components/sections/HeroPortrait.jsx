"use client";

import { useRef } from "react";
import Image from "next/image";
import MonoLabel from "@/components/ui/MonoLabel";
import { gsap, ScrollTrigger, useGSAP, MM } from "@/lib/gsap";
import { REVEAL_EVENT } from "@/components/ui/RevealText";

/**
 * The hero portrait rig. A machine-enamel backdrop panel (chassis language:
 * square corners, registration marks) that the cutout portrait pops out of,
 * with floating stat plates around it. Depth is real 3D: nested preserve-3d
 * wrappers — an idle "breathing" rotation so the scene reads 3D with no mouse
 * at all, a lerped pointer tilt on top, per-layer translateZ so rotation
 * produces true parallax, and a scrubbed scroll parallax. Desktop gets the
 * full rig; mobile gets the pop-in reveal and a still scene; reduced motion
 * gets everything visible and static. Transforms and opacity only. §7.4 · §9
 */
const MARK = "pointer-events-none absolute h-2 w-2 bg-signal";

function StatCard({ value, label, accent = false, className = "" }) {
  const renderLabel = () => {
    if (typeof label === "string" && label.startsWith("LIVE")) {
      return (
        <>
          <span className="text-signal font-semibold">LIVE</span>
          {label.slice(4)}
        </>
      );
    }
    return label;
  };

  return (
    <div
      data-card=""
      className={`absolute z-20 overflow-hidden border border-white/20 bg-white/[0.015] backdrop-blur-md px-4 py-3 text-chalk [transform-style:preserve-3d] ${className}`}
      style={{
        boxShadow:
          "0 20px 40px -10px rgba(0, 0, 0, 0.65), inset 1px 1px 0px 0px rgba(255, 255, 255, 0.35), inset -1px -1px 0px 0px rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Specular glass reflection overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/5 to-transparent opacity-75"
        style={{
          clipPath: "polygon(0 0, 100% 0, 45% 100%, 0% 100%)",
        }}
      />
      {/* Secondary glass corner sheen highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 bg-gradient-to-tl from-white/15 to-transparent rounded-full blur-sm"
      />

      {accent ? <span aria-hidden="true" className={`${MARK} right-0 top-0 z-30`} /> : null}

      <div className="relative z-10">
        {value ? (
          <p className="font-display text-h3 leading-display tracking-display text-signal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {value}
          </p>
        ) : null}
        <MonoLabel className={`${value ? "mt-1" : ""} text-chalk-mute drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]`}>
          {renderLabel()}
        </MonoLabel>
      </div>
    </div>
  );
}

export default function HeroPortrait({ photo, stats, fact }) {
  const wrapRef = useRef(null);
  const idleRef = useRef(null);
  const tiltRef = useRef(null);
  const panelRef = useRef(null);
  const photoRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (reduceMotion) return; // CSS gate shows the finished scene, static

        const wrap = wrapRef.current;
        const panel = panelRef.current;
        const photoEl = photoRef.current;
        const cards = [...wrap.querySelectorAll("[data-card]")];

        const sig = wrap.querySelector("[data-signature]");

        // initial states first, then unhide the rig (same tick, no flash)
        gsap.set(panel, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(photoEl, { yPercent: 16, scale: 0.92, autoAlpha: 0, z: 50 });
        cards.forEach((c, i) =>
          gsap.set(c, { scale: 0.5, y: 24, autoAlpha: 0, z: 70 + i * 18 })
        );
        // the signature "writes" itself in left to right; it lives inside the
        // photo layer, so position/parallax ride along automatically — only
        // rotation (matching the CSS fallback) and the write-on clip are set
        gsap.set(sig, { rotation: -18, clipPath: "inset(-25% 100% -25% -10%)" });
        gsap.set(wrap, { visibility: "visible" });
        gsap.set([panel, photoEl, ...cards], { willChange: "transform, opacity" });

        const floats = [];
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            gsap.set([panel, photoEl, ...cards], { clearProps: "willChange" });
            if (isDesktop) {
              cards.forEach((c, i) =>
                floats.push(
                  gsap.to(c, {
                    y: `+=${10 + (i % 3) * 4}`,
                    duration: 2.6 + i * 0.45,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: i * 0.35,
                  })
                )
              );
            }
          },
        });
        tl.to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" })
          .to(
            photoEl,
            { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: "back.out(1.4)" },
            "-=0.15"
          )
          .to(
            cards,
            { scale: 1, y: 0, autoAlpha: 1, duration: 0.7, ease: "back.out(2)", stagger: 0.09 },
            "-=0.5"
          )
          .to(
            sig,
            {
              clipPath: "inset(-25% -12% -25% -10%)",
              duration: 0.9,
              ease: "power2.inOut",
              // drop the clip entirely once written — script flourishes (the
              // Baul "l") overflow the text box and must never stay cropped
              onComplete: () => gsap.set(sig, { clearProps: "clipPath" }),
            },
            "-=0.3"
          );

        const play = () => tl.play();
        let fallback = null;
        if (window.__abRevealed) {
          play();
        } else {
          window.addEventListener(REVEAL_EVENT, play, { once: true });
          fallback = setTimeout(play, 3500);
        }

        let teardown = () => {};
        if (isDesktop) {
          // 3D without the mouse: slow breathing rotation
          const idle = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
          idle
            .to(idleRef.current, { rotationY: 4, rotationX: -2.5, duration: 5 })
            .to(idleRef.current, { rotationY: -3, rotationX: 1.5, duration: 5 });

          // pointer tilt, lerped, on the inner wrapper so both compose
          const rx = gsap.quickTo(tiltRef.current, "rotationX", { duration: 0.7, ease: "power3.out" });
          const ry = gsap.quickTo(tiltRef.current, "rotationY", { duration: 0.7, ease: "power3.out" });
          const onMove = (e) => {
            ry((e.clientX / window.innerWidth - 0.5) * 10);
            rx((e.clientY / window.innerHeight - 0.5) * -8);
          };
          window.addEventListener("pointermove", onMove, { passive: true });

          // scroll parallax — layers slide at different rates. Trigger is the
          // hero section from "top top": progress is exactly 0 at load, so the
          // photo sits flush on its panel until the user actually scrolls.
          const scrub = gsap.timeline({
            scrollTrigger: {
              trigger: wrap.closest("section") ?? wrap,
              start: "top top",
              end: "bottom top",
              scrub: 0.4,
            },
          });
          scrub
            .to(photoEl, { yPercent: -9 }, 0)
            .to(cards, { yPercent: -26, stagger: 0.05 }, 0)
            .to(panel, { yPercent: 7 }, 0);

          // offscreen: everything continuous pauses. §9
          const io = new IntersectionObserver(([entry]) => {
            const on = entry.isIntersecting;
            [idle, ...floats].forEach((t) => (on ? t.play() : t.pause()));
          });
          io.observe(wrap);

          teardown = () => {
            window.removeEventListener("pointermove", onMove);
            io.disconnect();
          };
        }

        return () => {
          if (fallback) clearTimeout(fallback);
          window.removeEventListener(REVEAL_EVENT, play);
          teardown();
        };
      });
    },
    { scope: wrapRef }
  );

  return (
    <div
      ref={wrapRef}
      data-st-hide=""
      className="relative mx-auto w-full max-w-[400px] [perspective:1100px] lg:max-w-[460px]"
    >
      <div ref={idleRef} className="[transform-style:preserve-3d]">
        <div ref={tiltRef} className="relative [transform-style:preserve-3d]">
          {/* the custom backdrop the portrait pops out of — chassis language */}
          <div
            ref={panelRef}
            className="absolute inset-x-3 bottom-0 top-[18%] border border-rule-inv bg-machine-2"
          >
            <span aria-hidden="true" className={`${MARK} left-0 top-0`} />
            <span aria-hidden="true" className={`${MARK} right-0 top-0`} />
            <span aria-hidden="true" className={`${MARK} bottom-0 left-0`} />
            <span aria-hidden="true" className={`${MARK} bottom-0 right-0`} />
            <MonoLabel className="absolute bottom-3 right-4 text-chalk-mute">
              OPERATOR — DHAKA, BD
            </MonoLabel>
          </div>

          <div ref={photoRef} className="relative z-10 w-full max-w-full px-7 sm:px-9">
            <Image
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt="Amartya Baul"
              priority
              quality={92}
              sizes="(min-width: 1024px) 460px, 85vw"
              className="h-auto w-full max-w-full"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            {/* signature — a child of the photo layer, so it pops, tilts and
                parallaxes as one body with the portrait; the layered glow keeps
                every letter bright over the jacket */}
            <p
              data-signature=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[4%] right-0 z-20 whitespace-nowrap font-script text-[2.6rem] leading-none text-chalk sm:text-[3rem] [transform:rotate(-18deg)]"
              style={{
                textShadow:
                  "0 2px 12px rgba(0,0,0,0.9), 0 0 6px rgba(232,234,229,0.55), 0 0 24px rgba(232,234,229,0.35)",
              }}
            >
              Amartya Baul
            </p>
          </div>

          <StatCard
            value={stats[0]?.value}
            label={stats[0]?.label}
            accent
            className="-left-3 top-[22%] sm:-left-16"
          />
          <StatCard
            value={stats[2]?.value}
            label={stats[2]?.label}
            className="-right-3 top-[7%] sm:-right-16"
          />
          <StatCard
            value={stats[1]?.value}
            label={stats[1]?.label}
            className="-left-4 bottom-[6%] sm:-left-20"
          />
          <StatCard
            label={fact}
            className="-right-3 bottom-[30%] hidden max-w-[170px] sm:-right-20 sm:block"
          />

        </div>
      </div>
    </div>
  );
}
