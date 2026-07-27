# MASTER PROMPT PACK — Antigravity / Gemini 3.6 Flash

**How to use this file**

1. Create the repo and put the PRD in it as `docs/PRD.md`.
2. Copy **PART A** into a file at the repo root called `AGENTS.md`. Antigravity reads this automatically on every request. This is the single most important step — it is what stops the model drifting back to generic output between sessions.
3. Then run **PART B** prompts one at a time, in order. One phase per conversation. Review and commit after each.
4. **Never paste two phases at once.** Flash models degrade sharply on multi-goal prompts — they finish the first goal, half-finish the second, and quietly stub the rest.

---

# PART A — `AGENTS.md` (paste into repo root, do not edit)

```markdown
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
```

---

# PART B — Phase prompts

## PHASE 0 — Foundation

```
Read docs/PRD.md and AGENTS.md fully before writing anything. Confirm you have read both by
listing the design direction name and the three banned defaults in one line.

TASK: Phase 0 only — foundation. No UI sections, no animation.

Build:
1. Next.js 14+ App Router project, JavaScript (no TypeScript), Tailwind CSS, ESLint.
   Install: gsap, @gsap/react, lenis, three. Do NOT install framer-motion.

2. Folder structure exactly as PRD §8.2.

3. Fonts:
   - Archivo + Martian Mono via next/font/google (latin subset, display swap, variable axes where available)
   - Satoshi via next/font/local from /public/fonts (create the folder and a README.md inside it
     listing the exact .woff2 files I need to download from fontshare.com/fonts/satoshi)
   Expose all three as CSS variables on <html>.

4. globals.css: define every colour token from AGENTS.md as a CSS custom property, plus the
   fluid type scale from PRD §3.4. Set a base reset. Add the grain overlay as a fixed
   pseudo-element at 3.5% opacity using an inline SVG feTurbulence data URI — no image file.

5. tailwind.config.js: map every token to Tailwind theme values so I write
   `bg-machine text-chalk border-rule` and never a raw hex. Extend fontFamily with
   display / body / mono. Extend fontSize with the fluid clamps. Set container max-width 1560px.

6. /data files — projects.js (all 11 from PRD §2.2, with slug, client, sector, url, logo, chip,
   poster, type: "client", context: "PKG IT", role: "Development", year, stack, and empty
   challenge/approach/outcome fields ready to fill),
   profile.js, capabilities.js, assets.js (asset path map — see PRD §2.7).

7. /lib/content.js — async getters as specified in PRD §8.3.
   /lib/gsap.js — single plugin registration point.
   /lib/motion.js — EASE, DUR, STAGGER tokens from PRD §7.2.

8. A temporary /app/page.js that renders a token proof sheet: every colour as a labelled swatch,
   every type size as a specimen line, and all 11 projects listed as plain text from getProjects().
   No styling ambition — this page is a test instrument and gets deleted in Phase 1.

Then: run the dev server, confirm it builds clean, and report anything you could not complete.
```

---

## PHASE 1 — Static build (the real checkpoint)

```
Phase 1 only. Build every section as STATIC HTML/CSS. ZERO animation. No GSAP, no Lenis, no Three.js.
Do not import any animation library in this phase.

This phase decides whether the site is good. If it is not impressive standing still, motion will not
save it. Treat it as the final design, not a wireframe.

Build these sections per PRD §5, in /components/sections, composed in /app/page.js:
  Nav, Hero, Marquee (static row), Work (static poster grid + index table), About,
  Industries (11-cell material chip grid, PRD §5.8), Capabilities (spec table), Process,
  Contact (form markup, no submit logic yet), Footer

There is NO testimonials section. Do not create one.

Also build /components/ui:
  Button, MonoLabel, SectionHeader (the "spec plate" device from PRD §3.5), and
  Monogram.jsx — paste the SVG from PRD §3.7.1 EXACTLY as written. Do not redraw it,
  do not simplify the paths, do not substitute an icon-library glyph. Then generate the
  favicon set per PRD §3.7.3.

Requirements:
- Every section asymmetric on desktop. Verify: no section is a centred single column.
- Use the SectionHeader spec-plate device consistently: full-width top rule, mono index, mono label,
  right-aligned mono meta.
- Client logos: download all 11 from the Cloudinary URLs in the PRD into /public/logos/,
  reference locally. On dark surfaces apply `filter: brightness(0) invert(1)` at opacity .55.
- Project posters: create /public/posters/ with a README listing the 11 filenames I need to
  generate at 1440x900 WebP. Use a neutral --machine-2 placeholder block with the client name
  until the real files exist. Never use a stock image or a generated illustration as a stand-in.
- Write ALL the copy yourself following the AGENTS.md copy rules. Real, specific, plain sentences.
  Where you genuinely need a fact I have not given you, write [AMARTYA: need X] in the copy so
  I can find it. Do NOT invent facts to fill the gap.
- Fully responsive: verify at 375, 768, 1024, 1440, 1920.
- Semantic HTML. Proper heading hierarchy. Visible focus states using --signal.

Before you write code: give me a 6-line plan of how the Hero will be laid out, and tell me one
thing in your plan you changed because it felt like a default. Wait for my go-ahead on that
before building the rest.
```

---

## PHASE 2 — Motion core

```
Phase 2 only. Add the motion foundation. Do NOT build the Live Rig or the WebGL hero yet.

1. /components/layout/SmoothScroll.jsx — Lenis with the exact config from AGENTS.md,
   synced to the GSAP ticker, disabled under 1024px and under prefers-reduced-motion.

2. /lib/gsap.js — register ScrollTrigger and useGSAP once. Set
   ScrollTrigger.config({ ignoreMobileResize: true }). Call ScrollTrigger.refresh() after
   document.fonts.ready.

3. /components/ui/SplitText.jsx — a dependency-free utility that splits text into
   per-character and per-word spans, preserving real text in the DOM for screen readers
   (wrap with aria-label on the parent, aria-hidden on the spans).

4. /components/ui/RevealText.jsx — mask reveal on scroll. Per-character on desktop,
   per-word on mobile. stagger 0.03, power4.out, 1.1s, lines offset 0.08.
   Apply to every section heading.

5. /components/layout/Preloader.jsx — per PRD §5.0. Mono counter 000->100, name mask reveal,
   clip-path upward wipe, hero begins at 60% of the wipe. Max 2.2s total. Once per session via
   sessionStorage. Skipped entirely under reduced motion. Must not trap keyboard focus.

6. /components/layout/Cursor.jsx — mix-blend-mode difference dot, lerped follow, magnetic snap
   to [data-magnetic] elements, contextual label via [data-cursor="OPEN ↗"]. Desktop only.
   The native cursor and all hit areas must remain functional — this is decoration only.

7. /components/ui/MagneticWrap.jsx and Counter.jsx (number roll for the stats).

8. Wrap ALL of the above in gsap.matchMedia() with isDesktop / isMobile / reduceMotion branches.
   Every hook uses useGSAP with a scoped ref and reverts on unmount.

Constraint check before you finish: confirm you animated only transform, opacity and clip-path,
and that will-change is added and removed programmatically, never in static CSS.

Report: measured CLS after adding motion, and confirm the reduced-motion path renders a complete site.
```

---

## PHASE 3 — The Live Rig (highest risk — go slow)

```
Phase 3 only. Build the signature element: the Live Rig work section. Read PRD §3.6 and §6 twice.

This is the one thing the site is remembered for. It is also the thing most likely to destroy
performance. Implement the lifecycle exactly.

Components:
  /components/work/RigChassis.jsx  — machine-green frame, square corners, four safety-yellow
                                     corner registration marks, overflow hidden
  /components/work/LabelPlate.jsx  — client logo silhouette, sector, year, stack, status LED
                                     (LOADING -> LIVE -> OFFLINE). Text changes use a mono
                                     character-scramble transition.
  /components/work/LiveRig.jsx     — the three-state machine
  /components/work/ProjectIndex.jsx— the scannable 11-row table below the pinned section
  /components/sections/Work.jsx    — orchestrates the pin

State machine (mandatory):
  POSTER  -> next/image WebP, always the default and always the fallback
  BOOTING -> poster still visible, iframe mounting behind it, LED = LOADING
  LIVE    -> iframe visible, poster fades out, LED = LIVE

Iframe lifecycle rules — implement all of them:
- Mount ONLY when: viewport >= 1024 AND this rig is the active pinned project AND it has been
  active for more than 400ms.
- Hard cap of 2 mounted iframes at any time. Track them in an LRU list and unmount the oldest.
- Unmount when the project is two or more steps from active.
- Attributes: loading="lazy", sandbox="allow-scripts allow-same-origin allow-popups allow-forms",
  referrerPolicy="no-referrer", title={client name}, pointer-events: none.
- Render the iframe at a logical 1440x900, then transform: scale(containerWidth / 1440) with
  transform-origin: top left inside an overflow-hidden container. Recompute scale on resize
  with a ResizeObserver.
- If the frame does not load within 6 seconds, or is blocked by X-Frame-Options or a
  frame-ancestors CSP, stay on the poster permanently and set LED to OFFLINE.
- The entire section must be complete and correct if ZERO iframes ever load. Test that path.
- Under 1024px: posters only, never an iframe, no exceptions.

Scroll behaviour (desktop): pin the section, advance one project at a time. Outgoing rig scales
down and dims, incoming scales up and boots. Persistent 03 / 11 counter. Clicking the rig opens
the real URL in a new tab with rel="noopener noreferrer".

Reduced motion: no pin, no scale. Plain vertical stack of posters plus label plates.

Before coding, describe your unmount strategy in 3 lines and tell me how you will prove there is
no memory leak. Then build.
```

---

## PHASE 4 — WebGL, marquee, transitions

```
Phase 4 only.

1. /components/webgl/HeroAtmosphere.jsx
   A single full-bleed plane with a custom shader: slow simplex-noise displacement, machine-green,
   very low contrast, subtly reactive to mouse position. It is ATMOSPHERE, not a graphic —
   if a viewer consciously notices it, it is too strong. Dial it back until it is almost subliminal.

   Gating (all required):
   - next/dynamic with ssr: false
   - Not loaded at all if: viewport < 1024, OR prefers-reduced-motion, OR
     navigator.hardwareConcurrency <= 4, OR navigator.connection?.saveData
   - Fallback: a static grain texture at the same value
   - Frame-capped to 30fps via a delta accumulator
   - renderer powerPreference: "low-power", DPR capped at 1.5
   - Render loop pauses when the hero leaves the viewport (IntersectionObserver)
   - Full disposal on unmount: geometry, material, renderer, and cancel the RAF

2. /components/sections/Marquee.jsx — two rows, opposite directions, all 11 logos silhouetted,
   seamless infinite. Speed reacts to Lenis scroll velocity via gsap.quickTo on the timeline
   timeScale, easing back to base speed. GPU transforms only. Mobile: constant speed, no velocity.

3. /components/ui/ScrambleText.jsx — mono character scramble, used by the label plate.

4. /components/layout/PageTransition.jsx — GSAP curtain transition for App Router navigation.
   A --machine panel wipes in via clip-path, the route changes underneath, the panel wipes out.
   900ms desktop, 400ms fade on mobile. Must not trap focus and must not break the browser
   back button. NO Framer Motion — GSAP only.

5. About section photo treatment: duotone to --machine/--concrete with a cursor-following
   circular unmask, 180px radius, soft edge. Desktop only; mobile gets the static duotone.

After building: leave the hero open for 5 minutes and report whether JS heap grows. If it does,
the disposal is wrong — fix it before you finish this phase.
```

---

## PHASE 5 — Case studies and contact

```
Phase 5 only.

1. /app/work/[slug]/page.js — dynamic case study route per PRD §5.5.
   Order: hero (client, sector, year) -> meta table (role, stack, duration, type) ->
   full-width live embed reusing LiveRig -> Challenge -> Approach -> Outcome ->
   "Open live site" -> next project link.
   generateStaticParams for all 11 slugs. Per-page generateMetadata. A real not-found.js.

2. Contact form -> https://formspree.io/f/mpqvkpgd
   Fields: Name, Email, Company (optional), Message. Hidden honeypot field named _gotcha.
   POST as JSON with Accept: application/json.
   Client-side validation before submit, with inline field-level messages.
   Four written states — idle, sending, sent, error. No browser default validation UI, no emoji.
     Success: "Message sent. I'll reply within 24 hours."
     Error:   "That didn't send. Email me directly at [email] and I'll get back to you today."
   Full keyboard operation. Visible --signal focus rings. aria-live region for status changes.

3. Live Dhaka clock in the contact section — GMT+6, updating every second, in Martian Mono.
   Render it only after mount to avoid a hydration mismatch.

Do not touch any other section in this phase.
```

---

## PHASE 6 — Real content

```
Phase 6 only. No new components. This phase is entirely about truth in the copy.

For each of the 11 projects in /data/projects.js:
1. Visit the live URL and read the actual site.
2. Write the case study from what is genuinely there:
   - challenge: one paragraph, in business terms, not tech terms
   - approach:  3-5 bullets of DECISIONS, not a feature list
   - outcome:   2-3 bullets of observable results
   - role, stack, year, duration filled from evidence on the site

CRITICAL: do not invent numbers. No "increased traffic by 40%", no "reduced bounce rate by 25%".
If you have no real metric, write the outcome qualitatively:
  "The full product catalogue is now readable on a phone, so dealers stop calling for spec sheets."
That is stronger than a fake percentage anyway.

Where you need a fact only I can supply, write [AMARTYA: need X] inline. Then list every one of
those markers at the end so I can fill them in one pass.

Also in this phase:
- Confirm every logo is committed locally in /public/logos/ and no Cloudinary URL remains in the code
- Confirm no testimonials section or testimonials data file exists anywhere in the repo
- Confirm every project carries the PKG IT attribution per PRD §2.2.1, and that slug `pkg-it` is
  labelled INTERNAL rather than CLIENT
- Grep the whole repo for: "lorem", "amazing", "passionate", "crafting", "seamless experience",
  "cutting-edge", any emoji, and any percentage you cannot source. Report and remove every hit.
```

---

## PHASE 7 — Ship

```
Phase 7 only. Hardening and launch.

Performance:
- Audit the bundle. Report initial JS gzipped for the home route, excluding the Three.js chunk.
  Budget is under 190KB. If over, tell me exactly what is over budget and cut it.
- Confirm everything below the fold is next/dynamic
- Confirm all images use next/image with explicit width/height and sizes
- Convert all posters to WebP under 120KB each
- Confirm fonts are latin-subset with display swap, and only the display face is preloaded

Accessibility:
- Run through with keyboard only, start to contact-form submit. Report every trap or invisible focus.
- Verify contrast for --ink-mute on --concrete and --chalk-mute on --machine. If either is
  below 4.5:1, adjust the token and tell me what you changed.
- Confirm all animated text exists as real text in the DOM
- Confirm every iframe has a title
- Test the full prefers-reduced-motion path — it must be a complete site, not a broken one

SEO:
- Per-page metadata, OG images rendered in the Machine Room palette, robots.txt, sitemap.xml,
  JSON-LD Person + WebSite, canonical URLs

Cross-browser: Chrome, Safari, Firefox, iOS Safari, Android Chrome.
Safari specifically: check backdrop rendering, clip-path animation, and iOS 100vh behaviour (use dvh).

Deploy: vercel.json if needed, environment notes in README, and a final Lighthouse run on the
DEPLOYED url (not localhost) reporting all four scores.

Finish with a punch list of anything still outstanding.
```

---

# PART C — Recovery prompts

Use these when the agent drifts. It will drift.

**When output starts looking generic:**
```
Stop. Re-read AGENTS.md. The last output violated the design direction.
Tell me specifically which rule you broke, then rebuild only the offending component.
Before rebuilding, answer: would you produce this exact layout for any other developer portfolio?
```

**When it stubs work:**
```
You left stubs, TODOs, or placeholder comments. AGENTS.md forbids this.
List every incomplete piece you produced, then finish them all. Do not start anything new.
```

**When animation is janky:**
```
Profile this. Report which properties are being animated. If anything other than transform,
opacity or clip-path is animating, that is the bug. Also check for ScrollTriggers created
outside gsap.matchMedia(), and for will-change left in static CSS.
```

**When it installs something it shouldn't:**
```
Remove that dependency. AGENTS.md fixes the stack. Rebuild the feature using GSAP.
```

**When a phase gets too big and it starts losing track:**
```
Stop building. List every file you have created in this phase and its current state
(complete / partial / not started). Then we will finish them one at a time.
```

**Before every phase review, run this yourself:**
```
Self-audit this phase against AGENTS.md. For each of the 15 hard bans, state PASS or FAIL
with the file and line if FAIL. Then state the three weakest things you built and why.
```

---

# PART D — Your review checklist (Amartya, per phase)

Do not approve a phase until every box is true.

**Phase 1 (most important)**
- [ ] Does it look good with animation completely off?
- [ ] Is any section a centred single column? (should be none)
- [ ] Is `Inter` anywhere in the code? (should be nowhere)
- [ ] Any rounded-xl/2xl/3xl cards? Any decorative gradients? Any emoji?
- [ ] Does any sentence sound like it was written by an AI? Read the copy out loud.
- [ ] Correct at 375 and 1920?

**Phase 3**
- [ ] Scroll through Work with DevTools Network open — is it loading 11 sites? (should never exceed 2)
- [ ] Throttle to Slow 4G — does the section still work?
- [ ] Block iframes entirely — is the section still complete?
- [ ] Mobile — zero iframes?

**Phase 4**
- [ ] Hero open 5 min — does the JS heap grow?
- [ ] Turn on OS "Reduce motion" — is the site complete and usable?

**Phase 7**
- [ ] Lighthouse on the deployed URL, mobile: Perf ≥ 90, A11y ≥ 95
- [ ] Send yourself a test message — does it arrive in Formspree?
- [ ] Open on a real mid-range Android on mobile data
