/**
 * generate-shots.mjs
 *
 * Builds one film strip per live client site into public/shots/{slug}.webp —
 * the asset the case study draws past its gate, so a reader sees the journey
 * down the page rather than one viewport of it.
 *
 * NOT a full-page capture. Every one of these sites pins and animates on
 * scroll, so `captureBeyondViewport` returns the opening frame stretched over
 * the whole scroll distance — a tall picture of almost nothing, which would
 * misrepresent the work. Instead the page is walked in even steps and a real
 * viewport is photographed at each stop, then the stops are stacked. Every
 * frame is therefore a state the site genuinely renders, pinned heroes and
 * all. Uses a locally installed Chrome (override with CHROME_PATH).
 *
 *   npm run generate-shots
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { projects } from "../data/projects.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "shots");

const WIDTH = 1440;
const FRAME_H = 900;
const MIN_FRAMES = 4;
const MAX_FRAMES = 8;
const PORT = 9411;

const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].find(existsSync);
if (!CHROME) {
  console.error("✗ Chrome not found — set CHROME_PATH");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--window-size=${WIDTH},900`,
  "--hide-scrollbars",
  "--use-gl=angle",
  // the throwaway profile lives in the OS temp dir, never in the repo
  `--user-data-dir=${path.join(tmpdir(), "ab-shots-profile")}`,
  "about:blank",
]);

function targets() {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${PORT}/json`, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(JSON.parse(d)));
      })
      .on("error", reject);
  });
}

let ws;
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
const evalJs = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result
    .value;

async function shoot(project) {
  // the frame must load the site's own address, not the in-app proxy path
  const url = project.siteUrl ?? project.url;
  if (!/^https?:/.test(url)) throw new Error(`no absolute url for ${project.slug}`);

  await send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: FRAME_H,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url });
  await sleep(7000);

  // one full pass first, so anything that reveals on scroll has revealed and
  // any lazy image has been asked for
  const reach = await evalJs(`(async () => {
    const step = 600;
    const end = () => document.body.scrollHeight - window.innerHeight;
    for (let y = 0; y <= end(); y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 130));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 900));
    return Math.max(end(), 0);
  })()`);

  const frames = Math.min(
    MAX_FRAMES,
    Math.max(MIN_FRAMES, Math.round(reach / FRAME_H) || MIN_FRAMES)
  );
  const shots = [];
  for (let i = 0; i < frames; i++) {
    const y = frames === 1 ? 0 : Math.round((reach * i) / (frames - 1));
    await evalJs(`(window.scrollTo({ top: ${y}, behavior: "instant" }), "${y}")`);
    // let the stop settle: scroll-driven scenes need a beat to land
    await sleep(1100);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    shots.push(Buffer.from(shot.data, "base64"));
  }

  const file = path.join(OUT, `${project.slug}.webp`);
  await sharp({
    create: {
      width: WIDTH,
      height: FRAME_H * shots.length,
      channels: 3,
      background: { r: 28, g: 34, b: 30 },
    },
  })
    .composite(shots.map((input, i) => ({ input, top: FRAME_H * i, left: 0 })))
    .webp({ quality: 76 })
    .toFile(file);

  const meta = await sharp(file).metadata();
  return { file, w: meta.width, h: meta.height, frames: shots.length };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  for (let i = 0; i < 60; i++) {
    try {
      await targets();
      break;
    } catch {
      await sleep(250);
    }
  }
  const page = (await targets()).find((t) => t.type === "page");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  };
  await send("Page.enable");
  await send("Runtime.enable");

  const report = [];
  for (const project of projects) {
    try {
      const r = await shoot(project);
      console.log(`✓ ${project.slug.padEnd(20)} ${r.frames} frames · ${r.w}×${r.h}`);
      report.push({ slug: project.slug, h: r.h, frames: r.frames });
    } catch (err) {
      console.log(`✗ ${project.slug.padEnd(20)} ${err.message}`);
    }
  }

  // the frame count per slug, so the case study can label the strip
  await writeFile(
    path.join(ROOT, "data", "shots.json"),
    `${JSON.stringify(Object.fromEntries(report.map((r) => [r.slug, r.frames])), null, 2)}\n`
  );
  console.log(`\n${report.length}/${projects.length} captured into public/shots`);
  chrome.kill();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  chrome.kill();
  process.exit(1);
});
