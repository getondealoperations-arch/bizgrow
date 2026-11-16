import Link from "next/link";
import { PageHero, CtaBand } from "@/components/ui";
import { live, seo } from "@/lib/cms";
import { blogCategories } from "@/lib/content";

export const revalidate = 300;
export const generateMetadata = () => seo("/insights", { title: "Insights | Business Growth, Sales & Marketing Articles", description: "Articles on business growth, sales strategy, marketing, lead generation, entrepreneurship and expansion." });

export default async function Insights({ searchParams }: PageProps<"/insights">) {
  const cat = (await searchParams).category;
  const posts = (await live("post", 100).catch(() => [])).filter((p) => !cat || p.data.category === cat);
  return (
    <>
      <PageHero eyebrow="Insights" title="Ideas for growing your business." />
      <section className="section">
        <div className="container-x">
          <nav className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&>a]:shrink-0 [&>a]:whitespace-nowrap" aria-label="Categories">
            <Link href="/insights" className={`btn ${!cat ? "btn-primary" : "btn-ghost"} !py-1.5 max-sm:!py-3`}>All</Link>
            {blogCategories.map((c) => <Link key={c} href={`/insights?category=${encodeURIComponent(c)}`} className={`btn ${cat === c ? "btn-primary" : "btn-ghost"} !py-1.5 max-sm:!py-3`}>{c}</Link>)}
          </nav>
          {posts.length === 0 ? <p className="card text-muted">[Placeholder] No articles published yet.</p> : (
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((p) => <Link key={p.id} href={`/insights/${p.slug}`} className="card"><p className="eyebrow">{p.data.category}</p><h2 className="mt-2 text-lg font-semibold">{p.title}</h2><p className="mt-2 text-sm text-muted">{p.data.excerpt}</p></Link>)}
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
