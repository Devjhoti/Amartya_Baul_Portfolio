/**
 * generate-og.mjs
 *
 * Renders the OG card set in the Machine Room palette with the real display
 * faces: public/og.png (home) and public/og/{slug}.png for all 11 case
 * studies. Uses a locally installed Chrome (override with CHROME_PATH).
 * Fonts load from Google's CSS API at generation time only — nothing remote
 * ships. Run after changing names/sectors; commit the PNGs. PRD §8.5
 *
 *   npm run generate-og
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { projects } from "../data/projects.js";

const run = promisify(execFile);

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

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&#39;");

const page = ({ topLeft, topRight, name, eyebrow, bottomLeft }) => `<!doctype html>
<html><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,700&family=Martian+Mono:wght@400&display=block" rel="stylesheet" />
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #1C221E; color: #E8EAE5;
    font-family: Archivo, sans-serif; display: flex; flex-direction: column;
    justify-content: space-between; padding: 56px 64px; overflow: hidden; }
  .plate { display: flex; justify-content: space-between; align-items: baseline;
    border-top: 1px solid rgba(232,234,229,0.14); padding-top: 14px;
    font-family: 'Martian Mono', monospace; font-size: 15px; letter-spacing: 0.14em;
    text-transform: uppercase; }
  .idx { color: #E5C11F; }
  .mute { color: #8B948C; }
  .name { font-weight: 700; font-stretch: 110%; font-size: ${name.length > 14 ? 96 : 120}px;
    line-height: 0.92; letter-spacing: -0.03em; text-transform: uppercase; }
  .rule { height: 2px; background: #E5C11F; margin: 26px 8px 14px; }
  .eyebrow { display: flex; justify-content: flex-end; font-family: 'Martian Mono', monospace;
    font-size: 15px; letter-spacing: 0.14em; color: #8B948C; text-transform: uppercase; }
  .mark { position: absolute; width: 14px; height: 14px; background: #E5C11F;
    right: 20px; bottom: 20px; }
</style></head>
<body>
  <div class="mark"></div>
  <div class="plate"><span><span class="idx">${topLeft.idx}</span>&nbsp;&nbsp;${esc(topLeft.text)}</span><span class="mute">${esc(topRight)}</span></div>
  <div>
    <div class="name">${esc(name)}</div>
    <div class="rule"></div>
    <div class="eyebrow">${esc(eyebrow)}</div>
  </div>
  <div class="plate"><span class="mute">${esc(bottomLeft)}</span><span class="idx">■</span></div>
</body></html>`;

const profile = path.join(tmpdir(), "og-chrome-profile");

const shoot = async (html, out) => {
  const tmp = path.join(tmpdir(), `og-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);
  const abs = path.resolve(out);
  await writeFile(tmp, html);
  await run(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--user-data-dir=${profile}`,
    `--screenshot=${abs}`,
    "--window-size=1200,630",
    "--virtual-time-budget=6000",
    `file:///${tmp.replace(/\\/g, "/")}`,
  ]);
  await rm(tmp, { force: true });
  if (!existsSync(abs)) throw new Error(`screenshot missing: ${abs}`);
  console.log("✓", out);
};

await mkdir("public/og", { recursive: true });

// home card
await shoot(
  page({
    topLeft: { idx: "[ 00 ]", text: "DHAKA, BD — 20+ BUILDS SHIPPED" },
    topRight: "PORTFOLIO",
    name: "Amartya\u00A0Baul",
    eyebrow: "FULL-STACK DEVELOPER — DHAKA, BANGLADESH",
    bottomLeft: "11 INDUSTRIES · LIVE WORK, RUNNING RIGHT NOW",
  }),
  "public/og.png"
);

// one card per case study
for (const [i, p] of projects.entries()) {
  const no = String(i + 1).padStart(2, "0");
  await shoot(
    page({
      topLeft: { idx: `[ ${no} ]`, text: "CASE STUDY" },
      topRight: `BUILD ${no} / ${String(projects.length).padStart(2, "0")}`,
      name: p.client,
      eyebrow: `${p.sector} · ${p.year} — AMARTYA BAUL`,
      bottomLeft: p.type === "internal" ? "INTERNAL · PKG IT" : "CLIENT · DELIVERED AT PKG IT",
    }),
    `public/og/${p.slug}.png`
  );
}
