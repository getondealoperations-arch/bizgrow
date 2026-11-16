import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { q, one } from "@/lib/db";
import { canManage } from "@/lib/admin";
import { statuses } from "@/lib/content";
import { updateLead } from "../../actions";

export default async function Lead({ params }: PageProps<"/admin/leads/[id]">) {
  const u = await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const l = await one<Record<string, unknown>>("SELECT *, DATE_FORMAT(follow_up_at,'%Y-%m-%d') fu FROM leads WHERE id=$1", [id]);
  if (!l || (u.role === "employee" && l.assigned_to !== u.id)) notFound();
  const [events, staff] = await Promise.all([
    q<{ kind: string; body: string; at: string; who: string | null }>("SELECT e.kind, e.body, DATE_FORMAT(e.created_at,'%Y-%m-%d %H:%i') at, u.name who FROM lead_events e LEFT JOIN users u ON u.id=e.user_id WHERE lead_id=$1 ORDER BY e.created_at DESC, e.id DESC", [id]),
    canManage(u) ? q<{ id: number; name: string }>("SELECT id,name FROM users WHERE active ORDER BY name") : Promise.resolve([]),
  ]);
  const fields: [string, unknown][] = [["Form", l.form_type], ["Company", l.company], ["Phone", l.phone], ["WhatsApp", l.whatsapp], ["Email", l.email], ["Industry", l.industry], ["Location", l.location], ["Website", l.website],
    ["Business type", l.business_type], ["Stage", l.business_stage], ["Services", (l.services as string[]).join(", ")], ["Budget", l.budget], ["Contact via", l.contact_method], ["Preferred time", l.preferred_time],
    ["Partnership", l.partnership_type], ["Source", l.source], ["Page", l.page], ["Submitted", new Date(String(l.created_at)).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })]];
  return (
    <div className="space-y-5">
      <Link href="/admin/leads" className="inline-block py-2 text-sm underline">← All leads</Link>
      <h1 className="text-3xl">{String(l.name)}</h1>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {fields.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd className="break-words font-medium">{
              k === "Phone" || k === "WhatsApp" ? <a className="inline-block py-1 text-brand-text underline" href={`tel:${String(v).replace(/[^\d+]/g, "")}`}>{String(v)}</a>
              : k === "Email" ? <a className="inline-block py-1 text-brand-text underline" href={`mailto:${String(v)}`}>{String(v)}</a>
              : String(v)}</dd></div>)}
          </dl>
          {l.message ? <><h2 className="mt-5 text-lg">Requirements</h2><p className="mt-1 whitespace-pre-wrap text-sm">{String(l.message)}</p></> : null}
        </section>
        <form action={updateLead} key={`${l.status}-${l.assigned_to}-${l.fu}-${events.length}`} className="card space-y-3">
          <input type="hidden" name="id" value={id} />
          <div className="field"><label htmlFor="st">Status</label><select id="st" name="status" defaultValue={String(l.status)}>{statuses.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
          {canManage(u) && <div className="field"><label htmlFor="as">Assigned to</label><select id="as" name="assigned_to" defaultValue={String(l.assigned_to ?? "")}><option value="">Unassigned</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
          <div className="field"><label htmlFor="fu">Follow-up date</label><input id="fu" type="date" name="follow_up_at" defaultValue={String(l.fu ?? "")} /></div>
          <div className="field"><label htmlFor="nt">Add internal note</label><textarea id="nt" name="note" rows={3} /></div>
          <button className="btn btn-primary w-full">Save</button>
        </form>
      </div>
      <section className="card">
        <h2 className="mb-3 text-xl">History</h2>
        <ul className="space-y-2 text-sm">{events.map((e, i) => <li key={i}><span className="text-muted">{e.at} · {e.who ?? "system"} · {e.kind}</span><div className="whitespace-pre-wrap">{e.body}</div></li>)}</ul>
      </section>
    </div>
  );
}
