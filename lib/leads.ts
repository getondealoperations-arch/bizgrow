import { z } from "zod";
import { one, q } from "./db";
import { mail } from "./mail";
import { brand } from "./content";

const phone = z.string().trim().regex(/^\+?[0-9 ()\-]{7,18}$/, "Enter a valid number");
const opt = (s: z.ZodString) => z.union([s, z.literal("")]).optional();
const txt = (n: number) => z.string().trim().max(n);

export const formTypes = ["enquiry", "consultation", "callback", "partnership"] as const;
export type FormType = (typeof formTypes)[number];

// Required fields per form (brief §8). Everything else is optional → keeps forms short.
export const required: Record<FormType, string[]> = {
  enquiry: ["name", "company", "phone", "email", "industry", "services", "message", "contact_method"],
  consultation: ["name", "company", "phone", "email", "industry", "message"],
  callback: ["name", "phone", "company", "preferred_time"],
  partnership: ["name", "company", "email", "phone", "partnership_type", "message"],
};

export const bodySchema = z.object({
  form_type: z.enum(formTypes),
  name: txt(120), company: txt(160).optional(),
  phone: opt(phone), whatsapp: opt(phone),
  email: opt(z.string().trim().email().max(200)),
  industry: txt(120).optional(), location: txt(160).optional(),
  website: opt(z.string().trim().max(300).regex(/^(https?:\/\/)?[^\s.]+\.[^\s]+$/, "Enter a valid URL")),
  business_type: txt(80).optional(), services: z.array(txt(80)).max(12).optional(),
  business_stage: txt(80).optional(), budget: txt(80).optional(),
  message: txt(3000).optional(), contact_method: txt(40).optional(),
  preferred_time: txt(80).optional(), partnership_type: txt(80).optional(),
  page: txt(300).optional(), utm: z.record(z.string(), txt(200)).optional(),
  consent: z.literal(true, { error: "Consent is required" }),
  // spam
  hp: z.string().max(0).optional(), t: z.number().optional(), rc: z.string().optional(),
});
export type LeadInput = z.infer<typeof bodySchema>;

export function missing(d: LeadInput): string[] {
  return required[d.form_type].filter((f) => {
    const v = (d as Record<string, unknown>)[f];
    return Array.isArray(v) ? v.length === 0 : !v;
  });
}

export async function createLead(d: LeadInput): Promise<number> {
  const utm = JSON.stringify(d.utm ?? {});
  const source = d.utm?.utm_source || "website";
  const n = (v?: string) => v || null;
  const row = await one<{ id: number }>(
    `INSERT INTO leads (form_type,name,company,phone,whatsapp,email,industry,location,website,business_type,services,
       business_stage,budget,message,contact_method,preferred_time,partnership_type,source,page,utm,consent_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,now()) RETURNING id`,
    [d.form_type, d.name, n(d.company), n(d.phone), n(d.whatsapp), n(d.email), n(d.industry), n(d.location), n(d.website),
     n(d.business_type), d.services ?? [], n(d.business_stage), n(d.budget), n(d.message), n(d.contact_method),
     n(d.preferred_time), n(d.partnership_type), source, n(d.page), utm]);
  const id = row!.id;
  await q("INSERT INTO lead_events (lead_id, kind, body) VALUES ($1,'created',$2)", [id, `Submitted via ${d.form_type} form${d.page ? ` on ${d.page}` : ""}`]);

  // fire-and-forget notifications
  const to = (process.env.LEAD_NOTIFY_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  void mail(to, `New ${d.form_type} lead: ${d.name}${d.company ? ` (${d.company})` : ""}`,
    Object.entries(d).filter(([k, v]) => v && !["hp", "t", "rc", "utm", "consent"].includes(k)).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n"));
  if (d.email) void mail(d.email, `We received your enquiry – ${brand.name}`,
    `Hello ${d.name},\n\nThank you for contacting ${brand.name}. Our team has received your request and will get back to you shortly.\n\n— ${brand.name}`);
  return id;
}
