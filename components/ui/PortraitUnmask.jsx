"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MM } from "@/lib/gsap";

/**
 * The About photo treatment: duotone (machine ground + luminosity blend) with
 * the original colour revealed inside a soft-edged 180px circle that follows
 * the cursor. Desktop only — mobile and reduced motion keep the static
 * duotone, which is also the SSR state. The soft edge is a mask feather, not
 * a painted gradient. PRD §5.6 · §7.3
 */
const MASK =
  "radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), #000 62%, transparent 100%)";

export default function PortraitUnmask({ src, alt, sizes }) {
  const wrapRef = useRef(null);
  const layerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions;
        if (!isDesktop || reduceMotion) return;

        const wrap = wrapRef.current;
        const layer = layerRef.current;
        const pos = { x: 50, y: 50 };
        const apply = () => {
          layer.style.setProperty("--mx", `${pos.x}%`);
          layer.style.setProperty("--my", `${pos.y}%`);
        };

        const onMove = (e) => {
          const r = wrap.getBoundingClientRect();
          gsap.to(pos, {
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: apply,
          });
        };
        const onEnter = (e) => {
          onMove(e);
          gsap.to(layer, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
        };
        const onLeave = () => gsap.to(layer, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });

        wrap.addEventListener("pointerenter", onEnter);
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);
        return () => {
          wrap.removeEventListener("pointerenter", onEnter);
          wrap.removeEventListener("pointermove", onMove);
          wrap.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="relative aspect-[4/5] w-full max-w-[420px] mx-auto lg:mx-0 overflow-hidden bg-machine">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover grayscale mix-blend-luminosity"
      />
      <div
        ref={layerRef}
        aria-hidden="true"
        className="absolute inset-0 opacity-0"
        style={{ WebkitMaskImage: MASK, maskImage: MASK }}
      >
        <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}
