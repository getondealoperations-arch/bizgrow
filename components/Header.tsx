"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, brand } from "@/lib/content";

// Real logo files live in public/logo (names kept exactly as supplied).
// "light" = the variant made for dark backgrounds (footer).
export function Logo({ light, className = "h-10 w-auto sm:h-12" }: { light?: boolean; className?: string }) {
  return (
    <Image
      src={light ? "/logo/02-logo-transparent-for-dark-bg.png" : "/logo/03-logo-transparent-for-light-bg.png"}
      alt={brand.name}
      width={1683}
      height={400}
      priority={!light}
      className={className}
    />
  );
}

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin")) return null;
  const active = (h: string) => (h === "/" ? path === "/" : path === h || path.startsWith(h + "/"));
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      {/* desktop bar: logo | centred menu | actions. Secondary CTA shows from 2xl; below xl the hamburger menu (with both CTAs) is used. */}
      <div className="mx-auto flex h-[72px] w-full max-w-[80rem] 2xl:max-w-[90rem] items-center justify-between px-6 xl:grid xl:grid-cols-[auto_1fr_auto] xl:gap-10">
        <Link href="/" aria-label={`${brand.name} home`} className="flex h-12 shrink-0 items-center"><Logo /></Link>

        <nav className="hidden items-center justify-center gap-7 text-[0.92rem] font-medium xl:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
              className={`relative whitespace-nowrap py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded after:bg-brand after:transition-transform ${active(n.href) ? "text-brand-text after:scale-x-100" : "text-ink/80 hover:text-navy after:scale-x-0 hover:after:scale-x-100"}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 xl:flex">
          <Link href="/contact?form=partnership" className="group hidden items-center gap-1 whitespace-nowrap 2xl:flex text-[0.92rem] font-semibold text-navy hover:text-brand-text">
            Let’s Grow Together <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link href="/contact?form=consultation" className="btn btn-primary whitespace-nowrap !px-5 !py-2.5">Get Free Consultation</Link>
        </div>

        <button className="-mr-2 rounded-lg p-2 xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white xl:hidden">
          <nav className="mx-auto max-w-[80rem] 2xl:max-w-[90rem] px-6 py-2" aria-label="Mobile">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} aria-current={active(n.href) ? "page" : undefined}
                className={`block border-b border-line/70 py-3.5 text-base font-medium ${active(n.href) ? "text-brand-text" : "text-ink"}`}>{n.label}</Link>
            ))}
            <div className="flex flex-col gap-3 py-5">
              <Link href="/contact?form=consultation" onClick={() => setOpen(false)} className="btn btn-primary">Get Free Consultation</Link>
              <Link href="/contact?form=partnership" onClick={() => setOpen(false)} className="btn btn-ghost">Let’s Grow Together</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
