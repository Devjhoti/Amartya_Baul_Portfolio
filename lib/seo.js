/**
 * Single source of truth for the site's absolute URL. Set NEXT_PUBLIC_SITE_URL
 * in Vercel once the real domain exists (see README); the fallback is the
 * expected Vercel project URL so canonical/sitemap/OG are never relative.
 * PRD §8.5
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://amartya-baul-portfolio.vercel.app"
).replace(/\/$/, "");
