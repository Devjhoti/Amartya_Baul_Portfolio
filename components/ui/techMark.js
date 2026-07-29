/**
 * Real brand marks, committed to /public/tech — devicon (MIT) and simple-icons
 * (CC0, brand colour stamped in). Shared by the desktop orbit and the phone's
 * grid so a technology wears the same face wherever it appears. Anything
 * without a published mark falls through to TechIcon's monochrome glyph.
 */
export const TECH_MARKS = {
  React: "react.svg",
  "Next.js": "nextjs.svg",
  TypeScript: "typescript.svg",
  JavaScript: "javascript.svg",
  HTML: "html5.svg",
  CSS: "css3.svg",
  "Tailwind CSS": "tailwindcss.svg",
  GSAP: "gsap.svg",
  "Framer Motion": "framermotion.svg",
  "Three.js": "threejs.svg",
  Vite: "vite.svg",
  "Node.js": "nodejs.svg",
  Express: "express.svg",
  JWT: "jwt.svg",
  "Socket.IO": "socketio.svg",
  NPM: "npm.svg",
  Postman: "postman.svg",
  MongoDB: "mongodb.svg",
  Mongoose: "mongoose.svg",
  PostgreSQL: "postgresql.svg",
  MySQL: "mysql.svg",
  Prisma: "prisma.svg",
  Firebase: "firebase.svg",
  Vercel: "vercel.svg",
  Netlify: "netlify.svg",
  Git: "git.svg",
  GitHub: "github.svg",
  Cloudinary: "cloudinary.svg",
  Figma: "figma.svg",
};

export const markSrc = (name) =>
  TECH_MARKS[name] ? `/tech/${TECH_MARKS[name]}` : null;
