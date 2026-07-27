import { Archivo, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getProfile } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import Preloader from "@/components/layout/Preloader";
import PageTransition from "@/components/layout/PageTransition";
import ScrollProgress from "@/components/layout/ScrollProgress";
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
    metadataBase: new URL(SITE_URL),
    title: profile.seo.title,
    description: profile.seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: profile.seo.title,
      title: profile.seo.title,
      description: profile.seo.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: profile.seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.seo.title,
      description: profile.seo.description,
      images: ["/og.png"],
    },
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

export default async function RootLayout({ children }) {
  const profile = await getProfile();
  // JSON-LD Person + WebSite. PRD §8.5
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        jobTitle: profile.role,
        email: `mailto:${profile.contact.email}`,
        worksFor: { "@type": "Organization", name: profile.employer },
        address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: profile.seo.title,
        description: profile.seo.description,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <html
      lang="en"
      // The body-start script adds the .js class before hydration (the CLS
      // guard for reveal text) — an intentional pre-hydration mutation of this
      // one element, so React must not compare its attributes.
      suppressHydrationWarning
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        <PageTransition />
        <Preloader />
      </body>
    </html>
  );
}
