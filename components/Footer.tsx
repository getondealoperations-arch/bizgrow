"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Header";
import { brand, services, industries } from "@/lib/content";
import { site } from "@/lib/site";

export default function Footer() {
  if (usePathname().startsWith("/admin")) return null;
  const col = "text-sm text-white/75 hover:text-white";
  const social = [["LinkedIn", site.linkedin], ["Instagram", site.instagram], ["Facebook", site.facebook]] as const;
  return (
    <footer className="bg-navy text-white">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm text-white/75">{brand.name} is an independent business development and growth solutions company helping businesses grow, acquire customers and expand.</p>
          <div className="mt-4 flex gap-3 text-sm">
            {social.map(([n, u]) => u ? <a key={n} href={u} className={col} rel="noopener noreferrer" target="_blank">{n}</a> : <span key={n} className="text-white/40" title="Link to be added">{n}</span>)}
          </div>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold !text-white">Quick links</h3>
          <ul className="mt-3 space-y-2">
            {[["/about", "About Us"], ["/our-approach", "Our Approach"], ["/insights", "Insights"], ["/contact", "Contact Us"], ["/privacy", "Privacy Policy"], ["/terms", "Terms & Conditions"]].map(([h, l]) => <li key={h}><Link href={h} className={col}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold !text-white">Services</h3>
          <ul className="mt-3 space-y-2">{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className={col}>{s.name}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold !text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>{site.phone.text}</li><li>{site.email.set ? <a href={`mailto:${site.email.value}`} className="hover:underline">{site.email.text}</a> : site.email.text}</li><li>WhatsApp: {site.whatsapp.set ? `+${site.whatsapp.value.replace(/\D/g, "")}` : site.whatsapp.text}</li><li>{site.address.text}</li>
          </ul>
          <h3 className="mt-6 font-sans text-sm font-semibold !text-white">Industries</h3>
          <p className="mt-2 text-sm"><Link href="/industries" className={col}>All {industries.length} industries →</Link></p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">© {new Date().getFullYear()} {brand.name}. {brand.tagline}</div>
    </footer>
  );
}
