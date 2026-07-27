/**
 * /data/profile.js
 *
 * Read through /lib/content.js via getProfile(). PRD §8.3
 */

export const profile = {
  name: "Amartya Baul",
  role: "Full-Stack Developer",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka", // drives the live clock in the contact section, PRD §5.10
  employer: "PKG IT",

  // Hero — PRD §5.2. "MACHINES" is the single word set in --signal.
  headline: ["FULL-STACK", "DEVELOPER", "BUILDING FOR", "MACHINES."],
  headlineAccentLine: 3,

  intro:
    "I build production websites for manufacturers, industrials and operators — cement, steel, paint, lifts, hotels. Sites that hold up on a 3G phone in a hardware shop.",

  // About — PRD §5.6. Three short paragraphs.
  // Option A selected. B and C are kept below; swap if one is truer to how you work.
  bio: [
    "I'm a full-stack developer in Dhaka. I build production websites at PKG IT, mostly for manufacturers and operators — cement, steel, polymer, paint, lubricants, lifts, hotels. Eleven industries in two years.",
    "What I care about most is that a site holds up outside a design review. A dealer opening a product page on a cheap Android in a hardware shop is the real test, not a 27-inch monitor. I build for that first and make it beautiful second — done properly, that isn't a trade-off.",
    "Open to freelance and contract work.",
  ],

  stats: [
    { value: 20, suffix: "+", label: "Projects shipped" },
    { value: 2, suffix: "+", label: "Years building" },
    { value: 11, suffix: "", label: "Industries served" },
  ],

  contact: {
    email: "amartyabaul69@gmail.com",
    whatsapp: "01882222833",
    whatsappIntl: "+8801882222833", // used for the wa.me link
    github: "", // NEEDS_AMARTYA — link hides until filled
    linkedin: "", // NEEDS_AMARTYA — link hides until filled
  },

  // Contact form — PRD §5.10
  formEndpoint: "https://formspree.io/f/mpqvkpgd",

  seo: {
    title: "Amartya Baul — Full-Stack Developer",
    description:
      "Full-stack developer in Dhaka building production websites for manufacturers, industrials and operators. 20+ projects across 11 industries.",
    domain: "", // NEEDS_AMARTYA — e.g. amartyabaul.com
  },
};

/**
 * Alternate bios. Same length, different opinion. Only ship the one that is
 * actually true for you — the opinion is the entire point of the paragraph.
 *
 * B — on scope:
 *   "Most of the sites I'm asked to build start with a feature list. The useful
 *    part of my job is working out which three things on it actually matter to
 *    the business, and building those properly instead of all twelve badly."
 *
 * C — on speed:
 *   "I treat load time as a design decision, not a cleanup task at the end. A
 *    beautiful page that takes eight seconds on mobile data has already lost
 *    the visitor it was made for."
 */

export default profile;
