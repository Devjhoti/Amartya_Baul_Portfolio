/**
 * /data/assets.js
 *
 * Single source of truth for asset paths. Cloudinary was the staging location;
 * everything below is downloaded and committed to /public, so no third-party
 * host sits in the render path. Read through /lib/content.js via getAssets().
 * PRD §2.7 · §8.4
 *
 * NEEDS_AMARTYA — /public/portrait.jpg is the raw 2.8MB capture. Re-export
 * ~1200px wide, 4:5 crop, quality 80 before launch (next/image optimises what
 * it serves, but the repo should not carry a 2.8MB source).
 *
 * The hero atmosphere fallback and the 11 sector material chips are procedural
 * SVG components (HeroFallback.jsx, SectorChip.jsx), not files — deliberate,
 * see §2.7.
 */

export const assets = {
  profile: "/portrait.jpg",

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
