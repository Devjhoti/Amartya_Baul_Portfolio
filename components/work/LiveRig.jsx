"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import RigChassis from "./RigChassis";

/**
 * The three-state machine. POSTER is the default and the permanent fallback;
 * BOOTING mounts the iframe behind the still-visible poster (LED LOADING);
 * LIVE fades the poster out (LED LIVE). A frame that hasn't loaded within 6s
 * is reported dead — the parent evicts it, the LED goes OFFLINE, the poster
 * stays, permanently for the session. The iframe renders at a logical
 * 1440×900 and is scaled to the chassis by a ResizeObserver. Clicking the rig
 * opens the real site. PRD §6.2 · §3.6
 */
const BOOT_TIMEOUT = 6000;

/**
 * Falloff away from the contact line. A real reflection is at its strongest
 * where the object meets the floor and dies quickly — the drop is closer to
 * exponential than linear, because the floor scatters more of the ray the
 * further it has to travel across it. Four stops approximate that curve: most
 * of the strength is gone within a quarter of the band, then a long thin tail
 * instead of a straight ramp to nothing.
 */
const REFLECTION_MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.42) 22%, rgba(0,0,0,0.13) 55%, transparent 92%)";

export default function LiveRig({
  project,
  mountIframe,
  failed,
  priority,
  onFail,
  onStatus,
  reflectLive = false,
}) {
  const screenRef = useRef(null);
  const frameWrapRef = useRef(null);
  const reflWrapRef = useRef(null);
  const posterRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  // `loaded` says the frame has finished; `shown` says it may be painted.
  // Guest sites reach for focus as they come up, and focusing something inside
  // a frame scrolls every ancestor to reveal it — this document included, so
  // the page flinched twice per screen change. Nothing inside a
  // visibility:hidden frame is focusable, so holding it dark across the boot
  // (behind the poster, which is opaque anyway) removes the flinch at source
  // rather than yanking the scroll back afterwards. §6.2
  const [shown, setShown] = useState(false);
  const [reflLoaded, setReflLoaded] = useState(false);
  const [reflShown, setReflShown] = useState(false);

  const status = failed
    ? "OFFLINE"
    : mountIframe
      ? loaded
        ? "LIVE"
        : "LOADING"
      : null;

  // the auditorium walls display the status LED now that the plate is gone
  useEffect(() => {
    onStatus?.(project.slug, status);
  }, [status, project.slug, onStatus]);

  // Scale the logical 1440×900 frame to the real chassis width.
  useEffect(() => {
    if (!mountIframe) return;
    const screen = screenRef.current;
    const wrap = frameWrapRef.current;
    if (!screen || !wrap) return;
    const fit = () => {
      const t = `scale(${screen.clientWidth / 1440})`;
      wrap.style.transform = t;
      if (reflWrapRef.current) reflWrapRef.current.style.transform = t;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(screen);
    return () => ro.disconnect();
  }, [mountIframe, loaded, reflectLive]);

  // Boot watchdog: no load event within 6s → dead, poster forever.
  useEffect(() => {
    if (!mountIframe || loaded) return;
    const t = setTimeout(() => onFail(project.slug), BOOT_TIMEOUT);
    return () => clearTimeout(t);
  }, [mountIframe, loaded, project.slug, onFail]);

  // Reset the machine when the frame is evicted.
  useEffect(() => {
    if (!mountIframe && loaded) setLoaded(false);
    if (!mountIframe && shown) setShown(false);
  }, [mountIframe, loaded, shown]);

  // Let the guest settle past its own load handlers before it is painted —
  // and only then start the poster's dissolve, so the two stay in step.
  useEffect(() => {
    if (!loaded || failed) return;
    const t = setTimeout(() => setShown(true), 260);
    return () => clearTimeout(t);
  }, [loaded, failed]);

  useEffect(() => {
    const poster = posterRef.current;
    if (!poster) return;
    if (shown) {
      gsap.to(poster, { autoAlpha: 0, duration: 0.6, ease: "power2.out" });
    } else {
      gsap.set(poster, { autoAlpha: 1 });
    }
  }, [shown]);

  const liveReflection = reflectLive && mountIframe && shown && !failed;

  // the floor's mirror is a second document of the same site, so it reaches
  // for focus a second time — held dark across its own boot too
  useEffect(() => {
    if (!liveReflection) {
      setReflLoaded(false);
      setReflShown(false);
      return;
    }
    if (!reflLoaded) return;
    const t = setTimeout(() => setReflShown(true), 260);
    return () => clearTimeout(t);
  }, [liveReflection, reflLoaded]);

  return (
    <div>
    <a
      // the frame shows what it is allowed to embed; the link goes to the
      // site's own address when those differ
      href={project.siteUrl ?? project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="OPEN ↗"
      aria-label={`${project.client} — open live site`}
      className="block"
    >
      <RigChassis
        screen={
          <div ref={screenRef} className="absolute inset-0">
            {mountIframe ? (
              <div
                ref={frameWrapRef}
                className="absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left"
              >
                {/* drawn 20px oversize each way — the guest site's scrollbars
                    fall outside the clipped 1440×900 screen */}
                <iframe
                  src={project.url}
                  title={project.client}
                  tabIndex={-1}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  referrerPolicy="no-referrer"
                  className="pointer-events-none h-[920px] w-[1460px] border-0 bg-machine-2"
                  style={{ visibility: shown ? "visible" : "hidden" }}
                  onLoad={() => setLoaded(true)}
                />
              </div>
            ) : null}
            <div ref={posterRef} className="absolute inset-0 z-10">
              <Image
                src={project.poster}
                alt={`${project.client} — ${project.sector} website`}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 72vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        }
      />
    </a>

      {/* Light off the auditorium floor.
       *
       * What the floor sees is the whole machine, not the picture on it. The
       * bezel stands between the screen and the floor, so the bezel — and its
       * registration marks — is the first thing reflected, and the screen's
       * bottom rows follow behind it. The old mirror showed the picture
       * alone, floating 12px clear of the chassis on a margin, which is why
       * it never read as a reflection: nothing reflects with a gap under it,
       * and nothing reflects its own middle first.
       *
       * The stage's perspective is inherited rather than recomputed, and that
       * is right here: a mirror in a horizontal floor preserves yaw, and yaw
       * is all this chassis has.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative h-14 overflow-hidden sm:h-20 lg:h-32"
        style={{ WebkitMaskImage: REFLECTION_MASK, maskImage: REFLECTION_MASK }}
      >
        {/* Two explicit boxes rather than one clever one. The flipper is
            exactly the band, so scaleY(-1) about its centre swaps its top and
            bottom edges; the copy is anchored to the flipper's BOTTOM, and
            that swap lands it on the band's top — the contact line — with the
            copy's own bottom edge against it and the rest running downward.
            Written this way because neither box has an implicit height: the
            alternative hangs an auto-height, aspect-ratio chassis above the
            band on `bottom:100%` and asks the pivot to resolve against it. */}
        <div className="absolute inset-0 -scale-y-100 opacity-[0.3] blur-[3px]">
          <div className="absolute inset-x-0 bottom-0">
            <RigChassis
              screen={
                <div className="absolute inset-0">
                  {/* the poster's mirror is the floor's base coat; the live
                      one paints over it once up, so the floor never blanks
                      mid-swap. Neither is flipped itself — the pivot above
                      does it once, for the whole machine. */}
                  <Image
                    src={project.poster}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                  {liveReflection ? (
                    <div
                      ref={reflWrapRef}
                      className="absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left"
                      style={{ visibility: reflShown ? "visible" : "hidden" }}
                    >
                      <iframe
                        src={project.url}
                        title=""
                        tabIndex={-1}
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                        referrerPolicy="no-referrer"
                        className="pointer-events-none h-[920px] w-[1460px] border-0"
                        onLoad={() => setReflLoaded(true)}
                      />
                    </div>
                  ) : null}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
