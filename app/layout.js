import { Archivo, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getProfile } from "@/lib/content";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import Preloader from "@/components/layout/Preloader";
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
// Preloaded alongside the display face: the hero's spec-plate labels are mono
// and visible from first paint — a late mono swap re-wraps them, which was a
// measured 0.03 CLS. ~15KB buys a stable first frame. (Deviation from §8.4
// "preload display only", flagged for the Phase 7 audit.)
const martianMono = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-martian",
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
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${satoshi.variable} ${martianMono.variable}`}
    >
      <body className="bg-concrete font-body text-ink">
        {/* Runs before anything below paints: gates the pre-hydration hiding of
            reveal text (.js [data-st-hide]) so no-JS visitors see everything. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
        <SmoothScroll />
        <Cursor />
        <Preloader />
      </body>
    </html>
  );
}
