import type { MetadataRoute } from "next";
import { services, industries } from "@/lib/content";
import { live } from "@/lib/cms";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await live("post", 1000).catch(() => []);
  const paths = ["/", "/about", "/services", "/industries", "/our-approach", "/insights", "/contact", "/privacy", "/terms",
    ...services.map((s) => `/services/${s.slug}`), ...industries.map((i) => `/industries/${i.slug}`), ...posts.map((p) => `/insights/${p.slug}`)];
  return paths.map((p) => ({ url: site.url + p }));
}
