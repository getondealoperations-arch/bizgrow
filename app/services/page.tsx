import { PageHero, Cards, CtaBand } from "@/components/ui";
import { services } from "@/lib/content";
import { seo } from "@/lib/cms";

export const generateMetadata = () => seo("/services", { title: "Business Growth Services | Lead Generation, Sales & Consulting", description: "Business development, lead generation, sales growth, digital marketing, partnerships, market research, brand development and consulting." });

export default function Services() {
  return (
    <>
      <PageHero eyebrow="Our Services" title="Comprehensive Solutions for Every Stage of Business Growth." sub="Eight connected services, one growth partner." />
      <section className="section"><div className="container-x"><Cards items={services.map((s) => ({ href: `/services/${s.slug}`, icon: s.icon, title: s.name, text: s.short }))} /></div></section>
      <CtaBand />
    </>
  );
}
