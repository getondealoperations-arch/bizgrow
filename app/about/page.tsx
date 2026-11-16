import Link from "next/link";
import Icon from "@/components/Icon";
import { PageHero, CtaBand, H } from "@/components/ui";
import { values } from "@/lib/content";
import { seo } from "@/lib/cms";

export const generateMetadata = () => seo("/about", { title: "About Bizgrow Solutions | Business Growth Partner", description: "Bizgrow Solutions helps businesses identify their potential and transform opportunities into sustainable growth." });

export default function About() {
  return (
    <>
      <PageHero eyebrow="About Us" title="Empowering Businesses. Creating Opportunities. Driving Growth." />
      <section className="section">
        <div className="container-x max-w-3xl space-y-4 text-lg text-muted">
          <p>Bizgrow Solutions was established with a clear vision: to help businesses identify their potential and transform opportunities into sustainable growth.</p>
          <p>We believe business growth requires more than just good ideas. It requires strategic thinking, customer understanding, effective execution and the right partnerships.</p>
          <p>Our approach combines business development, marketing, lead generation and strategic growth solutions to help businesses achieve their objectives.</p>
        </div>
      </section>
      <section className="section bg-soft">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="card"><h3 className="text-2xl">Our Vision</h3><p className="mt-2 text-muted">To become a globally trusted business growth and development solutions partner.</p></div>
          <div className="card"><h3 className="text-2xl">Our Mission</h3><p className="mt-2 text-muted">To empower businesses with innovative strategies, meaningful connections and actionable solutions that create sustainable growth.</p></div>
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          <H eyebrow="Core Values" title="What guides our work" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => <div key={v} className="card flex items-center gap-3"><Icon name="BadgeCheck" className="text-brand-text" /><span className="font-semibold text-navy">{v}</span></div>)}
          </div>
        </div>
      </section>
      <section className="section bg-soft">
        <div className="container-x">
          <H eyebrow="Leadership" title="Founder & leadership team" />
          <div className="card max-w-md">
            <div className="flex h-28 items-center justify-center rounded-lg bg-line text-sm text-muted">[Photo – to be added]</div>
            <h3 className="mt-4 text-xl">[Founder name – to be added]</h3>
            <p className="text-sm text-muted">[Title – to be added]</p>
            <p className="mt-2 text-sm text-muted">[Founder profile and bio – to be supplied by Bizgrow Solutions.]</p>
          </div>
        </div>
      </section>
      <CtaBand title="Let’s build your growth plan together" label="Connect With Our Team" href="/contact" copy="Talk to our team about your goals and the right next step." />
      <p className="sr-only"><Link href="/contact">Contact</Link></p>
    </>
  );
}
