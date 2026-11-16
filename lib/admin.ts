import type { User } from "./auth";

export type LeadQuery = { q?: string; status?: string; service?: string; industry?: string; source?: string; from?: string; to?: string; assigned?: string };

// Builds WHERE + params. Employees are ALWAYS restricted to their own leads, regardless of query.
export function leadWhere(u: User, f: LeadQuery) {
  const w: string[] = []; const p: unknown[] = [];
  const add = (sql: string, v: unknown) => { p.push(v); w.push(sql.replace("?", `$${p.length}`)); };
  if (u.role === "employee") add("l.assigned_to = ?", u.id);
  else if (f.assigned === "none") w.push("l.assigned_to IS NULL");
  else if (f.assigned) add("l.assigned_to = ?", Number(f.assigned) || 0);
  if (f.q) { p.push(`%${f.q}%`); const i = p.length; w.push(`(l.name ILIKE $${i} OR l.company ILIKE $${i} OR l.phone ILIKE $${i} OR l.email ILIKE $${i})`); }
  if (f.status) add("l.status = ?", f.status);
  if (f.service) add("? = ANY(l.services)", f.service);
  if (f.industry) add("l.industry = ?", f.industry);
  if (f.source) add("l.source = ?", f.source);
  if (f.from) add("l.created_at >= ?::date", f.from);
  if (f.to) add("l.created_at < (?::date + 1)", f.to);
  return { where: w.length ? "WHERE " + w.join(" AND ") : "", params: p };
}

export const canManage = (u: User) => u.role === "admin" || u.role === "manager";

export const kinds: [string, string, string][] = [
  ["post", "Blog posts", "Create, schedule and publish articles."],
  ["testimonial", "Testimonials", "Verified client feedback only."],
  ["case_study", "Case studies", "Genuine, verified business results only."],
  ["faq", "FAQs", "Shown on request via the site."],
  ["seo", "SEO metadata", "Override page title/description by path (e.g. /services/lead-generation)."],
  ["setting", "Site settings", "home_banner (homepage announcement strip). Contact details are set via environment variables."],
];
