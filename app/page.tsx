import Link from "next/link";
import Icon from "@/components/Icon";
import Hero from "@/components/Hero";
import { H, Cards, CtaBand } from "@/components/ui";
import { services, industries, whyUs, process } from "@/lib/content";
import { live, seo, setting } from "@/lib/cms";

export const revalidate = 300;
export const generateMetadata = () => seo("/", { title: "Business Growth Consulting & Lead Generation Company in India | Bizgrow Solutions", description: "Independent business development and growth solutions: lead generation, sales growth, digital marketing, partnerships and expansion for startups, SMEs and enterprises." });

const safe = <T,>(p: Promise<T[]>) => p.catch(() => [] as T[]);

export default async function Home() {
  const [testimonials, cases, posts, banner] = await Promise.all([safe(live("testimonial", 6)), safe(live("case_study", 3)), safe(live("post", 3)), setting("home_banner")]);
  return (
    <>
      <Hero banner={banner} />

      <section className="section">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <h2 className="text-3xl font-semibold sm:text-4xl">Your Growth Journey Starts With the Right Partner.</h2>
          <div>
            <p className="text-muted">Every successful business needs the right strategy, the right connections and the right opportunities. Bizgrow Solutions works alongside businesses to understand their challenges, identify growth opportunities and implement practical solutions that help them move forward.</p>
            <Link href="/about" className="btn btn-primary mt-5">Discover Bizgrow Solutions</Link>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container-x">
          <H eyebrow="Our Services" title="Comprehensive Solutions for Every Stage of Business Growth." />
          <Cards items={services.map((s) => ({ href: `/services/${s.slug}`, icon: s.icon, title: s.name, text: s.short }))} />
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <H eyebrow="Who We Help" title="Growth Solutions Designed for Every Business." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.filter((i) => i.home).map((i) => (
              <Link key={i.slug} href={`/industries/${i.slug}`} className="card flex items-center gap-3 !p-4">
                <span className="icon-chip !h-10 !w-10 shrink-0"><Icon name={i.icon} size={20} /></span>
                <span className="text-sm font-semibold text-navy">{i.home}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy text-white">
        <div className="container-x">
          <H light eyebrow="Why Choose Us" title="More Than a Service Provider. Your Growth Partner." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/15 p-6">
                <Icon name="CheckCircle2" className="text-amber" />
                <h3 className="mt-3 font-sans text-lg font-semibold !text-white">{t}</h3>
                <p className="mt-1 text-sm text-white/75">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <H eyebrow="Working Process" title="A Clear Approach to Business Growth." />
          <ol className="grid gap-5 md:grid-cols-4">
            {process.map(([t, d], i) => (
              <li key={t} className="card">
                <span className="font-display text-4xl text-brand/40">0{i + 1}</span>
                <h3 className="mt-1 text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />

      <section className="section">
        <div className="container-x">
          <H eyebrow="Success Stories" title="Client results and feedback" sub="Only verified client feedback and genuine business results are published here." />
          {testimonials.length + cases.length === 0 ? (
            <p className="card text-sm text-muted">[Placeholder] Verified client testimonials and case studies will appear here once added by our team.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {cases.map((c) => <article key={c.id} className="card"><h3 className="text-lg font-semibold">{c.title}</h3><p className="mt-2 text-sm text-muted">{c.body.slice(0, 180)}</p></article>)}
              {testimonials.map((t) => <blockquote key={t.id} className="card"><p>“{t.body}”</p><footer className="mt-3 text-sm font-semibold text-navy">{t.title}{t.data.company ? `, ${t.data.company}` : ""}</footer></blockquote>)}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container-x">
          <H eyebrow="Insights & Resources" title="Latest articles on business growth" />
          {posts.length === 0 ? <p className="card text-sm text-muted">[Placeholder] Articles will appear here once published.</p> : (
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.id} href={`/insights/${p.slug}`} className="card">
                  <p className="eyebrow">{p.data.category}</p>
                  <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.data.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
