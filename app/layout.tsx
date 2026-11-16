import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Consent from "@/components/Consent";
import { brand } from "@/lib/content";
import { site } from "@/lib/site";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const display = Fraunces({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${brand.name} – Business Growth Consulting & Lead Generation`, template: `%s | ${brand.name}` },
  description: "Bizgrow Solutions is an independent business development and growth solutions company: lead generation, sales growth, digital marketing, partnerships and expansion.",
  openGraph: { siteName: brand.name, type: "website", images: [{ url: "/logo/06-logo-on-white.png", width: 2400, height: 1200, alt: brand.name }] },
  verification: process.env.NEXT_PUBLIC_SEARCH_CONSOLE_TOKEN ? { google: process.env.NEXT_PUBLIC_SEARCH_CONSOLE_TOKEN } : undefined,
};

const orgLd = {
  "@context": "https://schema.org", "@type": "Organization", name: brand.name, url: site.url, logo: `${site.url}/logo/06-logo-on-white.png`, slogan: brand.tagline,
  ...(site.email.set && { email: site.email.value }), ...(site.phone.set && { telephone: site.phone.value }),
  sameAs: [site.linkedin, site.instagram, site.facebook].filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <Consent />
      </body>
    </html>
  );
}
