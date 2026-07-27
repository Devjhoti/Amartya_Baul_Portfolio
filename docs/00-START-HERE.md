# START HERE

You have five files. This one tells you what to do. Read nothing else until it says to.

---

## What the files are

| File | What it is | When you touch it |
|---|---|---|
| **00-START-HERE.md** | This. The order of operations. | Now |
| **01-PRD** | The spec. Design system, every section, every rule. | Goes in the repo. You read §11 only. |
| **02-MASTER-PROMPT** | The prompts you paste into Antigravity. | Every build session |
| **03-ASSET-PIPELINE** | Images. Mostly done already. | Step 2 below |
| **code/** | Four files: two components, two previews | Step 1 and Step 4 |

You never need to read the PRD end to end. **Antigravity reads it. You read §11.**

---

## The whole thing, in order

### STEP 1 — ✅ DONE

Chips reviewed and signed off across three passes. `SectorChip.jsx` and `HeroFallback.jsx` are final.

---

### STEP 2 — ✅ DONE

Posters captured and optimised. Logos collected. Data files written.

**One thing left:** `anwar-cement-sheet` and `a1-polymer` logos are JPGs with white backgrounds. Run both through remove.bg, save as transparent PNG, and drop them into `public/logos/` overwriting the `.jpg` files. Two minutes. Do it whenever — it doesn't block the build.

---

### STEP 3 — ✅ DONE

All answered. PRD v1.2 is final and ready for the repo.

### STEP 4 — Set up the repo · 20 min  ← YOU ARE HERE

```bash
mkdir amartya-portfolio && cd amartya-portfolio && git init
mkdir -p docs scripts
```

Then drop these in:

| File | Goes to |
|---|---|
| `01-PRD-amartya-portfolio.md` | `docs/PRD.md` |
| `02-MASTER-PROMPT` → **PART A** only | `AGENTS.md` (repo root) |
| `code/projects.js` | `data/projects.js` |
| `code/profile.js` | `data/profile.js` |
| `code/SectorChip.jsx` | `components/ui/SectorChip.jsx` |
| `code/HeroFallback.jsx` | `components/webgl/HeroFallback.jsx` |
| `code/fetch-logos.mjs` | `scripts/fetch-logos.mjs` |
| the 11 `.webp` posters | `public/posters/` |

Then pull the logos down and push:

```bash
node scripts/fetch-logos.mjs
git add . && git commit -m "content and assets" && git push
```

`AGENTS.md` is the one that matters. Antigravity reads it automatically on every request — it's what stops Gemini drifting back into generic output between sessions.

`AGENTS.md` is the important one. Antigravity reads it automatically on every single request. It is the thing that stops Gemini drifting back into generic output between sessions.

---

### STEP 5 — Build · 8 sessions

Open `02-MASTER-PROMPT`, **PART B**. There are eight prompts, Phase 0 through Phase 7.

The rule is simple:

> **One phase. One conversation. Review. Commit. Then the next.**

Never paste two phases at once. Flash models finish the first goal, half-finish the second, and quietly stub the rest.

| Phase | What it builds | Roughly |
|---|---|---|
| 0 | Setup, tokens, fonts, data | 1 hr |
| 1 | Every section, static, no animation | 4–6 hrs |
| 2 | Lenis, GSAP, reveals, preloader, cursor | 3 hrs |
| 3 | The Live Rig | 4 hrs |
| 4 | WebGL hero, marquee, transitions | 3 hrs |
| 5 | Case study pages, contact form | 2 hrs |
| 6 | Real copy for all 11 case studies | 2 hrs |
| 7 | Performance, a11y, SEO, deploy | 3 hrs |

**Stop hard at Phase 1.** Look at the site with animation completely off. If it isn't good standing still, animation won't save it — it'll just be slop in motion. Tell me and we fix it before Phase 2.

`02-MASTER-PROMPT` **PART C** has recovery prompts for when Gemini drifts. It will drift. **PART D** is your review checklist for each phase.

---

### STEP 6 — Deploy

Vercel → import the GitHub repo → add the domain. Run Lighthouse on the deployed URL, not localhost.

---

## Right now, do exactly this

**Step 2a — capture the 11 screenshots.** That's the only thing in front of you.

For each live URL: Chrome → let it fully load → `Cmd/Ctrl+Shift+M` → viewport exactly **1440 × 900** → `Cmd/Ctrl+Shift+P` → `screenshot` → **Capture screenshot** → squoosh.app → WebP quality 80 → save as the exact slug.

Then 2b, 2c, 2d. Then send me the list and the four answers from Step 3.

Nothing else. Everything after that is on this page when you need it.


---

## Why the posters exist

Worth being clear about, because it looks like duplicated work next to the live iframes.

The Live Rig shows real running websites. But the iframe only ever loads on desktop, and only two at a time. The poster is what carries the section everywhere else:

- **Mobile.** Iframes are hard-banned under 1024px — eleven live sites would kill a mid-range phone on 4G. Without posters, mobile visitors see empty frames. Most of your clients will be on phones.
- **The first few seconds on desktop.** An iframe takes 3–8 seconds to boot. The poster is what's on screen until it does.
- **When an iframe is blocked.** Any site sending `X-Frame-Options` or a `frame-ancestors` CSP will never render in a frame. The poster is the only fallback.
- **Reduced motion.** That path is a plain vertical stack of posters.
- **SEO.** Iframe content isn't indexed as yours. A real `<img>` with alt text is.

The section is built so it stays complete and correct even if zero iframes ever load. That's the whole reliability strategy, and posters are what make it true.
