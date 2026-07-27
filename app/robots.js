import { SITE_URL } from "@/lib/seo";

/** PRD §8.5 */
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
