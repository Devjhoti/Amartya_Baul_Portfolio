/**
 * fetch-logos.mjs
 *
 * Downloads all 11 client logos from Cloudinary into public/logos/ with the
 * correct slug filenames. Run once during Phase 0.
 *
 *   node scripts/fetch-logos.mjs
 *
 * No dependencies — uses Node's built-in fetch (Node 18+).
 *
 * Cloudinary is the staging location, not the production host. Once these are
 * committed to the repo, nothing in the codebase references Cloudinary again.
 * PRD §2.2.2 · §8.4
 */

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const LOGOS = [
  { slug: "ids-group",          url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1785099783/1ac6e50f-6614-4cc3-939f-dde67f5b4fb8.png" },
  { slug: "pauls-academy",      url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1783950386/Gemini_Generated_Image_aawx3eaawx3eaawx_t2zhwx.png" },
  { slug: "property-lifts",     url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1785100196/PLlogoCreativePNG-White_heurdt.png" },
  { slug: "anwar-cement-sheet", url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1784243388/Anwar_Cement_Sheet_emg4rc.jpg", needsAlpha: true },
  { slug: "hotel-the-glory",    url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1785100097/Hotel_The_Glory_logo_PNG_vid4ao.png" },
  { slug: "caltex",             url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1781677512/navbar-logo-white_euftst_d2bw5n.png" },
  { slug: "rainbow-paints",     url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1783891083/2025-10-29__Rainbow_Logo_Color_of_Joy_rvylem.png" },
  { slug: "tel",                url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1783007741/trLogo_iagmbe.png" },
  { slug: "pkg-it",             url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1785100462/PKG_IT-LOGO_xm9x0c.png" },
  { slug: "anowar-ispat",       url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1778929439/logo-dark_xsnzgv.png", darkOnly: true },
  { slug: "a1-polymer",         url: "https://res.cloudinary.com/dtctcaxxr/image/upload/v1779482970/protonbd/chat/hhcnukbeva4lnmn10wjr.jpg", needsAlpha: true },
];

// PKG IT doubles as the agency credit mark (Trusted By marquee, case study meta table)
const EXTRA = [{ slug: "pkg-it-agency", url: LOGOS.find((l) => l.slug === "pkg-it").url }];

const OUT = "public/logos";
await mkdir(OUT, { recursive: true });

const notes = [];

for (const { slug, url, needsAlpha, darkOnly } of [...LOGOS, ...EXTRA]) {
  const ext = url.split("?")[0].endsWith(".jpg") ? "jpg" : "png";
  const file = path.join(OUT, `${slug}.${ext}`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    const kb = Math.round((await stat(file)).size / 1024);
    console.log(`✓ ${slug.padEnd(20)} ${String(kb).padStart(4)} KB  →  ${file}`);

    if (needsAlpha) notes.push(`${slug}.jpg has a baked-in background. Run it through remove.bg, save as ${slug}.png, delete the .jpg.`);
    if (darkOnly) notes.push(`${slug}.png is dark ink on transparent. A light version would be cleaner, but the silhouette filter handles it.`);
  } catch (err) {
    console.error(`✗ ${slug.padEnd(20)} FAILED — ${err.message}`);
  }
}

if (notes.length) {
  console.log("\nStill to do:");
  notes.forEach((n) => console.log(`  · ${n}`));
}

console.log(`\nAll logos render through a silhouette filter on dark surfaces:`);
console.log(`  filter: brightness(0) invert(1); opacity: .55  →  opacity: 1 on hover`);
console.log(`That normalises eleven mismatched logos into one treatment — but it only`);
console.log(`works on transparent files. A JPG with a white background becomes a solid white box.`);
