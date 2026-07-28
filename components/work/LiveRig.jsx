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

  // Reset the machine when the frame is evicted; fade the poster on LIVE.
  useEffect(() => {
    if (!mountIframe && loaded) setLoaded(false);
  }, [mountIframe, loaded]);

  useEffect(() => {
    const poster = posterRef.current;
    if (!poster) return;
    if (status === "LIVE") {
      gsap.to(poster, { autoAlpha: 0, duration: 0.6, ease: "power2.out" });
    } else {
      gsap.set(poster, { autoAlpha: 1 });
    }
  }, [status]);

  const liveReflection = reflectLive && mountIframe && loaded && !failed;

  return (
    <div>
    <a
      href={project.url}
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
        className="pointer-events-none relative mt-3 h-24 overflow-hidden opacity-40 lg:h-32"
        style={{ WebkitMaskImage: REFLECTION_MASK, maskImage: REFLECTION_MASK }}
      >
        {liveReflection ? (
          <div
            ref={reflWrapRef}
            className="absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left blur-[5px]"
          >
            <iframe
              src={project.url}
              title=""
              tabIndex={-1}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              referrerPolicy="no-referrer"
              className="pointer-events-none h-[920px] w-[1460px] -scale-y-100 border-0"
            />
          </div>
        ) : (
          <Image
            src={project.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="-scale-y-100 object-cover object-bottom blur-[5px]"
          />
        )}
      </div>
    </div>
  );
}
