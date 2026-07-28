/**
 * /data/projects.js
 *
 * All content is flat, serialisable JSON. Components never import this file
 * directly — they go through the async getters in /lib/content.js, so a CMS or
 * database can be added later by changing one file. PRD §8.3
 *
 * Phase 6 content pass: challenge / approach / outcome written from the live
 * sites themselves (visited and read, not imagined), and every stack corrected
 * to what the shipped bundles actually contain. No invented numbers — every
 * figure that appears comes from the client's own published site.
 * Anything marked NEEDS_AMARTYA must be confirmed before launch. Grep for it.
 */

export const projects = [
  {
    slug: "ids-group",
    client: "IDS Group",
    sector: "Corporate / Group", // NEEDS_AMARTYA — live site presents a fashion & woven-textiles group; confirm this label
    chip: "concrete",
    url: "https://ids-group-demo-web.vercel.app/",
    logo: "/logos/ids-group.png",
    poster: "/posters/ids-group.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite", "GSAP", "Lenis"],
    tagline: "Group identity for a fashion and woven-textiles house — collections first, credentials in support.",
    challenge:
      "IDS Group is a fashion and woven-textiles group whose buyers and partners judge it the way they judge a collection — visually. The group needed one corporate address that could stand that scrutiny: collections, sustainability, careers and its partner network, presented with the confidence of a fashion house rather than a trading company.",
    approach: [
      "Led the site with the collections themselves — full-bleed imagery and editorial type — instead of a corporate mission statement.",
      "Structured the group story into Atelier, Sustainability, Career and Partners, so each audience lands one click from what it came for.",
      "Kept the partner network on the home page — for an export house, who you already work with is the strongest credential.",
      "Treated motion as pacing, not decoration: the page reads like a lookbook, section by section.",
    ],
    outcome: [
      "The group presents like a fashion brand, not a manufacturer's brochure — collections first, credentials in support.",
      "One address now serves buyers, partners and applicants without splitting into separate microsites.",
    ],
  },
  {
    slug: "pauls-academy",
    client: "Paul's Academy",
    sector: "Education",
    chip: "slate",
    url: "https://pauls-academy-web-demo.vercel.app/",
    logo: "/logos/pauls-academy.png",
    poster: "/posters/pauls-academy.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["Next.js", "React", "Tailwind CSS"],
    tagline: "Cambridge & Edexcel school site — the whole admission path readable by a parent in one evening.",
    challenge:
      "Parents choosing a school compare curricula, fees and admission steps across many websites, and most school sites bury exactly those answers. Paul's Academy needed its Cambridge and Edexcel pathways, its eight programmes, and the entire admission process readable by a parent in one evening.",
    approach: [
      "Put the admission process, fees and scholarships in the main navigation instead of behind an enquiry form — the questions parents actually ask come first.",
      "Organised academics by school stage — primary, middle, high — so a parent reads only the path that applies to their child.",
      "Gave campus life equal weight to academics: festivals, sports, labs and clubs, photographed rather than described.",
      "Added an assistant trained on admissions and curriculum questions, so an answer at 11pm doesn't wait for office hours.",
      "Kept student, teacher and admin logins on the same address, so the public site and the school's daily operations share one front door.",
    ],
    outcome: [
      "A parent can go from first visit to a submitted application without phoning the office.",
      "The site answers curriculum and fee questions directly — exactly the filtering an admissions desk wants its website to do.",
    ],
  },
  {
    slug: "property-lifts",
    client: "Property Lifts",
    sector: "Vertical Transport",
    chip: "brushed",
    url: "https://property-lifts-portfolio.vercel.app/",
    logo: "/logos/property-lifts.png",
    poster: "/posters/property-lifts.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite", "GSAP", "Three.js", "Framer Motion"],
    tagline: "Passenger, hospital, cargo and home lifts — catalogued the way a purchaser actually shops.",
    challenge:
      "A lift is a considered purchase — buyers arrive with a building, a budget and safety questions, and they need to trust the vendor before inviting them on site. Property Lifts needed its full range — passenger, hospital, cargo, home and imported units — presented with enough engineering confidence to earn that first call.",
    approach: [
      "Organised the catalogue by building type and duty — passenger, medical, industrial, residential — mirroring how a purchaser actually shops.",
      "Made 'Plan your elevator' a structured form with project location and requirements, so enquiries arrive qualified instead of blank.",
      "Kept imported brands — KONE, SRH, MP — clearly distinct from own products; honest sourcing reads as reliability in this market.",
      "Borrowed the interface language from the product itself — floor indicator, controlled vertical motion — so precision is felt rather than claimed.",
    ],
    outcome: [
      "Every product family carries its own detail page, so sales conversations start at 'which lift', not 'what do you sell'.",
      "Enquiries carry project location and requirements from the first message.",
    ],
  },
  {
    slug: "anwar-cement-sheet",
    client: "Anwar Cement Sheet",
    sector: "Building Materials",
    chip: "corrugated",
    url: "https://anwar-cement-sheet-prd.vercel.app/",
    logo: "/logos/anwar-cement-sheet.png", // white bg keyed out locally; swap in a clean official export when available
    poster: "/posters/anwar-cement-sheet.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite", "GSAP", "Lenis"],
    tagline: "Six-layer German-engineered roofing, with its full spec sheet finally on the web.",
    challenge:
      "Anwar Cement Sheet sells a technical product through dealers and builders who need exact specifications — thickness, sizes, layer construction — and those questions were being answered one phone call at a time. The product needed its specification sheet on the web, readable on a phone in a hardware shop.",
    approach: [
      "Built the site around the six-layer construction itself, each layer named and explained — the layered engineering is the entire sales argument.",
      "Gave all three sheet grades their own specification table — thickness, sizes, use cases — the numbers a dealer actually quotes.",
      "Kept the 16685 hotline visible on every screen for the buyer who still orders by phone.",
      "Showed the product on real roofs in a 'Where it's used' section — application photographs over adjectives.",
    ],
    outcome: [
      "The full spec sheet per grade is self-serve, so the hotline takes orders instead of reading dimensions aloud.",
      "Dealers and site engineers can check sizes from a phone without waiting for a printed catalogue.",
    ],
  },
  {
    slug: "hotel-the-glory",
    client: "Hotel The Glory",
    sector: "Hospitality",
    chip: "terrazzo",
    url: "https://hotel-the-glory-web.vercel.app/",
    logo: "/logos/hotel-the-glory.png",
    poster: "/posters/hotel-the-glory.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite", "GSAP", "Lenis"],
    tagline: "Sylhet hospitality sold direct — rooms, tours and event halls without the aggregators.",
    challenge:
      "Hotel The Glory competes for Sylhet's travellers against booking platforms that show its rooms next to everyone else's. The hotel needed its own address to sell what aggregators flatten: the rooms themselves, the location near the airport and the shrine, the tour desk, and the event halls.",
    approach: [
      "Led with an enquiry flow — dates, guests, room type — on the first screen, capturing booking intent before a visitor drifts back to an aggregator.",
      "Presented every room and suite as its own spread rather than a thumbnail grid.",
      "Sold the destination alongside the hotel — curated excursions to Hazrat Shahjalal Shrine, Ratargul and the Srimangal tea estates — because that is why guests come to Sylhet.",
      "Included a cinematic property walkthrough: a virtual tour answers 'what is it really like' better than any adjective.",
    ],
    outcome: [
      "Direct enquiries arrive with dates, party size and room preference already attached.",
      "Corporate organisers can assess the executive halls without a site visit.",
    ],
  },
  {
    slug: "caltex",
    client: "Caltex",
    sector: "Lubricants",
    chip: "oil",
    url: "https://caltex-demo.vercel.app/",
    logo: "/logos/caltex.png",
    poster: "/posters/caltex.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite", "GSAP", "Lenis"],
    tagline: "Fuels, additives and lubricants routed by audience, with published prices kept current.",
    challenge:
      "Caltex's Bangladesh range spans fuels, additives and lubricants for everyone from a scooter owner to a fleet operator — audiences with completely different questions. The brand needed one site that routes each of them to the right product and keeps published prices current.",
    approach: [
      "Split the site by audience first — motorists and businesses — before product family, so nobody reads past diesel fleets to find scooter oil.",
      "Published the product price list with a last-updated stamp — in a market of negotiated prices, the printed number builds trust.",
      "Added a lubricants finder that narrows by vehicle type, replacing the guesswork conversation at the parts counter.",
      "Kept rewards and the fuel-payment app one tap from the header — repeat custom is the business model.",
    ],
    outcome: [
      "Product, price and where-to-buy sit in one place, current and quotable.",
      "Vehicle owners self-select the correct oil instead of relying on the retailer's guess.",
    ],
  },
  {
    slug: "rainbow-paints",
    client: "Rainbow Paints",
    sector: "Paints & Coatings",
    chip: "stipple",
    url: "https://rainbow-paints-web-demo.vercel.app/",
    logo: "/logos/rainbow-paints.png",
    poster: "/posters/rainbow-paints.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["Next.js", "React", "Tailwind CSS"],
    tagline: "Nine coating categories under one address — and colour you can try before you buy.",
    challenge:
      "Rainbow Paints, a concern of RFL Group, covers nine coating categories from decorative walls to marine and powder coating. Homeowners and industrial buyers were being served by the same brochure — and neither could see colour, the one thing paint has to show.",
    approach: [
      "Separated decorative from industrial from the first click — a homeowner and a factory engineer share nothing but the brand.",
      "Built colour into the interface: a visualizer where shades are tried on a room, not printed as chips.",
      "Added a paint calculator, so a buyer arrives at the showroom knowing litres instead of guessing.",
      "Backed the products with a smart guide — finishes, tips, FAQ — the questions painters actually ask at the counter.",
    ],
    outcome: [
      "All nine categories and the company's 250-showroom network live under one address, navigable by audience.",
      "Colour decisions start on the site, which is where a paint purchase actually begins.",
    ],
  },
  {
    slug: "tel",
    client: "TEL Plastics",
    sector: "Recycled Plastics",
    chip: "regrind",
    url: "https://tel-website-demo-pkgit.vercel.app/",
    logo: "/logos/tel.png",
    poster: "/posters/tel.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    tagline: "Furniture from recycled plastic — the process told first, so provenance reads as quality.",
    challenge:
      "TEL Plastics makes furniture out of recycled plastic — a product whose origin is its selling point and its objection at once. The site had to make 'made from waste' read as engineering and care rather than compromise, for buyers comparing against virgin-plastic furniture.",
    approach: [
      "Told the process before the products — collect, sort, shred, mold, deliver — so provenance becomes the proof of quality.",
      "Opened with film, not copy: watching waste become furniture does the persuasion.",
      "Presented products as designed objects — named pieces, materials, colourways — not commodity SKUs.",
      "Gave sustainability its own chapter with the company's story, keeping every claim attached to the actual process.",
    ],
    outcome: [
      "The recycled origin now reads as the reason to buy, not the caveat.",
      "Each flagship piece has a page a retailer can send straight to a customer.",
    ],
  },
  {
    slug: "pkg-it",
    client: "PKG IT",
    sector: "IT Services",
    chip: "anodised",
    url: "https://pkg-it-portfolio.vercel.app/",
    logo: "/logos/pkg-it.png",
    poster: "/posters/pkg-it.webp",
    type: "internal", // employer's own site — labelled INTERNAL, not CLIENT. PRD §2.2.1
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite", "GSAP", "Lenis"],
    tagline: "The agency's own portfolio — capability demonstrated in motion, not described in bullets.",
    challenge:
      "An agency that sells design has exactly one credential that matters: its own website. PKG IT needed a portfolio that demonstrates — in motion, interaction and typography — the standard it promises clients, with the client list to back it up.",
    approach: [
      "Made the site itself the case study: custom animation and interaction throughout, because claims about craft are cheap.",
      "Led with the client roll — Rainbow Paints, Property Lifts, IDS Group, Caltex and the rest — over service descriptions.",
      "Kept the offer to three sharp disciplines instead of a menu of everything.",
    ],
    outcome: [
      "The portfolio demonstrates capability instead of describing it.",
      "A prospect sees recognisable Bangladeshi brands in the first scroll.",
    ],
  },
  {
    slug: "anowar-ispat",
    client: "Anwar Ispat", // brand spelling per the logo; slug keeps the URL spelling
    sector: "Steel & Metals",
    chip: "millscale",
    url: "https://anowar-ispat-demo.vercel.app/",
    logo: "/logos/anowar-ispat.png",
    poster: "/posters/anowar-ispat.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite", "Three.js"],
    tagline: "TMT rebar by grade — steel presented with the authority of the structures it carries.",
    challenge:
      "Anwar Ispat sells rebar into an infrastructure market where every mill claims strength. The brand needed its product grades — and the scale of what gets built with them — presented with enough authority to matter on a procurement shortlist.",
    approach: [
      "Organised the offer by grade — 500CWR, 500DWR, 420DWR — each with its engineering case and a direct quote action.",
      "Told steel as a cinematic sequence, furnace to finished structure, because the material's drama is the brand's asset.",
      "Put completed projects and media on the main navigation — in construction, evidence outranks adjectives.",
    ],
    outcome: [
      "A procurement engineer can go from grade to quote request in two clicks.",
      "The brand carries the visual weight of an infrastructure company, not a commodity trader.",
    ],
  },
  {
    slug: "a1-polymer",
    client: "A1 Polymer",
    sector: "Polymer & Plastics",
    chip: "pellets",
    url: "https://a1-polymer-demo-web.vercel.app/",
    logo: "/logos/a1-polymer.png", // already transparent — no background removal needed
    poster: "/posters/a1-polymer.webp",
    type: "client",
    context: "PKG IT",
    role: "Design & Development",
    year: "2025",
    duration: "",
    stack: ["React", "Vite"],
    tagline: "uPVC piping led by ISO certifications and public-sector references, not price.",
    challenge:
      "A1 Polymer sells uPVC piping into projects where failure is buried underground — so institutional buyers check certification and track record before price. The site needed to carry the ISO certifications, the public-sector reference list and the Anwar Group lineage in one authoritative place.",
    approach: [
      "Led with the certifications — ISO 9001, 14001, 45001 — and the awards stage, because compliance is the first gate in institutional procurement.",
      "Named the references: Dhaka WASA, Bangladesh Krishi Unnayan Corporation, Military Engineer Services — a partner list that closes arguments.",
      "Anchored the brand to Anwar Group's legacy, giving a young product line an old balance sheet.",
      "Kept a structured enquiry form and a customer login for the dealer relationships the business actually runs on.",
    ],
    outcome: [
      "Institutional buyers find certifications and references without requesting documents.",
      "The dealer network has a public face and a direct channel in one place.",
    ],
  },
];

export const agency = {
  name: "PKG IT",
  logo: "/logos/pkg-it-agency.png",
  url: "https://pkgit.net",
  caption: "AGENCY",
};

export default projects;
