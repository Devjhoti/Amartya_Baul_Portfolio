/**
 * The site's sound, synthesised rather than sampled — no mp3s to download, no
 * licence to carry, and the whole layer weighs less than one short sample.
 * It is the same reasoning behind the drawn monogram and the drawn bike.
 *
 * Off by default and always off until asked. Nothing here creates an
 * AudioContext until the visitor has turned sound on with a real click, so
 * the page never trips a browser's autoplay policy and never pays for an
 * audio graph it was not going to use.
 *
 * The palette is deliberately dry: short filtered noise for contact sounds,
 * quiet sines for state changes. A portfolio that chimes is a portfolio
 * people mute.
 */
const KEY = "ab:sound";
const MASTER = 0.09;

let ctx = null;
let bus = null;
let noise = null;
let on = false;
let ready = false;
const listeners = new Set();

function boot() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  bus = ctx.createGain();
  bus.gain.value = MASTER;
  bus.connect(ctx.destination);

  // 200ms of white noise, generated once and reused for every tick
  const len = Math.floor(ctx.sampleRate * 0.2);
  noise = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
}

/** a filtered noise burst — a relay closing, not a beep */
function tick({ freq = 2200, q = 1.4, dur = 0.028, gain = 1 }) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = ctx.createGain();
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(bus);
  src.start(t);
  src.stop(t + dur + 0.02);
}

/** a quiet sine, used only where something changed state */
function blip(freq, at = 0, dur = 0.09, gain = 0.5) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  const t = ctx.currentTime + at;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(bus);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const VOICES = {
  hover: () => tick({ freq: 3000, q: 2.2, dur: 0.016, gain: 0.28 }),
  press: () => tick({ freq: 1100, q: 1.1, dur: 0.042, gain: 0.9 }),
  open: () => {
    tick({ freq: 1800, q: 1.6, dur: 0.02, gain: 0.5 });
    blip(660, 0, 0.08, 0.32);
    blip(990, 0.055, 0.1, 0.24);
  },
  close: () => {
    blip(760, 0, 0.07, 0.26);
    blip(507, 0.05, 0.11, 0.2);
  },
  move: () => tick({ freq: 4200, q: 3, dur: 0.012, gain: 0.22 }),
  sent: () => {
    blip(523.25, 0, 0.16, 0.3);
    blip(659.25, 0.08, 0.18, 0.26);
    blip(783.99, 0.16, 0.3, 0.22);
  },
};

function notify() {
  listeners.forEach((fn) => fn(on));
}

export function isOn() {
  return on;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Reads the stored preference. Call once, after mount. */
export function restore() {
  if (ready) return on;
  ready = true;
  try {
    on = localStorage.getItem(KEY) === "1";
  } catch {
    on = false;
  }
  notify();
  return on;
}

export function setOn(next) {
  on = !!next;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* private mode — the preference just won't survive the tab */
  }
  if (on) {
    boot();
    ctx?.resume?.();
    play("open"); // confirm it out loud; that is the whole point
  }
  notify();
}

export function toggle() {
  setOn(!on);
}

export function play(name) {
  if (!on) return;
  if (!boot()) return;
  if (ctx.state === "suspended") ctx.resume();
  VOICES[name]?.();
}
