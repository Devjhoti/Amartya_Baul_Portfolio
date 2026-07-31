/**
 * scripts/light-logo.mjs
 *
 * Puts a white card behind the ENCLOSED transparent areas of a logo, and
 * nothing else.
 *
 * Some brand PNGs draw their light details as knockouts rather than as ink:
 * the "A1" in a1-polymer.png is not white, it is a hole. On the white page
 * the mark was exported against, a hole reads white. On this site's ground it
 * reads as the dark page showing through, and the mark loses its middle —
 * a1-polymer rendered as a bare red ring around nothing.
 *
 * Flattening the whole file onto white would fix the hole and wreck the
 * surround, boxing a round mark in a white square. So the outside is found
 * first — a flood fill inward from the border, through anything not fully
 * opaque — and whatever transparency the fill could not reach is by
 * definition enclosed by the artwork. Only that gets the card.
 *
 * Anti-aliasing is composited rather than thresholded, so the filled edge
 * keeps its softness instead of gaining a hard dark rim.
 *
 *   node scripts/light-logo.mjs public/logos/a1-polymer.png public/logos/a1-polymer-light.png
 */
import sharp from "sharp";

const [, , src, out] = process.argv;
if (!src || !out) {
  console.error("usage: node scripts/light-logo.mjs <src.png> <out.png>");
  process.exit(1);
}

const CARD = [255, 255, 255]; // the colour the mark was drawn to sit on

const img = sharp(src).ensureAlpha();
const { width, height } = await img.metadata();
const buf = await img.raw().toBuffer();

const n = width * height;
const outside = new Uint8Array(n);
const stack = [];

const alphaAt = (i) => buf[i * 4 + 3];

// seed from every border pixel that is not fully opaque
for (let x = 0; x < width; x++) {
  for (const y of [0, height - 1]) {
    const i = y * width + x;
    if (alphaAt(i) < 255 && !outside[i]) {
      outside[i] = 1;
      stack.push(i);
    }
  }
}
for (let y = 0; y < height; y++) {
  for (const x of [0, width - 1]) {
    const i = y * width + x;
    if (alphaAt(i) < 255 && !outside[i]) {
      outside[i] = 1;
      stack.push(i);
    }
  }
}

// flood inward; fully opaque ink is the wall that stops it
while (stack.length) {
  const i = stack.pop();
  const x = i % width;
  const y = (i / width) | 0;
  if (x > 0) {
    const j = i - 1;
    if (!outside[j] && alphaAt(j) < 255) { outside[j] = 1; stack.push(j); }
  }
  if (x < width - 1) {
    const j = i + 1;
    if (!outside[j] && alphaAt(j) < 255) { outside[j] = 1; stack.push(j); }
  }
  if (y > 0) {
    const j = i - width;
    if (!outside[j] && alphaAt(j) < 255) { outside[j] = 1; stack.push(j); }
  }
  if (y < height - 1) {
    const j = i + width;
    if (!outside[j] && alphaAt(j) < 255) { outside[j] = 1; stack.push(j); }
  }
}

let filled = 0;
for (let i = 0; i < n; i++) {
  const a = buf[i * 4 + 3];
  if (a === 255 || outside[i]) continue;
  // src-over onto the card: partial pixels keep their softness
  const k = a / 255;
  for (let c = 0; c < 3; c++) {
    buf[i * 4 + c] = Math.round(buf[i * 4 + c] * k + CARD[c] * (1 - k));
  }
  buf[i * 4 + 3] = 255;
  filled++;
}

await sharp(buf, { raw: { width, height, channels: 4 } }).png().toFile(out);
console.log(
  `${out}: ${filled} enclosed px carded (${((filled / n) * 100).toFixed(1)}% of the canvas), surround left transparent`
);
