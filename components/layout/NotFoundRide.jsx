"use client";

import { useRef } from "react";
import DirtBike from "@/components/layout/DirtBike";
import createSmoke from "@/components/layout/preloaderSmoke";
import { gsap, useGSAP, MM } from "@/lib/gsap";

/**
 * The 404's one joke, told in the site's own vocabulary: the preloader's bike
 * rides in, finds nothing here, and rides on. Same SVG, same smoke engine,
 * same physics — the wheels are spun from distance over rolling radius rather
 * than at a chosen speed, so the tyres never scrub against the ground.
 *
 * Reduced motion gets the bike parked on the line with its engine ticking
 * over as a still: the page's meaning does not live in the movement.
 */
export default function NotFoundRide() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { reduceMotion } = ctx.conditions;
        const root = rootRef.current;
        const bike = root.querySelector("[data-bike]");
        const wheelR = bike.querySelector(".bk-wheel-r");
        const wheelF = bike.querySelector(".bk-wheel-f");
        const wheels = [wheelR, wheelF];
        const flash = bike.querySelector(".bk-flash");
        const pipe = bike.querySelector(".bk-exhaust");

        const bikeBox = bike.getBoundingClientRect();
        const bandW = root.clientWidth;
        const tyreR = (bikeBox.width * 26) / 240; // rolling radius, screen px

        // Origins in the SVG's own user units. GSAP measures SVG parts off
        // getBBox, and its default 50% resolves against the bbox corner, not
        // the axle — which spins each wheel a full radius away from its hub.
        gsap.set(wheelR, { svgOrigin: "52 101" });
        gsap.set(wheelF, { svgOrigin: "196 101" });
        gsap.set(flash, { svgOrigin: "191 39" });

        // The wrapper is a plain div, so percentages are honest here: the
        // wheelie pivots on the rear tyre's contact patch, 21.7% across and
        // on the bottom edge, which the viewBox ends exactly at.
        gsap.set(bike, { transformOrigin: "21.7% 99%" });

        if (reduceMotion) {
          gsap.set(bike, { x: bandW * 0.5 - bikeBox.width * 0.5 });
          return;
        }

        const smoke = createSmoke(canvasRef.current, () => {
          const c = canvasRef.current.getBoundingClientRect();
          const r = pipe.getBoundingClientRect();
          return { x: r.left + r.width / 2 - c.left, y: r.top - c.top };
        });

        const startX = -bikeBox.width - 40;
        const restX = Math.max(bandW * 0.42 - bikeBox.width * 0.5, 8);
        const exitX = bandW + 60;

        // one turn of the wheel per circumference travelled — the only honest
        // way to spin them, and the reason the ride reads as weight
        const spin = (from, to) => ((to - from) / (2 * Math.PI * tyreR)) * 360;

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1, defaults: { ease: "none" } });

        tl.set(bike, { x: startX, rotation: 0, y: 0 })
          .set(wheels, { rotation: 0 })
          .set(flash, { opacity: 0 })
          .call(() => smoke?.launch())

          /* ---- in from the left, braking down to the mark */
          .to(bike, { x: restX, duration: 1.25, ease: "power2.out" }, 0)
          .to(wheels, { rotation: spin(startX, restX), duration: 1.25, ease: "power2.out" }, 0)
          .call(() => smoke?.idle(), null, 1.0)
          // the fork compressing as the brakes bite, then coming back up
          .to(bike, { rotation: 2.4, duration: 0.16, ease: "power2.out" }, 1.06)
          .to(bike, { rotation: 0, duration: 0.5, ease: "elastic.out(1,0.45)" }, 1.22)

          /* ---- idling, having found nothing here */
          .to(bike, { y: -2, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 1 }, 1.8)

          /* ---- revs, then the front comes up and it leaves */
          .call(() => smoke?.rev(), null, 3.2)
          .to(flash, { opacity: 1, duration: 0.18 }, 3.35)
          .to(bike, { rotation: -19, duration: 0.34, ease: "power3.out" }, 3.4)
          .call(() => smoke?.launch(), null, 3.6)
          .to(bike, { x: exitX, duration: 0.95, ease: "power2.in" }, 3.62)
          .to(
            wheels,
            { rotation: `+=${spin(restX, exitX)}`, duration: 0.95, ease: "power2.in" },
            3.62
          )
          .to(bike, { rotation: -4, duration: 0.6, ease: "power1.inOut" }, 3.8)
          .to(flash, { opacity: 0, duration: 0.3 }, 4.1)
          .call(() => smoke?.stop(), null, 4.4);

        return () => {
          tl.kill();
          smoke?.destroy();
        };
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      // Taller than the bike on purpose: at 19° the front fender rises most
      // of a wheelbase and must not clip on the way up. Height answers to the
      // viewport's shorter axis as well — on a laptop in a half-height window
      // the page has to fit without the ride sliding under the fold.
      className="relative h-[clamp(110px,min(24vw,22vh),240px)] w-full select-none overflow-hidden border-b border-rule-inv"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div
        data-bike=""
        className="absolute bottom-0 left-0 w-[clamp(140px,26vw,270px)] text-chalk will-change-transform"
      >
        <DirtBike className="block h-auto w-full" />
      </div>
    </div>
  );
}
