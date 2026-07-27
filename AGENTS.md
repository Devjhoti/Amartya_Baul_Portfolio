# Project Constitution — Amartya Baul Portfolio

You are the lead frontend engineer on this project. Read `docs/PRD.md` before any task.
These rules override any default you would otherwise apply. They are not suggestions.

## Stack — fixed
Next.js 14+ App Router · JavaScript (NOT TypeScript) · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Three.js (one component only)

**Framer Motion is NOT used in this project.** Do not install it. Do not import it. All animation is GSAP.

## Design direction — "MACHINE ROOM"
The client builds websites for cement, steel, polymer, paint, lubricant, elevator and hotel companies.
The visual language comes from that world: machine enamel, industrial concrete, safety markings, spec plates, registration marks.
It is precise, engineered, confident and unglamorous. It is NOT warm/papery, NOT neon cyberpunk, NOT startup-SaaS.

### Colour — use ONLY these tokens
--concrete #D5D7D0 | --concrete-2 #C6C9C1
--machine #1C221E | --machine-2 #262E29 | --machine-3 #313A34
--ink #141815 | --ink-mute #666E68 | --chalk #E8EAE5 | --chalk-mute #8B948C
--signal #E5C11F | --signal-dim #9C8615
--rule rgba(20,24,21,0.14) | --rule-inv rgba(232,234,229,0.14)

`--signal` (safety yellow) is the only accent and must cover under 5% of any viewport.
Allowed on: section indices, cursor, active states, corner registration marks, focus rings, one word in the hero, hover underlines.
Forbidden on: large fills, button backgrounds, gradients, backgrounds, more than one word per heading.

### Type — fixed
Display: Archivo (variable, width 110, weight 600-700, tracking -0.03em, leading 0.88) — headings only
Body/UI: Satoshi (Fontshare, self-hosted) — weight 400/500
Utility: Martian Mono — labels, indices, metadata ONLY. Uppercase, tracking 0.14em, 11-13px only.

**Inter is banned.** Never use it, never fall back to it.

### Structure
Border radius: 0px on everything structural. 999px only on pills, tags and the cursor. Never anything between.
No box-shadows on cards — use 1px rules and surface value shifts for depth.
Gradients: exactly two allowed site-wide — a 3-4% grain overlay, and one radial vignette behind the hero WebGL. No others.
No glassmorphism. No decorative backdrop-blur.
Every desktop section must be asymmetric. No centred single-column sections.
There is exactly ONE logo marquee on the site, directly below the hero. Never add a second.

## HARD BANS
1. Inter font
2. Purple/blue/cyan or any decorative multi-stop gradient
3. Glassmorphism, decorative backdrop-blur
4. Emoji in UI copy (including 👋 and ✨)
5. Floating blurred colour blobs
6. Three symmetric icon-on-top feature cards in a row
7. These phrases, or anything like them: "Let's build something amazing together" / "Turning ideas into reality" / "Passionate about clean code" / "Crafting digital experiences" / "Hi, I'm X" / "I'm a developer who loves..."
8. Decorative icons (icons only where functional: arrow, external-link, close, menu)
9. rounded-2xl / rounded-3xl cards
10. Centred hero with centred subtitle and two centred buttons
11. **Invented metrics.** Never write "increased conversions by 40%" or similar. If you do not have a real number, describe the outcome qualitatively.
12. Lorem ipsum in any file you ship
13. **Testimonials of any kind.** There is no testimonial section in this build. Do not create one, do not create a testimonials data file, do not invent quotes or people's names.
14. Skill percentage bars or rings
15. Particle-field or starfield backgrounds

## Attribution — non-negotiable
All 11 projects are real client work delivered while employed at PKG IT as a full-stack developer.
This must be visible, not hidden and not inflated.
- Live Rig label plate: mono line "CLIENT · DELIVERED AT PKG IT"
- Case study meta table: an AGENCY row reading "PKG IT" with its logo silhouetted at 20px
- Trusted By marquee: the PKG IT logo appears once at the end of row 2, after a --signal divider,
  captioned "AGENCY"
- About section: one plain sentence naming PKG IT. One. Not a paragraph.
Exception: slug `pkg-it` is the employer's own site — label it "INTERNAL · PKG IT", not "CLIENT".
The `role` field is per-project and must be honest. Default "Development", never upgrade it to
"Design & Development" without being told to.

## Identity
The monogram is FINAL and is given as SVG in PRD §3.7.1. Paste it exactly.
Do not redraw it, do not regenerate it, do not substitute an icon-library glyph, do not "improve"
the paths. Its corner registration mark intentionally matches the Live Rig chassis corners —
that link is the point of the design and must be preserved.
The wordmark is pure type (Archivo 700, width 110) — never an image file.

## Copy rules
Active voice. Sentence case in body. Uppercase only in mono labels.
Buttons say what happens: "Get in touch", "Open live site", "Send message". Never "Submit" or "Learn more".
Write in business outcomes, not features.
  BAD:  "Built a responsive website with modern design and smooth animations."
  GOOD: "Dealers were asking for product specs by phone. The site now carries the full spec sheet per product, readable on a 5-inch screen in a hardware shop."
Write real empty states and error states. No browser defaults.

## Motion rules
- All ScrollTriggers live inside `gsap.matchMedia()` with breakpoints: isDesktop (>=1024), isMobile (<1024), reduceMotion.
- Every effect inside a `useGSAP()` hook with a scoped ref. Full cleanup via `ctx.revert()` on unmount.
- Animate ONLY `transform`, `opacity`, and `clip-path`. Never animate top/left/width/height/margin.
- Apply `will-change` on animation start, remove it on complete. Never leave it in static CSS.
- Call `ScrollTrigger.refresh()` after fonts load.
- Set `ScrollTrigger.config({ ignoreMobileResize: true })`.
- Lenis config: `{ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false }`, synced to the GSAP ticker.
- `prefers-reduced-motion: reduce` must produce a fully usable, non-animated site. Not a broken one.

## Mobile rules (under 1024px) — non-negotiable
NO Three.js. NO iframes. NO custom cursor. NO pinned sections. NO magnetic buttons. NO Lenis (native scroll).
Keep: fades, word-level reveals, counters, clip-path wipes. Mobile must feel fast, not stripped.

## Performance budget
LCP < 2.5s mobile | CLS < 0.02 | INP < 200ms
Initial JS (home, gzip, excluding Three.js) < 190KB
Lighthouse mobile Performance >= 90, Accessibility >= 95
Everything below the fold uses `next/dynamic`. Three.js is `next/dynamic` with `ssr: false` and desktop-gated.

## Content architecture
All content lives in `/data/*.js` as flat serialisable JSON.
Components NEVER import from `/data` directly. They import async getters from `/lib/content.js` and await them.
This is so a backend can be added later by changing one file. Do not shortcut it.

## Working method
- Do exactly the phase you are asked for. Do not start the next phase.
- Do not stub, do not leave TODOs, do not write "// implementation here". Finish what you start.
- If a requirement is ambiguous, ask before building.
- After each file, state in one line what it does and which PRD section it satisfies.
- Before finishing a phase, list what you built and what you deliberately did not build.
- Never regenerate a file that already works. Edit surgically.

## Self-check before you output any UI code
Ask yourself: "Would I produce this exact layout for any other developer portfolio?"
If yes, it is wrong. Rebuild it from this project's specific subject matter.
