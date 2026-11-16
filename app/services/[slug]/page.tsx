import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { PageHero, FormSection, CtaBand, H } from "@/components/ui";
import { services, industries } from "@/lib/content";
import { seo } from "@/lib/cms";
import { waLink } from "@/lib/site";

export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return seo(`/services/${s.slug}`, { title: `${s.name} Services in India`, description: `${s.intro} Free consultation.` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const wa = waLink(`Hello Bizgrow Solutions, I'd like to enquire about ${s.name}.`);
  const related = industries.filter((i) => i.solutions.includes(s.slug)).slice(0, 6);
  const ld = { "@context": "https://schema.org", "@type": "Service", name: s.name, description: s.intro, provider: { "@type": "Organization", name: "Bizgrow Solutions" } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero eyebrow="Our Services" title={s.name} sub={s.intro}>
        <a href="#enquiry" className="btn btn-primary">{s.cta}</a>
        {wa && <a href={wa} className="btn btn-outline-light" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>}
      </PageHero>
      <section className="section">
        <div className="container-x">
          <H title="What’s included" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.includes.map((i) => <li key={i} className="card flex items-center gap-3 !p-4"><Icon name="CheckCircle2" className="shrink-0 text-brand-text" />{i}</li>)}
          </ul>
          {related.length > 0 && (
            <p className="mt-8 text-sm text-muted">Popular with: {related.map((i, k) => <span key={i.slug}>{k > 0 && ", "}<Link className="text-brand-text underline" href={`/industries/${i.slug}`}>{i.name}</Link></span>)}.</p>
          )}
          <p className="mt-3 text-sm"><Link href="/services" className="text-brand-text underline">← All services</Link></p>
        </div>
      </section>
      <FormSection kind="enquiry" title={s.cta} preset={{ services: [s.name] }} waMsg={`Hello Bizgrow Solutions, I'd like to enquire about ${s.name}.`} />
      <CtaBand />
    </>
  );
}
