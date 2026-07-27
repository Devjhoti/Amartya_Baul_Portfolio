/**
 * fetch-fonts.mjs
 *
 * Downloads the two Satoshi weights the site uses (400, 500) from Fontshare
 * into public/fonts/ with the filenames app/layout.js expects. Run once during
 * Phase 0, commit the .woff2 files.
 *
 *   node scripts/fetch-fonts.mjs
 *
 * No dependencies — Node 18+ built-in fetch. Satoshi is free for personal and
 * commercial use under the ITF Free Font License. PRD §3.4 · §8.4
 */

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const CSS_URL = "https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap";
const OUT = "public/fonts";
const WANT = {
  400: "Satoshi-Regular.woff2",
  500: "Satoshi-Medium.woff2",
};

// A browser UA so the API serves woff2 sources.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

await mkdir(OUT, { recursive: true });

const cssRes = await fetch(CSS_URL, { headers: { "User-Agent": UA } });
if (!cssRes.ok) {
  console.error(`✗ Fontshare CSS request failed — HTTP ${cssRes.status}`);
  process.exit(1);
}
const css = await cssRes.text();

// Pull each @font-face block, read its weight and its woff2 URL.
// Fontshare serves protocol-relative URLs (//cdn.fontshare.com/…).
const faces = css.match(/@font-face\s*{[^}]*}/g) ?? [];
const found = {};
for (const face of faces) {
  const weight = face.match(/font-weight:\s*(\d+)/)?.[1];
  let url = face.match(/url\(\s*['"]?((?:https:)?\/\/[^'")]+\.woff2)['"]?\s*\)/)?.[1];
  if (url?.startsWith("//")) url = `https:${url}`;
  if (weight && url && WANT[weight] && !found[weight]) found[weight] = url;
}

let failed = false;
for (const [weight, filename] of Object.entries(WANT)) {
  const url = found[weight];
  if (!url) {
    console.error(`✗ weight ${weight} — no woff2 URL in the Fontshare CSS`);
    failed = true;
    continue;
  }
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const file = path.join(OUT, filename);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    const kb = Math.round((await stat(file)).size / 1024);
    console.log(`✓ ${filename.padEnd(24)} ${String(kb).padStart(4)} KB  →  ${file}`);
  } catch (err) {
    console.error(`✗ ${filename} — ${err.message}`);
    failed = true;
  }
}

if (failed) {
  console.error(
    "\nFallback: download Satoshi manually from https://www.fontshare.com/fonts/satoshi" +
      "\nand place Satoshi-Regular.woff2 + Satoshi-Medium.woff2 in public/fonts/."
  );
  process.exit(1);
}
