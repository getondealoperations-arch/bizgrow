"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { industryOptions, serviceOptions, businessStages, businessTypes, partnershipTypes } from "@/lib/content";
import { waLink } from "@/lib/site";

export type Kind = "enquiry" | "consultation" | "callback" | "partnership";
type F = { n: string; l: string; t?: "text" | "email" | "tel" | "url" | "select" | "textarea" | "multi"; o?: string[]; req?: boolean; auto?: string };

const contactMethods = ["Phone call", "WhatsApp", "Email"];
const times = ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–8)", "Any time"];

const forms: Record<Kind, { cta: string; fields: F[] }> = {
  enquiry: {
    cta: "Submit Your Business Enquiry",
    fields: [
      { n: "name", l: "Full Name", req: true, auto: "name" }, { n: "company", l: "Company Name", req: true, auto: "organization" },
      { n: "phone", l: "Mobile Number", t: "tel", req: true, auto: "tel" }, { n: "whatsapp", l: "WhatsApp Number", t: "tel" },
      { n: "email", l: "Email Address", t: "email", req: true, auto: "email" }, { n: "industry", l: "Industry", t: "select", o: industryOptions, req: true },
      { n: "location", l: "Business Location" }, { n: "website", l: "Website URL", t: "url" },
      { n: "business_type", l: "Business Type", t: "select", o: businessTypes }, { n: "business_stage", l: "Current Business Stage", t: "select", o: businessStages },
      { n: "services", l: "Services Required", t: "multi", o: serviceOptions, req: true },
      { n: "message", l: "Business Requirements", t: "textarea", req: true },
      { n: "contact_method", l: "Preferred Contact Method", t: "select", o: contactMethods, req: true },
    ],
  },
  consultation: {
    cta: "Book Free Consultation",
    fields: [
      { n: "name", l: "Full Name", req: true, auto: "name" }, { n: "company", l: "Company Name", req: true, auto: "organization" },
      { n: "phone", l: "Phone Number", t: "tel", req: true, auto: "tel" }, { n: "email", l: "Email", t: "email", req: true, auto: "email" },
      { n: "industry", l: "Industry", t: "select", o: industryOptions, req: true },
      { n: "message", l: "Consultation Requirements", t: "textarea", req: true },
    ],
  },
  callback: {
    cta: "Request a Callback",
    fields: [
      { n: "name", l: "Name", req: true, auto: "name" }, { n: "phone", l: "Mobile Number", t: "tel", req: true, auto: "tel" },
      { n: "company", l: "Company Name", req: true, auto: "organization" }, { n: "preferred_time", l: "Preferred Time", t: "select", o: times, req: true },
    ],
  },
  partnership: {
    cta: "Explore Partnership",
    fields: [
      { n: "name", l: "Name", req: true, auto: "name" }, { n: "company", l: "Company", req: true, auto: "organization" },
      { n: "email", l: "Email", t: "email", req: true, auto: "email" }, { n: "phone", l: "Phone", t: "tel", req: true, auto: "tel" },
      { n: "partnership_type", l: "Partnership Type", t: "select", o: partnershipTypes, req: true },
      { n: "message", l: "Proposal Details", t: "textarea", req: true },
    ],
  },
};

const SITEKEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
declare global { interface Window { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; grecaptcha?: { ready: (cb: () => void) => void; execute: (k: string, o: { action: string }) => Promise<string> } } }

export default function LeadForm({ kind, preset = {}, title }: { kind: Kind; preset?: { industry?: string; services?: string[] }; title?: string }) {
  const cfg = forms[kind];
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [services, setServices] = useState<string[]>(preset.services ?? []);
  const started = useRef(0);
  useEffect(() => { started.current = Date.now(); }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { form_type: kind, services, consent: fd.get("consent") === "on", hp: fd.get("hp") ?? "", t: started.current, page: location.pathname };
    for (const f of cfg.fields) if (f.t !== "multi") body[f.n] = String(fd.get(f.n) ?? "").trim();
    const utm: Record<string, string> = {};
    new URLSearchParams(location.search).forEach((v, k) => k.startsWith("utm_") && (utm[k] = v));
    body.utm = utm;

    const local: Record<string, string> = {};
    for (const f of cfg.fields) if (f.req && (f.t === "multi" ? !services.length : !body[f.n])) local[f.n] = "Required";
    if (!body.consent) local.consent = "Please tick to consent";
    setErrs(local);
    if (Object.keys(local).length) return;

    setStatus("sending"); setMsg("");
    try {
      if (SITEKEY && window.grecaptcha) body.rc = await new Promise<string>((res) => window.grecaptcha!.ready(() => window.grecaptcha!.execute(SITEKEY, { action: "lead" }).then(res)));
      const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) { setErrs(j.fields ?? {}); setMsg(j.error ?? "Something went wrong."); setStatus("idle"); return; }
      // conversion tracking (no-ops unless the visitor consented and IDs are configured)
      window.gtag?.("event", "generate_lead", { form_type: kind });
      const ads = process.env.NEXT_PUBLIC_GADS_ID, label = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;
      if (ads && label) window.gtag?.("event", "conversion", { send_to: `${ads}/${label}` });
      window.fbq?.("track", "Lead");
      setStatus("done");
    } catch { setMsg("Network error. Please try again."); setStatus("idle"); }
  }

  if (status === "done") {
    const wa = waLink("Hello Bizgrow Solutions, I just submitted an enquiry on your website.");
    return (
      <div className="card text-center" role="status">
        <h3 className="text-2xl">Thank you!</h3>
        <p className="mt-2 text-muted">We’ve received your request and our team will contact you shortly.</p>
        {wa && <a href={wa} className="btn btn-primary mt-4" target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="card" aria-label={title ?? cfg.cta}>
      {SITEKEY && <Script src={`https://www.google.com/recaptcha/api.js?render=${SITEKEY}`} strategy="lazyOnload" />}
      {title && <h3 className="mb-4 text-2xl">{title}</h3>}
      <div className="grid gap-4 sm:grid-cols-2">
        {cfg.fields.map((f) => {
          const wide = f.t === "textarea" || f.t === "multi";
          const id = `${kind}-${f.n}`;
          return (
            <div key={f.n} className={`field ${wide ? "sm:col-span-2" : ""}`}>
              {f.t === "multi" ? (
                <fieldset>
                  <legend className="mb-1 text-sm font-semibold text-navy">{f.l}{f.req && " *"}</legend>
                  <div className="flex flex-wrap gap-2">
                    {f.o!.map((o) => (
                      <label key={o} className="chip">
                        <input type="checkbox" checked={services.includes(o)} onChange={() => setServices(services.includes(o) ? services.filter((s) => s !== o) : [...services, o])} />{o}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <>
                  <label htmlFor={id}>{f.l}{f.req && " *"}</label>
                  {f.t === "textarea" ? <textarea id={id} name={f.n} rows={4} /> :
                    f.t === "select" ? (
                      <select id={id} name={f.n} defaultValue={f.n === "industry" ? preset.industry ?? "" : ""}>
                        <option value="">Select…</option>{f.o!.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : <input id={id} name={f.n} type={f.t ?? "text"} autoComplete={f.auto} inputMode={f.t === "tel" ? "tel" : undefined} />}
                </>
              )}
              {errs[f.n] && <p className="err" role="alert">{errs[f.n]}</p>}
            </div>
          );
        })}
      </div>
      {/* honeypot: hidden from humans and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px]"><input name="hp" tabIndex={-1} autoComplete="off" /></div>
      <label className="mt-4 flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" name="consent" className="mt-1" />
        <span>I agree to Bizgrow Solutions contacting me about my enquiry and storing my details as described in the <a href="/privacy" className="underline" target="_blank">Privacy Policy</a>.</span>
      </label>
      {errs.consent && <p className="mt-1 text-xs text-[#b42318]" role="alert">{errs.consent}</p>}
      {msg && <p className="mt-3 text-sm text-[#b42318]" role="alert">{msg}</p>}
      <button className="btn btn-primary mt-5 max-sm:w-full" disabled={status === "sending"}>{status === "sending" ? "Sending…" : cfg.cta}</button>
    </form>
  );
}
