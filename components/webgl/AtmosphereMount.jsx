"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/useIsDesktop";

/**
 * The gate in front of the Three.js chunk. Nothing loads — not even the
 * import — unless every condition passes: desktop viewport, motion allowed,
 * more than 4 cores, no save-data. Fail any and the procedural HeroFallback
 * beneath simply stays, at the same tonal value. PRD §5.12
 */
const HeroAtmosphere = dynamic(() => import("./HeroAtmosphere"), { ssr: false });

export default function AtmosphereMount() {
  const isDesktop = useIsDesktop();
  const reduceMotion = usePrefersReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const saveData = navigator.connection?.saveData === true;
    setCapable(cores > 4 && !saveData);
  }, []);

  if (!isDesktop || reduceMotion || !capable) return null;
  return <HeroAtmosphere />;
}
