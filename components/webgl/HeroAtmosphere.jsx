"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { vertexShader, fragmentShader } from "./shaders/atmosphere";

/**
 * The single Three.js moment on the site: one full-bleed plane, custom shader,
 * fading in over the identical-palette HeroFallback beneath it.
 *
 * Budget discipline (PRD §5.12): 30fps via a delta accumulator, DPR capped at
 * 1.5, powerPreference low-power, render loop fully stopped (rAF cancelled)
 * whenever the hero is off-screen, and full disposal on unmount — geometry,
 * material, renderer, context, observers, listeners.
 *
 * Capability gating lives in AtmosphereMount.jsx — this file assumes it may run.
 */
const FRAME = 1 / 30;

/**
 * How hard to draw. A full-screen fragment shader costs pixels above all, so
 * a phone is held to DPR 1 — at 390 CSS px that is ~330k pixels against a
 * laptop's ~2.6M, and the noise field looks identical at this softness. The
 * frame budget eases off a touch too, since nothing here moves fast enough
 * for 30 against 24 to be visible.
 */
const draw = () => {
  const phone = window.innerWidth < 1024;
  return {
    dpr: Math.min(window.devicePixelRatio || 1, phone ? 1 : 1.5),
    frame: phone ? 1 / 24 : FRAME,
  };
};

export default function HeroAtmosphere() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // The effect OWNS its canvas: created here, removed on cleanup. The
    // teardown force-loses the GL context, and a canvas whose context is lost
    // never hands out another — a React-rendered canvas surviving the effect
    // cycle (StrictMode in dev remounts effects on the same DOM node) left
    // the second run with a dead context and only the static fallback.
    const canvas = document.createElement("canvas");
    canvas.className = "h-full w-full";
    wrap.appendChild(canvas);

    // Context creation can fail on blocked GPUs, remote sessions and headless
    // environments — in that case the procedural fallback beneath simply stays.
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      canvas.remove();
      return;
    }
    const budget = draw();
    renderer.setPixelRatio(budget.dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uRes: { value: new THREE.Vector2(1, 1) },
      },
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const size = () => {
      const { clientWidth: w, clientHeight: h } = wrap;
      renderer.setSize(w, h, false);
      material.uniforms.uRes.value.set(w, h);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(wrap);

    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // pointer → lerped uniform (subtle, almost subliminal). A finger has no
    // hover, so on a touch screen this listener would only ever fire mid-drag
    // — the exact moment there is nothing to spare. Not registered there.
    const target = new THREE.Vector2(0, 0);
    const onPointer = (e) => {
      target.set(e.clientX / window.innerWidth - 0.5, 0.5 - e.clientY / window.innerHeight);
    };
    if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = false;
    let last = 0;
    let acc = 0;
    let elapsed = 0;
    let frozen = false;

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // Held still mid-scroll on touch: the clock stops with the drawing, so
      // it resumes on the exact frame it left rather than jumping forward.
      if (frozen) {
        acc = 0;
        return;
      }
      acc += dt;
      if (acc < budget.frame) return; // frame cap, eased off on phones
      elapsed += acc;
      acc = 0;
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.lerp(target, 0.06);
      renderer.render(scene, camera);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // render only while the hero is actually on screen
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(wrap);

    /**
     * Since this became the site-wide ground it is a fixed layer, so that
     * observer is true from first paint to last and the shader never rests.
     * On a phone that means a full-screen fragment shader competing with the
     * scroll for the whole session — and a scroll is the one thing a reader
     * will notice hitching.
     *
     * So on touch it stands down while the page is actually moving and comes
     * back a beat after it stops. Nothing is lost: at 24fps, drifting this
     * slowly, smoke that holds still for the length of a flick is not
     * something you can see — and freezing the clock rather than the frames
     * means there is no jump when it picks up again.
     */
    let settle = 0;
    const onScroll = () => {
      frozen = true;
      clearTimeout(settle);
      settle = setTimeout(() => {
        frozen = false;
        last = performance.now();
      }, 140);
    };
    if (coarse) window.addEventListener("scroll", onScroll, { passive: true });

    const fade = gsap.fromTo(
      wrap,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      fade.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      canvas.remove();
    };
  }, []);

  return <div ref={wrapRef} aria-hidden="true" className="absolute inset-0" />;
}
