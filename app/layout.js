import { Archivo, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getProfile } from "@/lib/content";
import "./globals.css";

/**
 * The three faces of the site, exposed as CSS variables on <html>.
 * Only the display face is preloaded. PRD §3.4 · §8.4
 */

// Display — Archivo variable with the width axis, so headings render at
// width 110. Headings only.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
});

// Utility — Martian Mono. Labels, indices, metadata. 11–13px, uppercase.
const martianMono = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-martian",
  preload: false,
});

// Body/UI — Satoshi, self-hosted. Files land in /public/fonts via
// `npm run fetch-fonts` — see public/fonts/README.md.
const satoshi = localFont({
  src: [
    { path: "../public/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-satoshi",
  preload: false,
});

export async function generateMetadata() {
  const profile = await getProfile();
  return {
    title: profile.seo.title,
    description: profile.seo.description,
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${satoshi.variable} ${martianMono.variable}`}
    >
      <body className="bg-concrete font-body text-ink">{children}</body>
    </html>
  );
}
