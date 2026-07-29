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

const REFLECTION_MASK = "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 85%)";

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

      {/* light off the auditorium floor — a live mirror of the running frame
          for the active screen (one extra document at most), the poster's
          mirror otherwise */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mt-3 h-14 overflow-hidden opacity-40 sm:h-20 lg:h-32"
        style={{ WebkitMaskImage: REFLECTION_MASK, maskImage: REFLECTION_MASK }}
      >
        {/* the poster's mirror is the floor's base coat; the live one paints
            over it once it is up, so the floor never blanks mid-swap */}
        <Image
          src={project.poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="-scale-y-100 object-cover object-bottom blur-[5px]"
        />
        {liveReflection ? (
          <div
            ref={reflWrapRef}
            className="absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left blur-[5px]"
            style={{ visibility: reflShown ? "visible" : "hidden" }}
          >
            <iframe
              src={project.url}
              title=""
              tabIndex={-1}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              referrerPolicy="no-referrer"
              className="pointer-events-none h-[920px] w-[1460px] -scale-y-100 border-0"
              onLoad={() => setReflLoaded(true)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
