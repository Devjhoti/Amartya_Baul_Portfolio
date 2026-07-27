# PRD — Amartya Baul, Portfolio Website

**Version:** 1.2
**Owner:** Amartya Baul
**Status:** Approved for build
**Build environment:** Antigravity (Gemini 3.6 Flash), phase-by-phase

**Changes in 1.2:** all content confirmed. Role set to Design & Development across all 11. `tel` identified as TEL Plastics, sector Recycled Plastics, material chip reassigned from cardboard to plastic regrind. Contact details in. Bio written. Posters captured and optimised. `/data/projects.js` and `/data/profile.js` ship ready.

**Changes in 1.1:** all 11 projects confirmed as real client work delivered at PKG IT — attribution model added (§2.2.1). Testimonials section removed and replaced (§2.4). Monogram SVG finalised and embedded (§3.7). Image trail effect cut.

---

## 0. Why this document exists

This PRD exists so the coding agent never has to guess. Every guess an agent makes is where "generic AI slop" comes from — the model falls back to the statistical average of every portfolio it has ever seen. This document removes the freedom to average out.

Read sections 3 (Art Direction) and 4 (Anti-Slop Constitution) as **hard constraints**, not suggestions.

---

## 1. Product definition

### 1.1 One-line brief
A portfolio site for a Dhaka-based full-stack developer who builds production websites for industrial, manufacturing, hospitality and education companies — where the work is proven by showing the *actual running sites*, not screenshots.

### 1.2 Who it's for
| Audience | What they need to believe in 8 seconds |
|---|---|
| International agency / freelance client (Upwork, referral) | "This person has real shipped output and a design eye. Not a template seller." |
| Bangladeshi SME decision-maker (owner, marketing head) | "He has built for companies like mine. He is credible and reachable." |

Both audiences are served by the **same** signal: real, live, running work. That is why the work section is the centre of the site, not the about section.

### 1.3 The single job of the page
Get a qualified visitor to **Get in touch**.

Everything else is in service of that. If a section does not either (a) build proof or (b) reduce friction to contact, it gets cut.

### 1.4 Success criteria
- A visitor can see a real, running client site without leaving the page — within 15 seconds of landing.
- Contact form submission works and confirms visibly.
- Lighthouse: Performance ≥ 90 mobile / ≥ 95 desktop, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- Zero layout shift (CLS < 0.02) despite heavy motion.
- Site does not look like it could belong to any other developer.

### 1.5 Explicitly out of scope (v1)
Blog, CMS, dark/light toggle, multi-language, i18n, analytics dashboard, auth, comments, newsletter.

---

## 2. Content inventory

### 2.1 Identity
- **Name:** Amartya Baul
- **Role:** Full-Stack Developer
- **Experience:** 2+ years
- **Projects:** 20+ shipped
- **Location:** Dhaka, Bangladesh (used as a live-clock detail in the footer — see §5.9)
- **Primary CTA:** Get in touch
- **Form endpoint:** `https://formspree.io/f/mpqvkpgd`

### 2.2 Project data

All 11 projects below. **Slug** is the route (`/work/[slug]`). **Sector** is what appears in the label plate.

| # | slug | Client | Sector | Live URL | Logo URL |
|---|---|---|---|---|---|
| 01 | `ids-group` | IDS Group | Corporate / Group | https://ids-group-demo-web.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1785099783/1ac6e50f-6614-4cc3-939f-dde67f5b4fb8.png |
| 02 | `pauls-academy` | Paul's Academy | Education | https://pauls-academy-web-demo.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1783950386/Gemini_Generated_Image_aawx3eaawx3eaawx_t2zhwx.png |
| 03 | `property-lifts` | Property Lifts | Vertical Transport | https://property-lifts-portfolio.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1785100196/PLlogoCreativePNG-White_heurdt.png |
| 04 | `anwar-cement-sheet` | Anwar Cement Sheet | Building Materials | https://anwar-cement-sheet-prd.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1784243388/Anwar_Cement_Sheet_emg4rc.jpg |
| 05 | `hotel-the-glory` | Hotel The Glory | Hospitality | https://hotel-the-glory-web.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1785100097/Hotel_The_Glory_logo_PNG_vid4ao.png |
| 06 | `caltex` | Caltex | Lubricants | https://caltex-demo.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1781677512/navbar-logo-white_euftst_d2bw5n.png |
| 07 | `rainbow-paints` | Rainbow Paints | Paints & Coatings | https://rainbow-paints-web-demo.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1783891083/2025-10-29__Rainbow_Logo_Color_of_Joy_rvylem.png |
| 08 | `tel` | TEL Plastics | Recycled Plastics | https://tel-website-demo-pkgit.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1783007741/trLogo_iagmbe.png |
| 09 | `pkg-it` | PKG IT | IT Services | https://pkg-it-portfolio.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1785100462/PKG_IT-LOGO_xm9x0c.png |
| 10 | `anowar-ispat` | Anwar Ispat | Steel & Metals | https://anowar-ispat-demo.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1778929439/logo-dark_xsnzgv.png |
| 11 | `a1-polymer` | A1 Polymer | Polymer & Plastics | https://a1-polymer-demo-web.vercel.app/ | https://res.cloudinary.com/dtctcaxxr/image/upload/v1779482970/protonbd/chat/hhcnukbeva4lnmn10wjr.jpg |

> Slug `tel` resolved: **TEL Plastics**, recycled plastics into furniture. Its material chip was reassigned from cardboard fluting to plastic regrind once the real business was confirmed. Slug `anowar-ispat` keeps the URL spelling; the brand displays as **Anwar Ispat**.

#### 2.2.1 Attribution — work delivered at PKG IT

All 11 projects are **real client work**, delivered while employed as a full-stack developer at **PKG IT**. This is confirmed and is not in question.

The attribution must be visible, and this is not a defensive measure — it is a positioning advantage. "I did some freelance sites" and "I ship production work for industrial clients inside a professional team" are two different candidates, and the second one bills more. Agency and international clients read team-delivered production work as lower risk.

Every project therefore carries:

```js
type:    "client",
context: "PKG IT",
role:    "Full-Stack Developer",   // per-project, honest — see below
```

**How it renders:**

- **Live Rig label plate:** a mono line reading `CLIENT · DELIVERED AT PKG IT`
- **Case study meta table:** a dedicated row — `AGENCY  ·  PKG IT` with the PKG IT logo silhouetted beside it at 20px
- **About section:** one plain sentence naming the employment. Not buried, not exaggerated.

**Role honesty rule:** the `role` field must reflect what you actually did on that specific project. If the design came from someone else, `role` is `"Development"`, not `"Design & Development"`. Getting caught overstating a role in a portfolio is worse than having a smaller role — and a clean, specific role list reads as someone who knows exactly what they own.

**Confirmed:** `role` is `"Design & Development"` on all 11. Amartya did both on every project.

One note on `pkg-it` (slug 09): that is your employer's own site, not a client's. Label it `INTERNAL · PKG IT` rather than `CLIENT`. It's a small distinction and anyone in the industry will notice if it's wrong.

#### 2.2.2 Logo asset handling

Two logos are `.jpg` with baked-in backgrounds (`anwar-cement-sheet`, `a1-polymer`) and one is `logo-dark` (dark ink on transparent) which will vanish on a dark surface.

Rules:
- Every logo is rendered inside a fixed-height container (`h-8` desktop / `h-6` mobile), `object-contain`, never stretched.
- On dark surfaces, logos render with `filter: brightness(0) invert(1)` and `opacity: .55`, going to `opacity: 1` on hover. This normalises all 11 logos to a single silhouette treatment — mixed-colour logo walls always look messy.
- The two JPGs must be background-removed and re-uploaded as PNG before launch. Until then the filter above still handles them acceptably.

### 2.3 Case studies

Each project needs a case study. Structure is fixed:

```
{
  challenge:  1 paragraph — what the business needed, in business terms not tech terms
  approach:   3–5 bullets — decisions made, not features listed
  outcome:    2–3 bullets — measurable or observable results
  role:       "Design & Development" | "Development" | ...
  stack:      ["Next.js", "Tailwind", ...]
  year:       "2025"
  duration:   "3 weeks"
}
```

**How these get written:** the coding agent will visit each live URL, read the actual site, and draft the case study from what is really there. Amartya then edits for truth. Do not let the agent invent metrics — see §4.

Copy rule: **write in business outcomes, not features.**

- Bad: "Built a responsive website with modern design and smooth animations."
- Good: "Anwar Cement Sheet's dealers were sending product spec questions by phone. The site now carries the full spec sheet per product, in a table dealers can read on a 5-inch phone in a hardware shop."

That second sentence is what a client pays for. The first is what every portfolio on the internet says.

### 2.4 Testimonials — **cut. Replaced.**

**Decision: there is no testimonial section in v1.** Social proof is carried by the Trusted By marquee (§5.3) and by the work itself. No quotes, no invented names, no `testimonials.js` file.

Reasoning: quotes you can't source are a liability, and quotes from an employer's clients aren't really yours to publish anyway. The Live Rig already does the job a testimonial does — it proves the work exists and is running — and it does it better, because nobody has to take your word for it.

If real quotes arrive later, the section can be added in an afternoon. It is not blocking launch.

#### 2.4.1 Avoiding a duplicate marquee

The Trusted By marquee sits below the hero (§5.3). **Do not put a second logo marquee where the testimonials section was** — showing the same eleven logos twice in one scroll reads as padding and undercuts the first one.

That slot instead becomes **§5.8 Industries** — an 11-cell grid using the sector material chips (see §2.7), each cell showing the chip, the sector name, and the count. It reuses the material idea, carries real information the marquee doesn't (which industries, not just which logos), and gives the page a second texture moment without repeating itself.

### 2.7 Generated assets — pending Cloudinary

Produced separately per `03-ASSET-PIPELINE.md`. Paths below are placeholders until the Cloudinary URLs land; at that point they are filled in `/data/assets.js` and nothing else in the codebase changes.

| Key | Asset | Used in | Status |
|---|---|---|---|
| `profile` | Graded portrait, 4:5 | About §5.6 | ✅ `.../Amartya-Baul-Potrait_tqk43w.jpg` |
| — | Hero atmosphere fallback | Hero §5.2, §5.12 | ✅ **procedural SVG** — `HeroFallback.jsx`, no asset |
| — | 11 sector material chips | Label plate §3.6, Industries §5.8 | ✅ **procedural SVG** — `SectorChip.jsx`, no asset |
| `posters.{slug}` | 11 screenshots, 1440×900 WebP | Live Rig §6 | ✅ captured, 534KB total, all under budget |
| `logos.{slug}` | 11 client logos + PKG IT agency mark | Marquee §5.3, meta table §5.5 | ⚠ 2 JPGs still need background removal |

**Outstanding logo work.** `anwar-cement-sheet` and `a1-polymer` are JPGs with baked-in backgrounds. The site's silhouette treatment (`filter: brightness(0) invert(1)`) turns any logo into a matched white mark on dark surfaces — but on a JPG with a white background it produces a solid white rectangle. Both must be re-exported as transparent PNG before launch. `anowar-ispat` is dark-on-transparent; the filter handles it, though a light version would be cleaner.

**Design note on the chips and hero fallback:** these are generated procedurally with SVG `feTurbulence`, not produced as images. That is a deliberate choice, not a shortcut. Eleven separately generated raster textures would never fully agree in tone, and one chip sitting slightly off the others reads as a defect rather than a material. Running every chip through a single shared duotone map (`#2A322D → #AFB5AC`) makes the set matched by construction, and it also happens to save ~250KB and eleven requests. The hero fallback uses the same `feTurbulence` primitive as the page-wide grain overlay, so the fallback and the WebGL hero belong to one visual family instead of looking like two unrelated treatments.

Component files ship as `/components/ui/SectorChip.jsx` and `/components/webgl/HeroFallback.jsx`. Paste them as written.

**Minimum chip size is 56px.** Reviewed against the rendered set: below that, the finer materials (slate, anodised, stipple) stop resolving and the whole point of the device is lost. Label plate uses 56px, the Industries grid uses 88px.

All of these are downloaded and committed to `/public` before launch. Cloudinary is the staging location, not the production host — a third-party image CDN in the critical render path is an availability risk you don't need to carry.

### 2.5 Capabilities

Grouped, not a badge soup of 40 logos (badge soup is a slop tell):

| Group | Items |
|---|---|
| Frontend | React, Next.js, JavaScript, TypeScript, Tailwind CSS, GSAP |
| Backend | Node.js, Express, REST APIs, Authentication |
| Data | MongoDB, PostgreSQL, Prisma |
| Delivery | Vercel, Git/GitHub, Cloudinary, Performance & SEO |

### 2.6 Stats
`20+` Projects shipped · `2+` Years building · `11` Industries served · `100%` On-time delivery

(Only claim the last one if it's true.)

---

## 3. Art direction

### 3.1 The reasoning (read this — it's why the site won't look generic)

Right now, AI-generated design collapses into three looks. All three must be avoided:

1. Warm cream background (~`#F4F1EA`) + high-contrast serif display + terracotta accent (~`#D97757`)
2. Near-black background + one acid-green or vermilion accent
3. Broadsheet layout, hairline rules, zero radius, dense newspaper columns

These are defaults, not decisions. They appear regardless of subject.

So: what is *this* subject's world? Amartya builds for **cement, steel, polymer, paint, lubricants, elevators**. That is a factory-floor world — machine paint, safety markings, spec plates, load ratings, registration marks. It is precise, engineered, unglamorous and confident. Nobody's portfolio looks like that.

### 3.2 Direction: **MACHINE ROOM**

Cool industrial concrete and machine-enamel green as the ground. One accent: **safety yellow** — the exact colour of factory floor markings, hazard tape and elevator door edges. Typography is engineered, not literary: an expanded grotesk for display, a wide technical mono for all metadata. Corners are square. Structure is exposed like a spec plate.

It is not warm and papery. It is not neon cyberpunk. It is a machine room, lit well.

### 3.3 Colour tokens

```css
:root {
  /* Ground */
  --concrete:      #D5D7D0;  /* light base — cool grey-green, NOT cream */
  --concrete-2:    #C6C9C1;  /* recessed light surface */

  /* Machine */
  --machine:       #1C221E;  /* dark base — machine enamel green-black */
  --machine-2:     #262E29;  /* elevated dark surface */
  --machine-3:     #313A34;  /* hover / active dark surface */

  /* Ink */
  --ink:           #141815;  /* primary text on light */
  --ink-mute:      #666E68;  /* secondary text on light */
  --chalk:         #E8EAE5;  /* primary text on dark */
  --chalk-mute:    #8B948C;  /* secondary text on dark */

  /* Signal — the only accent. Used on <5% of any viewport. */
  --signal:        #E5C11F;  /* safety yellow */
  --signal-dim:    #9C8615;

  /* Structure */
  --rule:          rgba(20,24,21,0.14);
  --rule-inv:      rgba(232,234,229,0.14);
}
```

**Accent discipline.** `--signal` is allowed on: section index numbers, the custom cursor, active nav state, corner registration marks, form focus rings, one word in the hero, hover underlines. It is **forbidden** on: large fills, buttons (buttons are ink/chalk), gradients, backgrounds, more than one word per heading.

**Gradient policy.** Exactly two permitted uses site-wide: (1) a fixed grain/noise overlay at 3–4% opacity, (2) a single radial vignette behind the hero WebGL element. No other gradient. No glassmorphism. No `backdrop-blur` decorative panels.

**Shadow policy.** No box-shadows on cards. Depth comes from 1px rules and surface value shifts. Shadows are permitted only on the floating nav pill and the cursor.

**Radius policy.** `0px` everywhere structural. `999px` only on pills, tags and the cursor. Nothing in between — no `rounded-2xl` cards.

### 3.4 Typography

| Role | Face | Source | Usage |
|---|---|---|---|
| Display | **Archivo** (variable, width 100–125) | Google Fonts | Headings only. Weight 600–700, width 110, tracking `-0.03em`, leading `0.88` |
| Body / UI | **Satoshi** | Fontshare (free) | Paragraphs, buttons, nav. Weight 400/500 |
| Utility | **Martian Mono** (variable) | Google Fonts | Labels, indices, metadata, stats, form labels. Uppercase, tracking `0.14em`, size 11–13px only |

**Inter is banned.** It is the single strongest AI-default tell in a portfolio.

Type scale (fluid):
```
--fs-hero:    clamp(3.25rem, 11.5vw, 12rem);
--fs-display: clamp(2.5rem, 6vw, 5.5rem);
--fs-h2:      clamp(1.75rem, 3.2vw, 3rem);
--fs-h3:      clamp(1.25rem, 1.8vw, 1.6rem);
--fs-body:    clamp(1rem, 1.05vw, 1.125rem);
--fs-small:   0.875rem;
--fs-mono:    0.6875rem;   /* 11px */
```

### 3.5 Layout system

- 12-column grid, gutter `24px`
- Container max-width `1560px`
- Page margin `clamp(20px, 4.5vw, 80px)`
- Vertical section rhythm `clamp(96px, 14vh, 200px)`
- **Asymmetry is required.** No section may be a centred single column with centred text. Headings sit on columns 1–5 with content on 7–12, or the reverse. Alternate.
- Section headers use a **spec plate** device: a top hairline running the full content width, with the mono index and label sitting on it — like the data plate riveted to a machine.

```
─────────────────────────────────────────────────────────
[ 03 ]  SELECTED WORK                        [ 11 BUILDS ]

Live work, running
right now.
─────────────────────────────────────────────────────────
```

The numbering is legitimate here because the site *is* a fixed sequence a visitor moves through. It is not decoration.

### 3.6 The signature element — **THE LIVE RIG**

> This is the one thing the site is remembered for. Everything else stays quiet so this lands.

In the Work section, each project is not a screenshot. It is **the actual website, running, inside a scaled viewport**, mounted in a frame that looks like a piece of test equipment:

- A machine-green chassis with square corners
- Four small safety-yellow **registration marks** at the frame corners
- A **label plate** across the bottom of the chassis: client logo (silhouetted), sector, year, stack, and a status LED that goes from `LOADING` to a steady yellow `LIVE` when the frame finishes booting
- The site inside is real, interactive-looking, and scaled with `transform: scale()` from a 1440px logical width
- Cursor over the rig changes to a yellow disc reading `OPEN ↗`; click opens the real site in a new tab

Scroll behaviour: the rig section pins, and projects advance one at a time — the outgoing rig scales down and dims, the incoming rig scales up and boots. The label plate data does a mono character-scramble as it changes.

This directly satisfies "client should see my work in one glance" — because they aren't looking at a picture of the work, they're looking at the work.

Add the sector material chip (§2.7) to the label plate at 56×56px, left of the client logo — a macro texture of the material that client's industry actually works in. Cement for a cement company, rolled steel for a steel mill, polymer pellets for a polymer plant.

### 3.7 Identity — monogram and wordmark

**Final. Do not redesign, do not regenerate, do not substitute an icon library glyph.**

The mark is A and B locked on a shared vertical stem. Straight lines only — no curves anywhere — with uniform stroke weight, square terminals and mitred corners. It sits in a thin square frame with a single safety-yellow square in the corner.

That corner square is a **registration mark**, and it is the same mark that appears at the four corners of the Live Rig chassis. The identity and the signature element of the site are deliberately built from one idea. Preserve that link — it is the reason the brand reads as authored rather than assembled.

#### 3.7.1 Component — `/components/ui/Monogram.jsx`

Ship this file exactly as written:

```jsx
export default function Monogram({ className = "", framed = true }) {
  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-label="Amartya Baul">
      {framed && (
        <>
          {/* frame */}
          <rect x="2" y="2" width="124" height="124"
                fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
          {/* registration mark — always safety yellow, in both grounds */}
          <rect x="108" y="108" width="10" height="10" fill="#E5C11F" />
        </>
      )}

      <g stroke="currentColor" strokeWidth="14"
         strokeLinecap="butt" strokeLinejoin="miter" fill="none">
        {/* shared stem */}
        <path d="M56 20 L56 108" />
        {/* A — diagonal and crossbar */}
        <path d="M56 20 L20 108" />
        <path d="M31 84 L56 84" />
        {/* B — upper bowl */}
        <path d="M56 20 L92 20 L92 57 L56 57" />
        {/* B — lower bowl */}
        <path d="M56 57 L104 57 L104 108 L56 108" />
      </g>
    </svg>
  );
}
```

Rules:
- The letterforms use `currentColor`, so the mark inverts automatically between the concrete and machine grounds. Never hardcode the stroke colour.
- The registration mark stays `#E5C11F` in both grounds. It is the one fixed colour in the identity.
- Below 40px rendered size, pass `framed={false}` — the frame and registration mark become visual noise at that scale and the letterforms need the room.

**Usage:** nav (32px, unframed) · footer (96px, framed) · favicon (framed) · OG image (48px, framed) · preloader (72px, framed).

#### 3.7.2 Wordmark

No image file. Pure type, using fonts already loaded:

```
Text:     AMARTYA BAUL
Face:     Archivo, weight 700, width axis 110, all caps
Tracking: -0.02em
Rule:     1px --signal directly beneath, inset 8px from each end
Eyebrow:  Martian Mono 11px, uppercase, tracking 0.14em, --ink-mute,
          right-aligned to the wordmark:
          "FULL-STACK DEVELOPER — DHAKA"
```

Used in: footer, contact section, OG image. The nav uses the monogram alone, never the full wordmark.

#### 3.7.3 Favicon set

Rendered from `Monogram` with `framed={true}`, letterforms `#E8EAE5` on a `#1C221E` field:

| File | Size | Note |
|---|---|---|
| `favicon.svg` | vector | primary |
| `favicon-32.png` | 32 | **unframed** — frame and reg mark dropped |
| `apple-touch-icon.png` | 180 | framed |
| `icon-192.png` | 192 | framed |
| `icon-512.png` | 512 | framed |

Check the 32px version in a real browser tab before committing. Marks that work at 512 routinely turn to mud at 32, and the tab icon is the one people actually see most often.

Technical implementation of the rig is specified in §6.

---

## 4. The Anti-Slop Constitution

These are hard rules for the coding agent. Every one of them exists because it is a thing AI does by default.

**Banned outright:**
1. `Inter` font
2. Purple→blue, blue→cyan, or any multi-stop decorative gradient
3. Glassmorphism / decorative `backdrop-blur` panels
4. Emoji anywhere in UI copy (including 👋 and ✨)
5. Floating blurred colour blobs in backgrounds
6. Three symmetric feature cards in a row with an icon on top
7. Copy patterns: "Let's build something amazing together", "Turning ideas into reality", "Passionate about clean code", "Crafting digital experiences", "Hi, I'm X 👋", "I'm a developer who loves…"
8. Generic icon libraries used decoratively (icons allowed only where functional: arrows, external-link, close, menu)
9. `rounded-2xl` / `rounded-3xl` cards
10. Centred hero with centred subtitle and two centred buttons
11. Fake metrics ("increased conversions by 47%") unless Amartya supplies the real number
12. Lorem ipsum in any shipped file
13. Testimonials of any kind — there is no testimonial section in this build (§2.4)
14. Skill bars / percentage rings ("React 85%") — meaningless and dated
15. A hero background that is a particle field or a starfield

**Required:**
1. Every section must be asymmetric on desktop
2. Every claim must be traceable to something real
3. Copy is specific and plain. Active voice. Sentence case in body, uppercase only in mono labels.
4. Buttons say what happens: `Get in touch`, `Open live site`, `Send message` — never `Submit` or `Learn more`
5. Empty and error states are written, not defaulted
6. One accent colour, used sparingly

---

## 5. Page & section spec

### 5.0 Preloader
Full-screen `--machine`. Mono counter `000` → `100` bottom-left. `AMARTYA BAUL` mask-reveals line by line, centre-left. On complete: counter hits 100, holds 200ms, then the whole panel wipes upward via `clip-path` with an eased curve, revealing the hero mid-animation (hero starts at 60% of the wipe, not after).

Runs **once per session** (`sessionStorage`). Repeat visits in the same session get a 400ms fade instead. Skipped entirely on `prefers-reduced-motion`.

Max duration: **2.2s**. A preloader longer than that is a bounce.

### 5.1 Navigation
Thin top bar, transparent over hero. On scroll past hero: condenses into a floating pill, bottom-centre on mobile / top-right on desktop.
Contents: `AB` monogram (left) · section links (`Work` `About` `Contact`) · a `Get in touch` pill.
Active section is tracked by ScrollTrigger and marked with a `--signal` dot.

### 5.2 Hero — the thesis
Not centred. Not "Hi I'm".

```
[ 00 ]  DHAKA, BD — 20+ BUILDS SHIPPED
─────────────────────────────────────────────────

FULL-STACK
DEVELOPER
BUILDING FOR         ← "MACHINES" set in --signal
MACHINES.

                          I build production websites for
                          manufacturers, industrials and
                          operators — cement, steel, paint,
                          lifts, hotels. Sites that hold up
                          on a 3G phone in a hardware shop.

                          [ Get in touch → ]   [ See the work ]
─────────────────────────────────────────────────
AMARTYA BAUL — FULL-STACK DEVELOPER          [ SCROLL ↓ ]
```

Behind the type: the single WebGL element (§5.12) — a slow, low-amplitude displaced plane, machine-green, mouse-reactive, at very low contrast. It should read as *atmosphere*, not as a graphic. If you notice it consciously, it's too strong.

Motion: per-character mask reveal, stagger `0.03`, `power4.out`, `1.1s`, lines offset by `0.08`.

### 5.3 Trusted By — infinite marquee

Directly below the hero. This is the **only** social-proof element on the page, so it has to carry weight on its own.

- Two rows, opposite directions, infinite and seamless, GPU transforms only
- All 11 client logos, silhouetted (`filter: brightness(0) invert(1)`, opacity `.55`)
- Hovering a logo lifts it to opacity `1` and reveals the client name below it in Martian Mono. Clicking scrolls to that project in the Live Rig.
- **Speed responds to scroll velocity** — Lenis velocity → `gsap.quickTo` on the timeline `timeScale`, easing back to base speed. This is the detail that makes it feel alive rather than looped.
- Row 1 and row 2 run at slightly different base speeds (`1.0` and `0.82`) so they never visually sync up

Label above: `[ 01 ]  TRUSTED BY` with a right-aligned mono meta reading `11 BRANDS · DELIVERED AT PKG IT`

The PKG IT logo appears once at the end of row 2, separated by a `--signal` divider, with the mono caption `AGENCY`. That single placement does the whole attribution job without a paragraph explaining it.

**There is exactly one logo marquee on the site.** Do not add a second one lower down.

### 5.4 Selected Work — the Live Rig
Specified in §3.6 and §6. Pinned section, one project at a time, 11 total. Includes a persistent counter `03 / 11` and a jump list.

Below the pinned rig: a compact index table of all 11 projects (client · sector · year · link) for people who scan rather than scroll. This is the accessible and fast path, and it also serves crawlers.

### 5.5 Project detail — `/work/[slug]`
Hero (client name + sector + year) → meta table → full-width live embed → Challenge → Approach → Outcome → `Open live site ↗` → next project link with a horizontal wipe transition.

Meta table rows, in this order:
```
SECTOR     Building Materials
ROLE       Development
AGENCY     PKG IT              [logo, 20px, silhouetted]
STACK      Next.js · Tailwind · GSAP
YEAR       2025
DURATION   3 weeks
```

### 5.6 About
Two columns, asymmetric. Left: photo (`assets.profile`, see §2.7). Right: bio in three short paragraphs, then the stat counters.

The bio must name PKG IT plainly in one sentence — no more. Something in the shape of: *"I build production websites at PKG IT in Dhaka, mostly for manufacturers and operators."* Stated once, in passing, without apology or inflation. That's how someone confident about their position phrases it.

Bio must be written by Amartya, in first person, plain, specific, and 100 words max. It should mention Dhaka, the kind of clients he works with, and one honest opinion about how he works. An opinion is what makes an about section memorable.

Photo treatment: duotone to `--machine` / `--concrete`, with the original colour revealed inside a circular mask that follows the cursor. Restrained — 180px radius, soft edge.

### 5.7 Capabilities
Not a grid of logo badges. A **spec table**: four rows (Frontend / Backend / Data / Delivery), each row a mono label on the left and the items as a wrapping list on the right, separated by hairlines. Hovering a row lifts its opacity to 1 and drops the others to 0.4. On scroll-in, rows reveal with a `clip-path` inset wipe from left, staggered.

### 5.8 Industries — *replaces the removed testimonials slot*

An 11-cell grid on `--concrete-2`. Each cell:

```
┌──────────────┐
│  [chip 88px] │   ← sector material texture, §2.7
│              │
│  BUILDING    │   ← Martian Mono 11px uppercase
│  MATERIALS   │
│  2 builds    │   ← --ink-mute
└──────────────┘
```

Grid: 5 columns desktop / 3 tablet / 2 mobile, hairline `--rule` dividers between cells, no gaps — a continuous specimen sheet, like a materials sample board.

Hover: the chip desaturates to full grey and the sector label goes `--signal`. Clicking filters the project index (§5.4) to that sector.

Scroll-in: chips reveal with a `clip-path` inset wipe, staggered `0.04` in reading order.

Label: `[ 05 ]  INDUSTRIES SERVED` with right-aligned mono `11 SECTORS`

This is where the material chips earn their second use, and it gives the page a texture moment that isn't the Live Rig. It also carries real information — which industries, not just which logos — so it isn't a repeat of §5.3.

### 5.9 Process
Four steps: `Understand → Design → Build → Ship`. Sticky left column with the current step index in large display type; right column scrolls the descriptions. The index morphs with a numeric roll animation.

### 5.10 Contact
Full-bleed `--machine`. Oversized display heading. Left: the form. Right: direct email, WhatsApp, GitHub, LinkedIn, plus a **live Dhaka clock** (`GMT+6`) updating every second in mono — a small, real, human detail that signals a person rather than a template.

Form: Name, Email, Company (optional), Message. POST to `https://formspree.io/f/mpqvkpgd` as JSON with `Accept: application/json`.
States: idle → validating → sending → sent → error. All four written out, no browser defaults, no emoji.
- Error copy: `That didn't send. Email me directly at [address] and I'll get back to you today.`
- Success copy: `Message sent. I'll reply within 24 hours.`
Honeypot field `_gotcha` for spam.

### 5.11 Footer
Giant `AMARTYA BAUL` in display type, clipped at the baseline, scaling up as it enters. Above it: three columns (nav · socials · `hello@…`). Below: `© 2026 · Built in Dhaka` and a back-to-top that triggers a Lenis scroll.

### 5.12 WebGL usage policy
Three.js is used in **exactly one place**: the hero atmosphere plane. That's it.

- Loaded via `next/dynamic` with `ssr: false`
- Not loaded at all below 1024px, or on `prefers-reduced-motion`, or on `navigator.hardwareConcurrency <= 4`, or when `navigator.connection.saveData` is true
- Static fallback: a pre-rendered grain texture at the same value
- Capped at 30fps via a frame-skip; it is ambient, it does not need 60
- Renderer `powerPreference: "low-power"`, DPR capped at 1.5
- `renderer.dispose()` on unmount, and the render loop pauses when the hero leaves the viewport

Rationale: a 380KB Three.js bundle is worth it for one moment that people remember. It is not worth it for three moments nobody notices.

---

## 6. The Live Rig — technical spec

This is the highest-risk component. Specify it precisely or the site will be slow.

### 6.1 The problem
11 live iframes = 11 full websites loading = hundreds of requests, hundreds of MB, and destroyed scroll performance. Never mount them all.

### 6.2 The solution — poster-first, iframe on demand

```
State 1  POSTER   → static WebP screenshot via next/image (default)
State 2  BOOTING  → poster still visible, iframe mounting behind, LED = LOADING
State 3  LIVE     → iframe visible, poster fades out, LED = LIVE
```

Rules:
- **Maximum 2 iframes mounted at any time.** Keep an LRU list; unmount the oldest.
- An iframe mounts only when: viewport ≥ 1024px **AND** the rig is the active pinned project **AND** the user has been on that project for > 400ms.
- Unmount as soon as it is two steps away from active.
- `loading="lazy"`, `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"`, `referrerPolicy="no-referrer"`, `title` set to the client name.
- `pointer-events: none` on the iframe so scroll passes through cleanly. Interaction is deliberate: clicking opens the real site.
- Scaling: iframe rendered at a logical `1440 × 900`, then `transform: scale(containerWidth / 1440)` with `transform-origin: top left`, in a container with `overflow: hidden`.
- **Mobile (<1024px): posters only, always. No iframes.** Non-negotiable.
- Failure handling: if the frame fails to load within 6s, or the target sends `X-Frame-Options: DENY` / `frame-ancestors` CSP, stay on the poster permanently and set the LED to `OFFLINE`. The section must be fully functional with zero iframes ever loading.

### 6.3 Poster screenshots
Required before launch: 11 WebP files at `/public/posters/{slug}.webp`, 1440×900, quality 80, target < 120KB each.

Generate them by opening each site at 1440px and capturing, or with a screenshot API for the first pass. **Do not hotlink a screenshot service in production** — download the images and commit them. A third-party image API in the critical path is an outage waiting to happen.

### 6.4 Reduced motion
`prefers-reduced-motion: reduce` → no pinning, no scale transitions. The Work section becomes a simple vertical stack of posters with the label plates. Fully usable.

---

## 7. Motion system

### 7.1 Library decision
| Library | Use | Reason |
|---|---|---|
| **GSAP + ScrollTrigger** | Everything | Single timeline authority. No competing animation engines. |
| **Lenis** | Smooth scroll | Synced to GSAP ticker. |
| **Three.js** | Hero only, lazy | One moment. §5.12. |
| ~~Framer Motion~~ | **Not used** | Overlaps GSAP entirely. Two engines = double bundle, fighting transforms, and an agent that mixes paradigms mid-file. Page transitions are done in GSAP. |

This is a deliberate reduction from the original four-library brief. It costs nothing visually and saves roughly 45KB gzipped plus a large class of bugs.

### 7.2 Tokens
```js
export const EASE   = { out: "power4.out", inOut: "power3.inOut", expo: "expo.out" };
export const DUR    = { micro: 0.3, base: 0.8, hero: 1.2, curtain: 0.9 };
export const STAGGER= { tight: 0.03, base: 0.06, loose: 0.1 };
```

Lenis: `{ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false }`
`syncTouch: false` is intentional — smooth-scroll on touch feels broken and hurts perceived performance.

### 7.3 Effect inventory & placement

| Effect | Where | Desktop | Mobile |
|---|---|---|---|
| Preloader counter + mask reveal | Site load | ✅ | ✅ simplified, 1.2s |
| Custom cursor (blend-difference, magnetic, contextual label) | Global | ✅ | ❌ removed |
| Lenis smooth scroll | Global | ✅ | ❌ native |
| Character mask reveal | All headings | ✅ | ✅ word-level, not char |
| WebGL hero atmosphere | Hero | ✅ | ❌ static texture |
| Velocity-reactive marquee | Client logos | ✅ | ✅ constant speed |
| Pinned Live Rig | Work | ✅ | ❌ vertical stack |
| Magnetic buttons | CTAs | ✅ | ❌ |
| Curtain page transition | Route change | ✅ | ✅ 400ms fade |
| Cursor-follow photo unmask | About | ✅ | ❌ static duotone |
| Text scramble | Rig label plate | ✅ | ❌ |
| Number roll counters | Stats, process | ✅ | ✅ |
| Clip-path row wipes | Capabilities | ✅ | ✅ |
| Link underline draw | All links | ✅ | ❌ |
| Scroll progress + section indicator | Global | ✅ | ❌ |

**Cut in v1.1:** the image-trail-on-cursor effect. It belongs to photographer and fashion portfolios; on a developer portfolio it reads as decoration for its own sake, and it has become an AI-slop signal in itself. Cutting it also removes a 6-image preload. Do not add it back.

### 7.4 Implementation discipline
- All ScrollTriggers registered inside `gsap.matchMedia()` with breakpoints `isDesktop (≥1024)`, `isMobile (<1024)`, `reduceMotion`
- Every effect in a `useGSAP()` hook with a scoped ref, and `ScrollTrigger.refresh()` after fonts load
- Animate **only** `transform` and `opacity`. Never `top/left/width/height`. `clip-path` is permitted (it's compositable in modern browsers).
- `will-change` applied on animation start and removed on complete — never left in CSS permanently
- Full cleanup on unmount: `ctx.revert()`
- `ScrollTrigger.config({ ignoreMobileResize: true })` to stop mobile URL-bar resize from re-triggering everything

---

## 8. Technical spec

### 8.1 Stack
Next.js 14+ App Router · JavaScript (no TypeScript) · Tailwind CSS · GSAP · Lenis · Three.js · deployed on Vercel from GitHub.

### 8.2 Structure
```
/app
  layout.js                 # fonts, metadata, providers
  page.js                   # home
  work/[slug]/page.js       # case study
  work/[slug]/not-found.js
  not-found.js
  api/                      # reserved — empty in v1
/components
  /layout      Nav, Footer, Preloader, PageTransition, Cursor, SmoothScroll
  /sections    Hero, Marquee, Work, About, Industries, Capabilities, Process, Contact
  /work        LiveRig, LabelPlate, RigChassis, ProjectIndex
  /ui          Button, MagneticWrap, RevealText, SplitText, Counter, ScrambleText, MonoLabel, Monogram
  /webgl       HeroAtmosphere (dynamic, ssr:false), shaders/
/lib
  gsap.js        # single registration point for plugins
  motion.js      # EASE, DUR, STAGGER tokens
  useIsDesktop.js
  useLenis.js
/data
  profile.js
  projects.js
  capabilities.js
  assets.js       # Cloudinary -> /public paths, single source of truth
/public
  /posters       11 WebP screenshots
  /logos         11 client logos + pkg-it (downloaded, not hotlinked)
  /fonts
  favicon.svg, icon-*.png, apple-touch-icon.png
```

### 8.3 Future-backend readiness
Content is hardcoded in `/data`, but **every component reads content through `/lib/content.js`**, which exposes async functions:

```js
export async function getProjects()        { return projects; }
export async function getProject(slug)     { ... }
export async function getAssets()          { return assets; }
export async function getProfile()         { return profile; }
```

Components `await` these even though they resolve instantly. When a CMS or database arrives, only `content.js` changes — zero component edits. This costs nothing now and saves a rewrite later.

Data shapes must be flat, serialisable JSON — no functions, no JSX, no imported components inside data files.

### 8.4 Assets
- Client logos: **download the Cloudinary images and commit them to `/public/logos/`.** Do not hotlink in production. Cloudinary URLs are fine during development.
- All images through `next/image` with explicit `width`/`height` and `sizes`
- Fonts self-hosted via `next/font/local` (Satoshi) and `next/font/google` (Archivo, Martian Mono) with `display: "swap"` and preload on the display face only

### 8.5 SEO
Per-page metadata, OG image (a rendered card in the Machine Room palette), `robots.txt`, `sitemap.xml`, JSON-LD `Person` + `WebSite` schema, canonical URLs. Title pattern: `Amartya Baul — Full-Stack Developer` / `IDS Group — Case Study · Amartya Baul`.

### 8.6 Accessibility floor
Not optional, and not in tension with the design.
- Visible focus rings using `--signal`, never `outline: none` without a replacement
- Preloader and page transitions do not trap focus
- Custom cursor is decorative only — native cursor logic and hit areas remain intact
- All iframes have `title`
- All animated text is present in the DOM as real text at all times (split into spans, never rendered into canvas)
- Colour contrast ≥ 4.5:1 for body text on both grounds — verify `--ink-mute` on `--concrete` and `--chalk-mute` on `--machine`, and darken/lighten if they fail
- Full keyboard path to the contact form
- `prefers-reduced-motion` honoured everywhere

---

## 9. Performance budget

| Metric | Budget |
|---|---|
| LCP (mobile, 4G) | < 2.5s |
| CLS | < 0.02 |
| INP | < 200ms |
| Initial JS (home, gzipped, excl. Three.js) | < 190KB |
| Three.js chunk | lazy, desktop only |
| Poster image | < 120KB each |
| Total home page weight before scroll | < 1.2MB |
| Lighthouse Perf mobile | ≥ 90 |

Enforcement rules:
- Below 1024px: no Three.js, no iframes, no cursor, no pinning
- Everything below the fold is `next/dynamic`
- Fonts subset to latin
- Sections observed with `IntersectionObserver`; offscreen animations paused

---

## 10. Build phases

Each phase must be reviewed and committed before the next begins. Do not let the agent skip ahead.

| Phase | Deliverable | Definition of done |
|---|---|---|
| **0** | Repo, deps, tokens, fonts, data layer, `AGENTS.md` | `npm run dev` runs; tokens visible on a test page; all 11 projects render as plain text |
| **1** | All sections, static, responsive, zero animation | Full site scrollable and correct on 375 / 768 / 1440 / 1920. Looks good *without* motion — this is the real test of the design |
| **2** | Motion core: Lenis, GSAP setup, reveals, preloader, cursor, magnetic | No jank, no layout shift, reduced-motion path works |
| **3** | The Live Rig | Pinning, iframe lifecycle, LRU cap, poster fallback, mobile stack |
| **4** | WebGL hero, marquee velocity, scramble, page transitions | Desktop-gated, dispose verified, no memory growth over 5 min |
| **5** | Case study pages + Formspree contact + all form states | Real submission received in Formspree |
| **6** | Content pass — real case study copy, real bio, logos downloaded, posters generated | No lorem, no invented metrics, no placeholder names anywhere |
| **7** | Performance, a11y, SEO, cross-browser, deploy | All budgets in §9 met; Lighthouse run on the deployed URL |

**Phase 1 is the checkpoint that matters most.** If the site is not impressive as a static page, animation will not save it — it will just be slop in motion.

---

## 11. Open items for Amartya

**Launch blockers**
- [ ] Remove the backgrounds from `anwar-cement-sheet` and `a1-polymer` logos, re-export as transparent PNG
- [ ] Buy the domain (recommended: `amartyabaul.com`) and set `profile.seo.domain`

**Before going live**
- [ ] GitHub and LinkedIn URLs — the links stay hidden until these are filled
- [ ] Confirm the bio in `/data/profile.js`. Two alternates are in the file; ship the one whose opinion is actually yours.
- [ ] Confirm or remove the "100% on-time delivery" stat — only claim it if it's true
- [ ] Check the 32px favicon in a real browser tab

**Closed in v1.2**
- ~~Real name and sector for `tel`~~ — TEL Plastics, Recycled Plastics
- ~~Per-project `role`~~ — Design & Development on all 11
- ~~PKG IT logo~~ — supplied, doubles as the agency credit mark
- ~~Email and WhatsApp~~ — in `/data/profile.js`
- ~~About bio~~ — written, three paragraphs, one alternate each way
- ~~11 posters~~ — captured, cropped, WebP, 534KB total

**Closed in v1.1**
- ~~Set `type` per project~~ — all confirmed client work at PKG IT
- ~~Collect testimonials~~ — section cut, replaced by §5.3 and §5.8
- ~~Decide on the image trail~~ — cut
