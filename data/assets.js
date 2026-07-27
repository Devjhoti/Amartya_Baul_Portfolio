/**
 * /data/assets.js
 *
 * Single source of truth for asset paths. Cloudinary was the staging location;
 * everything below is downloaded and committed to /public, so no third-party
 * host sits in the render path. Read through /lib/content.js via getAssets().
 * PRD §2.7 · §8.4
 *
 * portrait.jpg: re-exported in Phase 7 to 1200×1500 (4:5) at quality 80 — 131KB.
 *
 * The hero atmosphere fallback and the 11 sector material chips are procedural
 * SVG components (HeroFallback.jsx, SectorChip.jsx), not files — deliberate,
 * see §2.7.
 */

export const assets = {
  profile: "/portrait.jpg",
  // hero cutout (transparent), trimmed + webp'd from the supplied capture —
  // source was 448×557; a higher-res cutout will sharpen the hero. §8.4
  portraitCutout: { src: "/portrait-cutout.webp", width: 372, height: 521 },

  posters: {
    "ids-group": "/posters/ids-group.webp",
    "pauls-academy": "/posters/pauls-academy.webp",
    "property-lifts": "/posters/property-lifts.webp",
    "anwar-cement-sheet": "/posters/anwar-cement-sheet.webp",
    "hotel-the-glory": "/posters/hotel-the-glory.webp",
    caltex: "/posters/caltex.webp",
    "rainbow-paints": "/posters/rainbow-paints.webp",
    tel: "/posters/tel.webp",
    "pkg-it": "/posters/pkg-it.webp",
    "anowar-ispat": "/posters/anowar-ispat.webp",
    "a1-polymer": "/posters/a1-polymer.webp",
  },

  logos: {
    "ids-group": "/logos/ids-group.png",
    "pauls-academy": "/logos/pauls-academy.png",
    "property-lifts": "/logos/property-lifts.png",
    "anwar-cement-sheet": "/logos/anwar-cement-sheet.png",
    "hotel-the-glory": "/logos/hotel-the-glory.png",
    caltex: "/logos/caltex.png",
    "rainbow-paints": "/logos/rainbow-paints.png",
    tel: "/logos/tel.png",
    "pkg-it": "/logos/pkg-it.png",
    "anowar-ispat": "/logos/anowar-ispat.png",
    "a1-polymer": "/logos/a1-polymer.png",
    "pkg-it-agency": "/logos/pkg-it-agency.png",
  },
};

export default assets;
