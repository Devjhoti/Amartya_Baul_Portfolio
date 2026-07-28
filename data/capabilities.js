/**
 * /data/capabilities.js
 *
 * Grouped capability rows — four systems, expanded on client direction so
 * each orbit reads as a full sphere. Names that also appear in project
 * stacks ("HTML", "CSS", not "HTML5") keep their stack spelling so the
 * honest usage counts keep matching. Read through /lib/content.js via
 * getCapabilities(). PRD §2.5 · §8.3
 */

export const capabilities = [
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "Three.js",
      "Vite",
      "Lenis",
    ],
  },
  {
    group: "Backend",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "Authentication",
      "JWT",
      "Socket.IO",
      "NPM",
      "Postman",
    ],
  },
  {
    group: "Data",
    items: ["MongoDB", "Mongoose", "PostgreSQL", "MySQL", "Prisma", "Firebase"],
  },
  {
    group: "Delivery",
    items: [
      "Vercel",
      "Netlify",
      "Git",
      "GitHub",
      "Cloudinary",
      "Figma",
      "Performance & SEO",
    ],
  },
];

export default capabilities;
