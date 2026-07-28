/**
 * Minimal monochrome marks for the stack technologies — inline, currentColor,
 * no external assets. Iconic shapes where one exists (React's atom, Vite's
 * bolt, Tailwind's waves, Framer's F, Three's mesh), lettermarks for the rest.
 * Used on the cinema's right wall spec sheet.
 */
const GLYPHS = {
  react: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  vite: <path d="M13 2 3.5 13.5h6L8 22l9.5-11.5h-6L13 2z" />,
  tailwind: (
    <path d="M4 10c1.5-3 3.5-4.2 6-3.2 1.4.6 2.2 1.7 4 2 2 .3 3.4-.6 4.5-2.3-1.5 3-3.5 4.2-6 3.2-1.4-.6-2.2-1.7-4-2-2-.3-3.4.6-4.5 2.3zm0 7c1.5-3 3.5-4.2 6-3.2 1.4.6 2.2 1.7 4 2 2 .3 3.4-.6 4.5-2.3-1.5 3-3.5 4.2-6 3.2-1.4-.6-2.2-1.7-4-2-2-.3-3.4.6-4.5 2.3z" fill="currentColor" stroke="none" />
  ),
  three: (
    <>
      <path d="M12 3 21 20H3L12 3z" />
      <path d="M7.5 11.5h9M12 3v8.5M7.5 20l4.5-8.5M16.5 20 12 11.5" strokeWidth="1" />
    </>
  ),
  framer: <path d="M6 3h12v6h-6l6 6h-6v6l-6-6v-6h6L6 3z" fill="currentColor" stroke="none" />,
  nextjs: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9 16V8l7.5 9.5" strokeWidth="1.6" />
    </>
  ),
  vercel: <path d="M12 4.5 21 19.5H3L12 4.5z" fill="currentColor" stroke="none" />,
  node: (
    <>
      <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5z" />
      <path d="M9.5 15.5V9l5 6.5V9" strokeWidth="1.2" />
    </>
  ),
  git: (
    <>
      <circle cx="7" cy="5.5" r="2" />
      <circle cx="7" cy="18.5" r="2" />
      <circle cx="17.5" cy="9" r="2" />
      <path d="M7 7.5v9M7 12.5c5 0 6-1 8.6-2.4" strokeWidth="1.2" />
    </>
  ),
  mongodb: (
    <>
      <path d="M12 2.5c3.6 4.2 4.6 7.8 3.5 11.3-.8 2.7-2.4 4.5-3.5 5.9-1.1-1.4-2.7-3.2-3.5-5.9C7.4 10.3 8.4 6.7 12 2.5z" />
      <path d="M12 7v13" strokeWidth="1" />
    </>
  ),
  auth: (
    <>
      <rect x="6" y="11" width="12" height="9" />
      <path d="M8.5 11V7.5a3.5 3.5 0 0 1 7 0V11" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  cloudinary: (
    <path d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17 8.6 3.8 3.8 0 0 1 17.4 16H7z" />
  ),
  performance: (
    <>
      <path d="M4 17.5a8 8 0 1 1 16 0" />
      <path d="M12 17.5 16.5 12" strokeWidth="1.6" />
      <circle cx="12" cy="17.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  prisma: <path d="M12.5 3 20 18.5 6 21 12.5 3z" />,
};

const LETTERS = {
  gsap: "G",
  lenis: "Ln",
  html: "<>",
  css: "{}",
  javascript: "JS",
  typescript: "TS",
  express: "EX",
  rest: "API",
  postgres: "PG",
};

const keyOf = (name) => {
  const n = name.toLowerCase();
  if (n.includes("react")) return "react";
  if (n.includes("next")) return "nextjs";
  if (n.includes("vite")) return "vite";
  if (n.includes("tailwind")) return "tailwind";
  if (n.includes("three")) return "three";
  if (n.includes("framer")) return "framer";
  if (n.includes("gsap")) return "gsap";
  if (n.includes("lenis")) return "lenis";
  if (n.includes("html")) return "html";
  if (n.includes("typescript")) return "typescript";
  if (n.includes("css")) return "css";
  if (n.includes("javascript") || n === "js") return "javascript";
  if (n.includes("node")) return "node";
  if (n.includes("express")) return "express";
  if (n.includes("rest") || n.includes("api")) return "rest";
  if (n.includes("auth")) return "auth";
  if (n.includes("mongo")) return "mongodb";
  if (n.includes("postgre")) return "postgres";
  if (n.includes("prisma")) return "prisma";
  if (n.includes("vercel")) return "vercel";
  if (n.includes("git")) return "git";
  if (n.includes("cloudinary")) return "cloudinary";
  if (n.includes("performance") || n.includes("seo")) return "performance";
  return null;
};

export default function TechIcon({ name, className = "h-4 w-4" }) {
  const key = keyOf(name);
  const glyph = key && GLYPHS[key];
  const letters = key && LETTERS[key];

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      {glyph ??
        (letters ? (
          <>
            <rect x="2" y="2" width="20" height="20" />
            <text
              x="12"
              y="16"
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              stroke="none"
              fontFamily="inherit"
            >
              {letters}
            </text>
          </>
        ) : (
          <rect x="2" y="2" width="20" height="20" />
        ))}
    </svg>
  );
}
