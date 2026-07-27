import { getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

/** Home plus all 11 case studies. PRD §8.5 */
export default async function sitemap() {
  const projects = await getProjects();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
