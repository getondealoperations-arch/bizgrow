// Company contact details. NOT supplied in the brief → clearly marked placeholders until env vars are set.
const e = process.env;
const ph = (v: string | undefined, label: string) => ({ value: v || "", text: v || `[${label} – to be added]`, set: !!v });

export const site = {
  url: (e.SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  phone: ph(e.NEXT_PUBLIC_PHONE, "Phone"),
  email: ph(e.NEXT_PUBLIC_EMAIL, "Email"),
  whatsapp: ph(e.NEXT_PUBLIC_WHATSAPP, "WhatsApp"),
  address: ph(e.NEXT_PUBLIC_ADDRESS, "Office address"),
  linkedin: e.NEXT_PUBLIC_LINKEDIN || "",
  instagram: e.NEXT_PUBLIC_INSTAGRAM || "",
  facebook: e.NEXT_PUBLIC_FACEBOOK || "",
  mapsEmbed: e.NEXT_PUBLIC_MAPS_EMBED_URL || "",
};

export const waLink = (msg: string) =>
  site.whatsapp.set ? `https://wa.me/${site.whatsapp.value.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}` : "";
