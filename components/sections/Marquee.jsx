"use client";

import Image from "next/image";
import { gsap, useGSAP, MM } from "@/lib/gsap";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";

/**
 * Trusted By — the only logo marquee on the site, and only on a desktop with
 * motion allowed. Two rows, opposite directions, base speeds 1.0 / 0.82 so
 * they never sync; Lenis scroll velocity drives the timeScale via
 * gsap.quickTo, easing back to base.
 *
 * Phones, reduced motion and no-JS get a still wall instead. The marquee used
 * to run there at a constant speed, and it was the one thing on the page a
 * reader called out as stuttering while they dragged: a translating track is
 * a very wide composited layer, and a phone re-rasters it against the scroll.
 * A wall holds still, costs nothing, and puts all eleven marks on screen at
 * once — which two clipped rows never do at 390px.
 *
 * Clicking a logo jumps to that project in the Live Rig. PKG IT appears once,
 * behind a signal divider, captioned AGENCY. PRD §5.3 · §2.2.1 · §9
 */
const GAP = 64; // matches gap-x-16, keeps the loop seam invisible

function LogoButton({ project, index, clone, box = "h-8 w-28", className = "" }) {
  const jump = () => {
    if (window.__rigJump) {
      window.__rigJump(index);
    } else {
      document.getElementById("work")?.scrollIntoView({
        behavior: window.matchMedia(MM.reduceMotion).matches ? "auto" : "smooth",
      });
    }
  };
  return (
    <button
      type="button"
      onClick={jump}
      tabIndex={clone ? -1 : 0}
      aria-label={`Go to ${project.client} in the work section`}
      className={`group relative block ${className}`}
    >
      <span className={`relative block ${box}`}>
        <Image
          src={project.logo}
          alt={clone ? "" : `${project.client} logo`}
          fill
          sizes="112px"
          className={`object-contain opacity-90 transition-opacity group-hover:opacity-100 ${
            // stopgap: this logo is dark ink on transparent and vanishes on the
            // machine ground — inverted until a light/colour export exists
            project.slug === "anowar-ispat" ? "invert" : ""
          }`}
        />
      </span>
      <MonoLabel
        as="span"
        className="pointer-events-none absolute left-0 top-full mt-3 block whitespace-nowrap text-chalk-mute opacity-0 transition-opacity group-hover:opacity-100"
      >
        {project.client}
      </MonoLabel>
    </button>
  );
}

function RowContent({ projects, agency, clone = false }) {
  return (
    <ul
      aria-hidden={clone || undefined}
      className={`flex flex-wrap items-start gap-x-16 gap-y-12 ${
        clone ? "mq-clone hidden shrink-0" : "shrink-0"
      }`}
    >
      {projects.map((p, i) => (
        <li key={p.slug}>
          <LogoButton project={p} index={i} clone={clone} />
        </li>
      ))}
      {agency ? (
        <>
          <li aria-hidden="true" className="h-8 w-px self-center bg-signal" />
          <li>
            <span className="relative block h-8 w-28">
              <Image
                src={agency.logo}
                alt={clone ? "" : `${agency.name} logo`}
                fill
                sizes="112px"
                className="object-contain opacity-90"
              />
            </span>
            <MonoLabel as="span" className="mt-3 block text-chalk-mute">
              {agency.caption}
            </MonoLabel>
          </li>
        </>
      ) : null}
    </ul>
  );
}

export default function Marquee({ projects, agency }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        // the marquee markup is display:none below lg and under reduced
        // motion, so there is nothing here to drive — and driving it anyway
        // would keep a rAF transform alive against a hidden subtree
        if (reduceMotion || !isDesktop) return;

        const tracks = gsap.utils.toArray("[data-mq-track]", rootRef.current);
        if (tracks.length !== 2) return;

        gsap.set(tracks, {
          flexWrap: "nowrap",
          width: "max-content",
          willChange: "transform",
        });
        gsap.set(rootRef.current.querySelectorAll("[data-mq-track] > ul"), {
          flexWrap: "nowrap",
          paddingRight: GAP,
        });
        gsap.set(".mq-clone", { display: "flex" });

        const row1 = gsap.fromTo(
          tracks[0],
          { xPercent: 0 },
          { xPercent: -50, duration: 28, ease: "none", repeat: -1, paused: true }
        );
        const row2 = gsap.fromTo(
          tracks[1],
          { xPercent: -50 },
          { xPercent: 0, duration: 28, ease: "none", repeat: -1, paused: true }
        );
        row2.timeScale(0.82);

        // Offscreen animations are paused — the marquee only ticks while it is
        // actually in the viewport. PRD §9
        let visible = false;
        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          [row1, row2].forEach((t) => (visible ? t.play() : t.pause()));
        });
        io.observe(rootRef.current);

        // scroll velocity → timeScale, easing back to base. PRD §5.3
        const ts1 = gsap.quickTo(row1, "timeScale", { duration: 0.5, ease: "power2.out" });
        const ts2 = gsap.quickTo(row2, "timeScale", { duration: 0.5, ease: "power2.out" });
        const sample = () => {
          if (!visible) return;
          const v = Math.abs(window.__lenis?.velocity ?? 0);
          const boost = gsap.utils.clamp(0, 2.5, v / 45);
          ts1(1 + boost);
          ts2(0.82 * (1 + boost));
        };
        gsap.ticker.add(sample);

        return () => {
          io.disconnect();
          gsap.ticker.remove(sample);
          gsap.set(tracks, { clearProps: "willChange" });
        };
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="pb-28 pt-10 text-chalk">
      <div className="container space-y-14">
        <SectionHeader
          tone="dark"
          index="01"
          label="TRUSTED BY"
          meta="11 BRANDS · DELIVERED AT PKG IT"
          headingAs="h2"
        />

        {/* Phones, reduced motion and no-JS get a wall instead of a marquee.
            Two rows of a translating track are two very wide composited
            layers, and on a phone they are re-rastered against every scroll
            frame — the strip stutters while the page itself moves fine.
            A wall costs nothing, holds still, and shows all eleven marks at
            once, which on a 390px screen a marquee never does.

            It also fixes what the old fallback did: both rows carry the full
            list, so standing them still showed every logo twice. */}
        <ul className="grid grid-cols-3 items-center gap-x-6 gap-y-9 sm:grid-cols-4 lg:motion-safe:hidden">
          {projects.map((p, i) => (
            // the cell carries the width, the button fills it, the mark
            // centres inside. A content-sized button here collapsed the
            // fill image to nothing and the wall rendered empty.
            <li key={p.slug}>
              <LogoButton project={p} index={i} box="h-7 w-full" className="w-full" />
            </li>
          ))}
        </ul>
        {/* no separate AGENCY plate here: pkg-it is one of the eleven and is
            already in the grid, and the section header two lines up reads
            "11 BRANDS · DELIVERED AT PKG IT". Repeating the mark inside one
            screenful looked like a mistake. The desktop marquee keeps its
            divider, where the rows scroll past and the pairing is not
            visible at once. */}

        <div className="hidden space-y-14 lg:motion-safe:block">
          <div className="overflow-hidden">
            <div data-mq-track="" className="flex">
              <RowContent projects={projects} />
              <RowContent projects={projects} clone />
            </div>
          </div>
          <div className="overflow-hidden">
            <div data-mq-track="" className="flex">
              <RowContent projects={projects} agency={agency} />
              <RowContent projects={projects} agency={agency} clone />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
