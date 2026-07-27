"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/useIsDesktop";
import LiveRig from "./LiveRig";

/**
 * The case study's full-width embed — the same LiveRig, the same lifecycle
 * rules scaled to a single frame: desktop only, mounts 400ms after entering
 * the viewport, unmounts when scrolled away (offscreen work is paused, §9),
 * and a dead frame stays on the poster for the session. Mobile and reduced
 * motion: poster only. PRD §5.5 · §6
 */
export default function CaseEmbed({ project }) {
  const ref = useRef(null);
  const [mount, setMount] = useState(false);
  const [failed, setFailed] = useState(false);
  const isDesktop = useIsDesktop();
  const reduceMotion = usePrefersReducedMotion();
  const allow = isDesktop && !reduceMotion && !failed;

  useEffect(() => {
    if (!allow) {
      setMount(false);
      return;
    }
    const el = ref.current;
    let dwell;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        dwell = setTimeout(() => setMount(true), 400);
      } else {
        clearTimeout(dwell);
        setMount(false);
      }
    });
    io.observe(el);
    return () => {
      clearTimeout(dwell);
      io.disconnect();
    };
  }, [allow]);

  return (
    <div ref={ref}>
      <LiveRig
        project={project}
        mountIframe={mount}
        failed={failed}
        onFail={() => setFailed(true)}
      />
    </div>
  );
}
