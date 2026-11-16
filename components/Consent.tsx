"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

const GA = process.env.NEXT_PUBLIC_GA4_ID, PX = process.env.NEXT_PUBLIC_META_PIXEL_ID, ADS = process.env.NEXT_PUBLIC_GADS_ID;
const KEY = "bg_consent";

// Analytics scripts load ONLY after the visitor accepts. Admin pages never load them.
export default function Consent() {
  const [state, setState] = useState<"unknown" | "yes" | "no">("unknown");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage after mount
    try { const v = localStorage.getItem(KEY); if (v === "yes" || v === "no") setState(v); } catch {}
  }, []);
  const choose = (v: "yes" | "no") => { try { localStorage.setItem(KEY, v); } catch {} setState(v); };
  const anyTracker = GA || PX || ADS;
  if (!anyTracker) return null;
  return (
    <>
      {state === "yes" && (
        <>
          {(GA || ADS) && <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA || ADS}`} strategy="afterInteractive" />}
          {(GA || ADS) && <Script id="gtag" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${GA ? `gtag('config','${GA}');` : ""}${ADS ? `gtag('config','${ADS}');` : ""}`}</Script>}
          {PX && <Script id="fbq" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PX}');fbq('track','PageView');`}</Script>}
        </>
      )}
      {state === "unknown" && (
        <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border border-line bg-white p-4 shadow-xl text-sm">
          <p>We use cookies for analytics and advertising measurement only if you agree. See our <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
          <div className="mt-3 flex gap-2">
            <button className="btn btn-primary !py-1.5" onClick={() => choose("yes")}>Accept</button>
            <button className="btn btn-ghost !py-1.5" onClick={() => choose("no")}>Decline</button>
          </div>
        </div>
      )}
    </>
  );
}
