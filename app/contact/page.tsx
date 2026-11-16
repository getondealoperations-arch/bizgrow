import { PageHero, H } from "@/components/ui";
import LeadForm, { Kind } from "@/components/LeadForm";
import { site, waLink } from "@/lib/site";
import { faqs as defaultFaqs } from "@/lib/content";
import { seo, live } from "@/lib/cms";
import Link from "next/link";

export const generateMetadata = () => seo("/contact", { title: "Contact Bizgrow Solutions | Free Business Consultation", description: "Submit a business enquiry, book a free consultation, request a callback or explore a partnership." });

const tabs: [Kind, string][] = [["enquiry", "Business Enquiry"], ["consultation", "Free Consultation"], ["callback", "Request a Callback"], ["partnership", "Partnership"]];

export default async function Contact({ searchParams }: PageProps<"/contact">) {
  const f = (await searchParams).form;
  const kind = (tabs.find((t) => t[0] === f)?.[0] ?? "enquiry") as Kind;
  // Admin-managed FAQs (oldest first) replace the built-in defaults once at least one is live.
  const cms = (await live("faq", 100).catch(() => [])).reverse();
  const faqs: string[][] = cms.length ? cms.map((f) => [f.title, f.body]) : defaultFaqs;
  const wa = waLink("Hello Bizgrow Solutions, I'd like to discuss growing my business.");
  return (
    <>
      <PageHero eyebrow="Contact Us" title="Tell us about your business." sub="Submit your enquiry and our team will get back to you promptly." />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <nav className="mb-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Form type">
              {tabs.map(([k, l]) => <Link key={k} href={`/contact?form=${k}`} scroll={false} className={`btn ${k === kind ? "btn-primary" : "btn-ghost"} !py-1.5 max-sm:!px-2 max-sm:!py-3 max-sm:text-center max-sm:text-sm`}>{l}</Link>)}
            </nav>
            <LeadForm key={kind} kind={kind} />
          </div>
          <aside className="space-y-4">
            <div className="card text-sm">
              <h2 className="text-xl">Contact details</h2>
              <ul className="mt-3 space-y-2 text-muted">
                <li><b className="text-navy">Phone:</b> {site.phone.text}</li>
                <li><b className="text-navy">Email:</b> {site.email.set ? <a href={`mailto:${site.email.value}`} className="underline">{site.email.text}</a> : site.email.text}</li>
                <li><b className="text-navy">WhatsApp:</b> {wa ? <a className="underline" href={wa}>Chat now</a> : site.whatsapp.text}</li>
                <li><b className="text-navy">Office:</b> {site.address.text}</li>
              </ul>
            </div>
            {site.mapsEmbed
              ? <iframe title="Office location" src={site.mapsEmbed} loading="lazy" className="h-60 w-full rounded-xl border border-line" referrerPolicy="no-referrer-when-downgrade" />
              : <div className="card flex h-40 items-center justify-center text-sm text-muted">[Google Maps office location – to be added]</div>}
          </aside>
        </div>
      </section>
      <section className="section bg-soft">
        <div className="container-x max-w-3xl">
          <H title="Frequently asked questions" />
          {faqs.map(([qn, a]) => <details key={qn} className="card mb-3"><summary className="cursor-pointer py-2 font-semibold text-navy">{qn}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>)}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([n, a]) => ({ "@type": "Question", name: n, acceptedAnswer: { "@type": "Answer", text: a } })) }) }} />
    </>
  );
}
