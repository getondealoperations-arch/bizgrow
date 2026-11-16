import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { leadWhere, canManage, LeadQuery } from "@/lib/admin";
import { statuses, serviceOptions, industryOptions } from "@/lib/content";

const label = Object.fromEntries(statuses);

export default async function Leads({ searchParams }: PageProps<"/admin/leads">) {
  const u = await requireUser();
  const sp = await searchParams;
  const f: LeadQuery = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, String(Array.isArray(v) ? v[0] : v ?? "")]));
  const { where, params } = leadWhere(u, f);
  const [rows, sources, staff] = await Promise.all([
    q<Record<string, string>>(`SELECT l.id,l.name,l.company,l.phone,l.status,l.industry,l.source,l.services,l.form_type,DATE_FORMAT(l.created_at,'%Y-%m-%d') d, DATE_FORMAT(l.follow_up_at,'%Y-%m-%d') fu, u.name owner
      FROM leads l LEFT JOIN users u ON u.id=l.assigned_to ${where} ORDER BY l.created_at DESC LIMIT 200`, params),
    q<{ source: string }>("SELECT DISTINCT source FROM leads ORDER BY 1"),
    canManage(u) ? q<{ id: number; name: string }>("SELECT id,name FROM users WHERE active ORDER BY name") : Promise.resolve([]),
  ]);
  const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
  const sel = (n: keyof LeadQuery, opts: [string, string][], ph: string) => (
    <select name={n} defaultValue={f[n] ?? ""} aria-label={ph} className="rounded border border-line bg-white px-2 py-1.5 text-base max-sm:w-full max-sm:py-2.5 sm:text-sm"><option value="">{ph}</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl">Leads</h1>
        <a className="btn btn-ghost" href={`/admin/leads/export?${qs}`}>Export CSV</a></div>
      <form className="card flex flex-wrap items-center gap-2 !p-3">
        <input name="q" defaultValue={f.q} placeholder="Search name, company, phone" aria-label="Search" className="min-w-52 rounded border border-line px-2 py-1.5 text-base max-sm:w-full max-sm:py-2.5 sm:text-sm" />
        <div className="grid grid-cols-2 gap-2 max-sm:w-full sm:contents">
        {sel("status", statuses.map(([k, l]) => [k, l]), "Any status")}
        {sel("service", serviceOptions.map((s) => [s, s]), "Any service")}
        {sel("industry", industryOptions.map((s) => [s, s]), "Any industry")}
        {sel("source", sources.map((s) => [s.source, s.source]), "Any source")}
        {canManage(u) && sel("assigned", [["none", "Unassigned"], ...staff.map((s) => [String(s.id), s.name] as [string, string])], "Anyone")}
        </div>
        <input type="date" name="from" defaultValue={f.from} aria-label="From date" className="rounded border border-line px-2 py-1.5 text-base max-sm:w-[calc(50%-0.25rem)] max-sm:py-2.5 sm:text-sm" />
        <input type="date" name="to" defaultValue={f.to} aria-label="To date" className="rounded border border-line px-2 py-1.5 text-base max-sm:w-[calc(50%-0.25rem)] max-sm:py-2.5 sm:text-sm" />
        <button className="btn btn-primary !py-1.5 max-sm:flex-1">Filter</button><Link href="/admin/leads" className="px-2 py-3 text-sm underline">Reset</Link>
      </form>
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id}>
            <Link href={`/admin/leads/${r.id}`} className="card block !p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="truncate font-semibold text-navy">{r.name}</p><p className="truncate text-sm text-muted">{r.company || "—"}</p></div>
                <span className="badge shrink-0">{label[r.status as keyof typeof label]}</span>
              </div>
              <p className="mt-2 text-sm">{r.phone || "—"}</p>
              <p className="mt-1 text-xs text-muted">{(r.services as unknown as string[]).join(", ") || r.form_type} · {r.d}</p>
              <p className="mt-1 text-xs text-muted">Owner: {r.owner ?? "Unassigned"}{r.fu ? ` · Follow-up ${r.fu}` : ""}</p>
            </Link>
          </li>
        ))}
        {rows.length === 0 && <li className="card text-center text-sm text-muted">No leads match.</li>}
      </ul>
      <div className="card hidden overflow-x-auto !p-0 md:block">
        <table className="tbl">
          <thead><tr><th>Date</th><th>Name</th><th>Company</th><th>Phone</th><th>Services</th><th>Source</th><th>Status</th><th>Owner</th><th>Follow-up</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.d}</td><td><Link className="font-semibold text-brand-text" href={`/admin/leads/${r.id}`}>{r.name}</Link><div className="text-xs text-muted">{r.form_type}</div></td>
                <td>{r.company}</td><td>{r.phone}</td><td>{(r.services as unknown as string[]).join(", ")}</td><td>{r.source}</td>
                <td><span className="badge">{label[r.status as keyof typeof label]}</span></td><td>{r.owner ?? "—"}</td><td>{r.fu ?? ""}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="text-center text-muted">No leads match.</td></tr>}
          </tbody>
        </table>
      </div>
      {rows.length === 200 && <p className="text-sm text-muted">Showing the latest 200. Narrow the filters or export CSV for all matches.</p>}
    </div>
  );
}
