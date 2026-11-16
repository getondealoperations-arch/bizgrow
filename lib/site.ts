// Company contact details. NOT supplied in the brief → clearly marked placeholders until env vars are set.
// NOTE: this file is also bundled for the browser. webpack only inlines the LITERAL form `process.env.NEXT_PUBLIC_X`
// (an alias like `const e = process.env` throws "process is not defined" in the browser), so keep each access literal.
const ph = (v: string | undefined, label: string) => ({ value: v || "", text: v || `[${label} – to be added]`, set: !!v });

export const site = {
  // server-only (SITE_URL is not NEXT_PUBLIC): getter so browser bundles never evaluate it
  get url() { return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, ""); },
  phone: ph(process.env.NEXT_PUBLIC_PHONE, "Phone"),
  email: ph(process.env.NEXT_PUBLIC_EMAIL, "Email"),
  whatsapp: ph(process.env.NEXT_PUBLIC_WHATSAPP, "WhatsApp"),
  address: ph(process.env.NEXT_PUBLIC_ADDRESS, "Office address"),
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || "",
  mapsEmbed: process.env.NEXT_PUBLIC_MAPS_EMBED_URL || "",
};

export const waLink = (msg: string) =>
  site.whatsapp.set ? `https://wa.me/${site.whatsapp.value.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}` : "";
