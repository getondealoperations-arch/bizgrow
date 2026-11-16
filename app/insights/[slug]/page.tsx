import { notFound } from "next/navigation";
import { PageHero, CtaBand } from "@/components/ui";
import { liveOne } from "@/lib/cms";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const p = await liveOne("post", slug).catch(() => undefined);
  if (!p) return {};
  return { title: p.data.seo_title || p.title, description: p.data.seo_description || p.data.excerpt, alternates: { canonical: `/insights/${slug}` } };
}

export default async function Post({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const p = await liveOne("post", slug).catch(() => undefined);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, datePublished: p.publish_at ?? p.created_at, description: p.data.excerpt, publisher: { "@type": "Organization", name: "Bizgrow Solutions" } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero eyebrow={p.data.category} title={p.title} sub={p.data.excerpt} />
      <article className="section"><div className="container-x max-w-3xl space-y-4 text-lg leading-relaxed">
        {/* plain text → paragraphs (no raw HTML, so admin content can't inject scripts) */}
        {p.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
      </div></article>
      <CtaBand />
    </>
  );
}
