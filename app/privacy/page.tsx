import { PageHero } from "@/components/ui";
export const metadata = { title: "Privacy Policy", robots: { index: true } };
export default function Page() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <section className="section"><div className="container-x max-w-3xl">
        <p className="card text-muted">[Placeholder] The Privacy Policy text has not been supplied. It must be provided and reviewed by Bizgrow Solutions (and legal counsel) before launch.</p>
      </div></section>
    </>
  );
}
