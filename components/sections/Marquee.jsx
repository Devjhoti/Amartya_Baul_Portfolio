"use client";

import Image from "next/image";
import { gsap, useGSAP, MM } from "@/lib/gsap";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";

/**
 * Trusted By — the only logo marquee on the site. Two rows, opposite
 * directions, base speeds 1.0 / 0.82 so they never sync. Desktop: Lenis scroll
 * velocity drives the timeline timeScale via gsap.quickTo, easing back to
 * base. Mobile: constant speed. Reduced motion and no-JS: the SSR default is
 * a wrapped, fully visible logo wall — no clones shown, nothing moves.
 * Clicking a logo jumps to that project in the Live Rig. PKG IT appears once,
 * end of row 2, behind a signal divider, captioned AGENCY. PRD §5.3 · §2.2.1
 */
const GAP = 64; // matches gap-x-16, keeps the loop seam invisible

function LogoButton({ project, index, clone }) {
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
      className="group relative block"
    >
      <span className="relative block h-8 w-28">
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
        if (reduceMotion) return; // static wrapped wall

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

        if (isDesktop) {
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
        }
        return () => {
          io.disconnect();
          gsap.set(tracks, { clearProps: "willChange" });
        };
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="bg-machine pb-28 pt-10 text-chalk">
      <div className="container space-y-14">
        <SectionHeader
          tone="dark"
          index="01"
          label="TRUSTED BY"
          meta="11 BRANDS · DELIVERED AT PKG IT"
          headingAs="h2"
        />

        <div className="space-y-14">
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
