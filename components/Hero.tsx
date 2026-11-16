import Link from "next/link";

export default function Hero({ banner }: { banner?: string }) {
  const bars = [30, 45, 38, 60, 72, 90];
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(60rem 30rem at 85% 10%, var(--brand), transparent 60%)" }} />
      {banner && <div className="relative bg-amber px-4 py-2 text-center text-sm font-semibold text-navy">{banner}</div>}
      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="eyebrow">Business Growth Partner</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight !text-white sm:text-6xl"><span className="block">Grow Smarter.</span> <span className="block">Scale Faster.</span> <span className="block">Achieve More.</span></h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">At Bizgrow Solutions, we help businesses unlock new opportunities through strategic business development, customer acquisition, lead generation and growth-driven solutions.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row [&>a]:max-sm:w-full">
            <Link href="/contact?form=consultation" className="btn btn-primary">Get Free Consultation</Link>
            <Link href="/services" className="btn btn-outline-light">Explore Our Solutions</Link>
          </div>
        </div>
        <div className="floaty" aria-hidden="true">
          <svg viewBox="0 0 420 320" className="w-full">
            <rect x="0" y="0" width="420" height="320" rx="20" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.15)" />
            {[60, 120, 180, 240].map((y) => <line key={y} x1="30" x2="390" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />)}
            {bars.map((h, i) => <rect key={i} className="bar" style={{ animationDelay: `${i * 0.12}s` }} x={45 + i * 58} y={280 - h * 2.4} width="34" height={h * 2.4} rx="6" fill={i === bars.length - 1 ? "var(--amber)" : "var(--brand)"} />)}
            <polyline className="trend" points={bars.map((h, i) => `${62 + i * 58},${280 - h * 2.4 - 14}`).join(" ")} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={62 + 5 * 58} cy={280 - 90 * 2.4 - 14} r="7" fill="#fff" />
          </svg>
        </div>
      </div>
    </section>
  );
}
