# Amartya Baul — Portfolio

Portfolio site for a Dhaka-based full-stack developer. The work section embeds
the actual running client sites in scaled live frames ("the Live Rig") rather
than screenshots. Design direction: **MACHINE ROOM** — see `docs/PRD.md` and
`AGENTS.md`, which govern every decision in this repo.

## Stack

Next.js (App Router, JavaScript) · Tailwind CSS · GSAP + ScrollTrigger · Lenis ·
Three.js (hero only, lazy, desktop-gated). No Framer Motion — by rule.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL used for canonical URLs, sitemap, robots and OG tags. Defaults to the Vercel project URL; set it to the real domain when it exists. |

No other environment is required. The contact form posts directly to Formspree
(endpoint in `data/profile.js`).

## Content

All content lives in `/data/*.js` as flat JSON and is read exclusively through
the async getters in `lib/content.js` — swap that one file to move to a CMS.
Case-study copy (Phase 6) was written from the live client sites; anything
still needing Amartya's input is marked `NEEDS_AMARTYA` in the data files.

## Asset tooling

```bash
npm run fetch-logos        # re-pull client logos (archival; already committed)
npm run fetch-fonts        # re-pull Satoshi woff2 into public/fonts
npm run generate-favicons  # re-render the favicon set from the monogram
npm run generate-og        # re-render OG cards (home + 11 case studies; needs local Chrome)
```

## Deploy

Vercel → import this repo → framework auto-detects Next.js → set
`NEXT_PUBLIC_SITE_URL` → add the domain. Then run Lighthouse against the
deployed URL (budgets: Perf ≥ 90 mobile, A11y ≥ 95, CLS < 0.02, initial JS
< 190KB gzipped excluding Three.js).
