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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

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

    // pointer → lerped uniform (subtle, almost subliminal)
    const target = new THREE.Vector2(0, 0);
    const onPointer = (e) => {
      target.set(e.clientX / window.innerWidth - 0.5, 0.5 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = false;
    let last = 0;
    let acc = 0;
    let elapsed = 0;

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      acc += dt;
      if (acc < FRAME) return; // 30fps cap
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

    const fade = gsap.fromTo(
      wrap,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
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
