/**
 * generate-favicons.mjs
 *
 * Renders the favicon set from the final monogram (PRD §3.7.1) — letterforms
 * #E8EAE5 on a #1C221E field. The 32px version is unframed: at that size the
 * frame and registration mark turn to mud and the letterforms need the room.
 * PRD §3.7.3
 *
 *   node scripts/generate-favicons.mjs
 *
 * Uses sharp, already present as Next.js's image dependency.
 */

import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const monogramSvg = (framed) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#1C221E" />
  ${
    framed
      ? `<rect x="2" y="2" width="124" height="124" fill="none" stroke="#E8EAE5" stroke-opacity="0.22" stroke-width="2" />`
      : ""
  }
  <g stroke="#E8EAE5" stroke-width="14" stroke-linecap="butt" stroke-linejoin="miter" fill="none">
    <path d="M56 20 L56 108" />
    <path d="M31 84 L56 84" />
    <path d="M56 20 L98 20 L98 57 L56 57" />
    <path d="M56 57 L98 57 L98 108 L56 108" />
  </g>
  <polygon points="49.5,17.3 62.5,22.7 27.6,108 12.4,108" fill="#E8EAE5" />
  <rect x="95" y="105" width="10" height="10" fill="#E5C11F" />
</svg>`;

// Vector primary
await writeFile("public/favicon.svg", monogramSvg(true).trim() + "\n");
console.log("✓ favicon.svg");

const PNGS = [
  ["favicon-32.png", 32, false], // unframed — §3.7.3
  ["apple-touch-icon.png", 180, true],
  ["icon-192.png", 192, true],
  ["icon-512.png", 512, true],
];

for (const [name, size, framed] of PNGS) {
  const density = Math.max(72, Math.ceil((size / 128) * 72) * 2); // crisp rasterisation
  await sharp(Buffer.from(monogramSvg(framed)), { density })
    .resize(size, size)
    .png()
    .toFile(`public/${name}`);
  console.log(`✓ ${name} (${size}×${size}${framed ? "" : ", unframed"})`);
}
