import Link from "next/link";
import Icon from "./Icon";
import LeadForm, { Kind } from "./LeadForm";
import { waLink } from "@/lib/site";

export const H = ({ eyebrow, title, sub, center, light }: { eyebrow?: string; title: string; sub?: string; center?: boolean; light?: boolean }) => (
  <div className={`mb-10 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className={`mt-2 text-3xl font-semibold sm:text-4xl ${light ? "!text-white" : ""}`}>{title}</h2>
    {sub && <p className={`mt-3 ${light ? "text-white/75" : "text-muted"}`}>{sub}</p>}
  </div>
);

export const PageHero = ({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub?: string; children?: React.ReactNode }) => (
  <section className="bg-navy text-white">
    <div className="container-x py-16 sm:py-20">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-2 max-w-3xl text-4xl font-semibold !text-white sm:text-5xl">{title}</h1>
      {sub && <p className="mt-4 max-w-2xl text-lg text-white/80">{sub}</p>}
      {children && <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap [&>a]:max-sm:w-full">{children}</div>}
    </div>
  </section>
);

export const CtaBand = ({ title = "Ready to Take Your Business to the Next Level?", copy = "Let’s discuss your business goals and identify the right opportunities to move your business forward.", label = "Book Your Free Consultation", href = "/contact?form=consultation" }) => (
  <section className="cta-band text-navy">
    <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold !text-navy">{title}</h2>
        <p className="mt-2 font-medium text-navy">{copy}</p>
      </div>
      <Link href={href} className="btn btn-dark max-sm:w-full">{label}</Link>
    </div>
  </section>
);

export const Cards = ({ items }: { items: { href: string; icon: string; title: string; text?: string; more?: string }[] }) => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {items.map((i) => (
      <Link key={i.href} href={i.href} className="card group flex flex-col">
        <span className="icon-chip"><Icon name={i.icon} size={22} /></span>
        <h3 className="mt-4 text-lg font-semibold">{i.title}</h3>
        {i.text && <p className="mt-2 flex-1 text-sm text-muted">{i.text}</p>}
        <span className="mt-4 text-sm font-semibold text-brand-text">{i.more ?? "Learn More"} →</span>
      </Link>
    ))}
  </div>
);

export const FormSection = ({ kind, title, preset, waMsg, sub }: { kind: Kind; title: string; preset?: { industry?: string; services?: string[] }; waMsg?: string; sub?: string }) => {
  const wa = waMsg ? waLink(waMsg) : "";
  return (
    <section className="section bg-soft" id="enquiry">
      <div className="container-x grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <p className="mt-3 text-muted">{sub ?? "Tell us a little about your business. We only ask for what we need, and a member of our team will respond promptly."}</p>
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-5">Chat on WhatsApp</a>}
        </div>
        <div className="lg:col-span-3"><LeadForm kind={kind} preset={preset} /></div>
      </div>
    </section>
  );
};
