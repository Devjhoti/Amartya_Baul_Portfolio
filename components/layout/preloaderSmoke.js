/**
 * The preloader's exhaust — a small canvas particle system. Puffs are born at
 * the pipe, drift back and rise with buoyancy and drag, expand and fade. Same
 * chalk the rest of the panel is drawn in, so it reads as smoke in the site's
 * palette rather than a graphic effect.
 *
 * Deliberately tiny: no library, one rAF, a hard cap on live particles, and a
 * single layout read per frame (the emitter's box) done after GSAP has
 * finished writing transforms.
 */
const CAP = 170;
const TINT = "214,219,212"; // --chalk, a shade cooler

export default function createSmoke(canvas, getEmitter) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 1;
  let h = 1;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width || 1;
    h = r.height || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();

  const parts = [];
  let rate = 0; // particles per second from the pipe
  let drift = 0; // extra backward speed, set while the bike is moving
  let raf = 0;
  let last = performance.now();
  let acc = 0;

  const spawn = (x, y, o = {}) => {
    if (parts.length >= CAP) return;
    parts.push({
      x,
      y,
      vx: (o.vx ?? -34 - drift) + (Math.random() - 0.5) * 60,
      vy: (o.vy ?? -46) + (Math.random() - 0.5) * 40,
      r: o.r ?? 4 + Math.random() * 4,
      grow: o.grow ?? 32 + Math.random() * 26,
      max: o.max ?? 0.9 + Math.random() * 0.8,
      // low per-puff alpha: they stack, and a dense stack reads as a bright
      // smear rather than smoke
      a: o.a ?? 0.13,
      life: 0,
    });
  };

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (rate > 0) {
      const e = getEmitter();
      if (e) {
        acc += rate * dt;
        while (acc >= 1) {
          acc -= 1;
          spawn(e.x, e.y);
        }
      }
    }

    ctx.clearRect(0, 0, w, h);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life += dt;
      if (p.life >= p.max) {
        parts.splice(i, 1);
        continue;
      }
      const k = p.life / p.max;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 - 42 * dt; // buoyancy — smoke keeps rising and thins
      const r = p.r + p.grow * k;
      // fade in fast, out slow
      const alpha = p.a * (1 - k) * Math.min(k * 7, 1);
      if (alpha <= 0.002) continue;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `rgba(${TINT},${alpha})`);
      g.addColorStop(1, `rgba(${TINT},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  raf = requestAnimationFrame(frame);
  const onResize = () => size();
  window.addEventListener("resize", onResize);

  return {
    /** ticking over — barely there, as a warm engine at rest actually is */
    idle() {
      rate = 9;
      drift = 0;
    },
    /** held revs — thicker, and it stops drifting away */
    rev() {
      rate = 90;
      drift = 10;
    },
    /** under load, thrown hard behind the bike */
    launch() {
      rate = 150;
      drift = 260;
    },
    stop() {
      rate = 0;
    },
    /** debris kicked sideways out of a contact point */
    burst(x, y, power = 1) {
      const n = Math.round(16 * power);
      for (let i = 0; i < n; i++) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        spawn(x + (Math.random() - 0.5) * 26, y, {
          vx: dir * (60 + Math.random() * 190) * power,
          vy: -(30 + Math.random() * 90) * power,
          r: 1.5 + Math.random() * 2,
          grow: 8 + Math.random() * 12,
          max: 0.4 + Math.random() * 0.4,
          a: 0.18,
        });
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      parts.length = 0;
    },
  };
}
