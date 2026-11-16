import { PageHero, CtaBand, H } from "@/components/ui";
import { process } from "@/lib/content";
import { seo } from "@/lib/cms";

export const generateMetadata = () => seo("/our-approach", { title: "Our Approach | Discover, Strategize, Execute, Optimize", description: "A clear four-step approach to business growth: discover, strategize, execute and optimize." });

const detail: Record<string, string[]> = {
  Discover: ["Understand your business, goals and challenges", "Review your market, customers and current performance", "Agree what success looks like"],
  Strategize: ["Identify the most valuable growth opportunities", "Build a customized growth strategy and roadmap", "Agree priorities, activities and measures"],
  Execute: ["Implement the agreed business-development and marketing activities", "Keep you informed with clear updates", "Adapt quickly as we learn"],
  Optimize: ["Measure performance against agreed goals", "Identify improvements and fix what is not working", "Refine the strategy for continued growth"],
};

export default function Approach() {
  return (
    <>
      <PageHero eyebrow="Our Approach" title="A Clear Approach to Business Growth." sub="Every engagement begins with a free consultation, so we understand your goals before proposing anything." />
      <section className="section">
        <div className="container-x space-y-6">
          {process.map(([t, d], i) => (
            <div key={t} className="card grid gap-4 md:grid-cols-3">
              <div><span className="font-display text-5xl text-brand/40">0{i + 1}</span><h2 className="text-2xl font-semibold">{t}</h2><p className="mt-1 text-muted">{d}</p></div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted md:col-span-2">{detail[t].map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
      <section className="section bg-soft"><div className="container-x">
        <H eyebrow="Consultation process" title="From enquiry to partnership" />
        <p className="max-w-3xl text-muted">Enquiry → qualification call → free consultation → proposal → kickoff. You are never asked to commit before we understand your business.</p>
      </div></section>
      <CtaBand />
    </>
  );
}
