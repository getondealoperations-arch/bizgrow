import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { PageHero, FormSection, CtaBand, H } from "@/components/ui";
import { industries, services } from "@/lib/content";
import { seo } from "@/lib/cms";

export const generateStaticParams = () => industries.map((i) => ({ slug: i.slug }));

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const i = industries.find((x) => x.slug === slug);
  if (!i) return {};
  return seo(`/industries/${i.slug}`, { title: `Business Growth Solutions for ${i.name}`, description: i.overview });
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const ind = industries.find((x) => x.slug === slug);
  if (!ind) notFound();
  const sols = ind.solutions.map((s) => services.find((x) => x.slug === s)!);
  return (
    <>
      <PageHero eyebrow="Industries" title={`Growth Solutions for ${ind.name}`} sub={ind.overview}>
        <a href="#enquiry" className="btn btn-primary">Explore Solutions</a>
      </PageHero>
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div><H title="Common business challenges" />
            <ul className="space-y-3">{ind.challenges.map((c) => <li key={c} className="card flex gap-3 !p-4"><Icon name="AlertCircle" className="shrink-0 text-brand-text" />{c}</li>)}</ul></div>
          <div><H title="Growth opportunities" />
            <ul className="space-y-3">{ind.opportunities.map((c) => <li key={c} className="card flex gap-3 !p-4"><Icon name="TrendingUp" className="shrink-0 text-brand-text" />{c}</li>)}</ul></div>
        </div>
      </section>
      <section className="section bg-soft">
        <div className="container-x">
          <H title="Relevant Bizgrow solutions" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sols.map((s) => <Link key={s.slug} href={`/services/${s.slug}`} className="card"><span className="icon-chip"><Icon name={s.icon} size={22} /></span><h3 className="mt-3 font-semibold">{s.name}</h3><p className="mt-1 text-sm text-muted">{s.short}</p></Link>)}
          </div>
        </div>
      </section>
      <FormSection kind="enquiry" title={`Discuss growth for your ${ind.name} business`} preset={{ industry: ind.name }} waMsg={`Hello Bizgrow Solutions, I run a ${ind.name} business and would like to discuss growth.`} />
      <CtaBand />
    </>
  );
}
