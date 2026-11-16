import { PageHero, Cards, CtaBand } from "@/components/ui";
import { industries } from "@/lib/content";
import { seo } from "@/lib/cms";

export const generateMetadata = () => seo("/industries", { title: "Industries We Serve | Business Growth Solutions", description: "Growth solutions for startups, retail, manufacturing, healthcare, real estate, hospitality, education, technology and more." });

export default function Industries() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Growth Solutions Designed for Every Business." sub="We are not limited to one sector. We adapt our solutions to your market." />
      <section className="section"><div className="container-x"><Cards items={industries.map((i) => ({ href: `/industries/${i.slug}`, icon: i.icon, title: i.name, text: i.overview, more: "Explore Solutions" }))} /></div></section>
      <CtaBand />
    </>
  );
}
