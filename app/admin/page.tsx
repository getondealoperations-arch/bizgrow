import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { leadWhere } from "@/lib/admin";
import { statuses } from "@/lib/content";

const Bars = ({ rows }: { rows: { k: string; n: number }[] }) => {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return rows.length === 0 ? <p className="text-sm text-muted">No data yet.</p> : (
    <ul className="space-y-1.5 text-sm">
      {rows.map((r) => (
        <li key={r.k} className="grid grid-cols-[7rem_1fr_2rem] sm:grid-cols-[10rem_1fr_2rem] items-center gap-2">
          <span className="truncate" title={r.k}>{r.k}</span>
          <span className="h-2.5 rounded bg-line"><span className="block h-full rounded bg-brand" style={{ width: `${(r.n / max) * 100}%` }} /></span>
          <span className="text-right font-semibold">{r.n}</span>
        </li>
      ))}
    </ul>
  );
};

export default async function Dashboard() {
  const u = await requireUser();
  const { where, params } = leadWhere(u, {});
  const [byStatus, byService, byIndustry, monthly] = await Promise.all([
    q<{ k: string; n: number }>(`SELECT status k, count(*)::int n FROM leads l ${where} GROUP BY 1`, params),
    q<{ k: string; n: number }>(`SELECT s k, count(*)::int n FROM leads l, unnest(l.services) s ${where} GROUP BY 1 ORDER BY 2 DESC`, params),
    q<{ k: string; n: number }>(`SELECT industry k, count(*)::int n FROM leads l ${where ? where + " AND" : "WHERE"} industry IS NOT NULL GROUP BY 1 ORDER BY 2 DESC`, params),
    q<{ k: string; n: number }>(`SELECT to_char(date_trunc('month', created_at),'YYYY-MM') k, count(*)::int n FROM leads l ${where ? where + " AND" : "WHERE"} created_at > now() - interval '12 months' GROUP BY 1 ORDER BY 1`, params),
  ]);
  const c = Object.fromEntries(byStatus.map((r) => [r.k, r.n])) as Record<string, number>;
  const total = byStatus.reduce((a, r) => a + r.n, 0);
  const tiles: [string, number][] = [["Total leads", total], ...statuses.map(([k, l]) => [l, c[k] ?? 0] as [string, number])];
  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Dashboard{u.role === "employee" && " (your leads)"}</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map(([l, n]) => <Link key={l} href="/admin/leads" className="card !p-4"><p className="text-sm text-muted">{l}</p><p className="font-display text-3xl text-navy">{n}</p></Link>)}
      </div>
      <p className="text-sm text-muted">Pipeline: New Lead → Contacted → Qualified → Meeting Scheduled → Proposal Sent → Negotiation → Won / Lost</p>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card"><h2 className="mb-3 text-xl">Monthly lead generation</h2><Bars rows={monthly} /></section>
        <section className="card"><h2 className="mb-3 text-xl">Service-wise enquiries</h2><Bars rows={byService} /></section>
        <section className="card lg:col-span-2"><h2 className="mb-3 text-xl">Industry-wise enquiries</h2><Bars rows={byIndustry} /></section>
      </div>
    </div>
  );
}
