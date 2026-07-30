"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/useIsDesktop";

/**
 * The gate in front of the Three.js chunk. Nothing loads — not even the
 * import — unless motion is allowed, the device reports at least 4 cores and
 * save-data is off. Fail any and the procedural HeroFallback beneath simply
 * stays, at the same tonal value.
 *
 * Phones used to be excluded outright and got the still SVG while desktop got
 * the moving smoke. That was the wrong axis to gate on: the cost of a
 * full-screen fragment shader is pixels, and a phone held to DPR 1 draws
 * roughly 330k of them against a laptop's 2.6M at DPR 1.5 — about an eighth
 * of the work. The device-class gate below is the honest one; the width is
 * only a hint for how hard to draw (see HeroAtmosphere). PRD §5.12
 *
 * The threshold is `>= 4`, not `> 4`, and the difference is the whole iPhone
 * line. Safari quantises hardwareConcurrency, so a phone reports a round 4 or
 * 6 rather than its true core count — and a cutoff sitting exactly between
 * those two turns "does the smoke run on iOS" into a coin toss per model.
 * Measured with the value overridden: at 4 the old gate mounted no canvas at
 * all. Two-core devices are still excluded, which is the case the gate was
 * actually written for.
 */
const HeroAtmosphere = dynamic(() => import("./HeroAtmosphere"), { ssr: false });

export default function AtmosphereMount() {
  const reduceMotion = usePrefersReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    // navigator.connection does not exist on iOS Safari at all, so the
    // optional chain is load-bearing rather than defensive
    const cores = navigator.hardwareConcurrency ?? 8;
    const saveData = navigator.connection?.saveData === true;
    setCapable(cores >= 4 && !saveData);
  }, []);

  if (reduceMotion || !capable) return null;
  return <HeroAtmosphere />;
}
