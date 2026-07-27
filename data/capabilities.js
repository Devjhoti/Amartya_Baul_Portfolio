/**
 * /data/capabilities.js
 *
 * Grouped capability rows for the spec table in §5.7 — four rows, not a badge
 * soup. Read through /lib/content.js via getCapabilities(). PRD §2.5 · §8.3
 */

export const capabilities = [
  {
    group: "Frontend",
    items: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Express", "REST APIs", "Authentication"],
  },
  {
    group: "Data",
    items: ["MongoDB", "PostgreSQL", "Prisma"],
  },
  {
    group: "Delivery",
    items: ["Vercel", "Git/GitHub", "Cloudinary", "Performance & SEO"],
  },
];

export default capabilities;
