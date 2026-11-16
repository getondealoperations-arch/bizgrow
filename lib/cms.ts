import { q, one } from "./db";

export type Item = { id: number; kind: string; slug: string; title: string; body: string; data: Record<string, string>; published: boolean; publish_at: string | null; created_at: string };

// Public visibility: published AND (no schedule OR schedule has passed). This is how scheduling works.
const LIVE = "published AND (publish_at IS NULL OR publish_at <= now())";

export const live = (kind: string, limit = 50) =>
  q<Item>(`SELECT * FROM cms_items WHERE kind=$1 AND ${LIVE} ORDER BY coalesce(publish_at, created_at) DESC LIMIT $2`, [kind, limit]);
export const liveOne = (kind: string, slug: string) =>
  one<Item>(`SELECT * FROM cms_items WHERE kind=$1 AND slug=$2 AND ${LIVE}`, [kind, slug]);

// Editable SEO overrides keyed by path (kind='seo', slug=path)
export async function seo(path: string, fallback: { title: string; description: string }) {
  try {
    const r = await one<Item>("SELECT * FROM cms_items WHERE kind='seo' AND slug=$1", [path]);
    return { title: r?.title ? { absolute: r.title } : fallback.title, description: r?.body || fallback.description, alternates: { canonical: path } };
  } catch { return { ...fallback, alternates: { canonical: path } }; } // DB down at build → static fallback
}

export async function setting(key: string): Promise<string> {
  try { return (await one<Item>("SELECT body FROM cms_items WHERE kind='setting' AND slug=$1", [key]))?.body ?? ""; } catch { return ""; }
}
