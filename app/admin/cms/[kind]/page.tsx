import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { canManage, kinds } from "@/lib/admin";
import { q, one } from "@/lib/db";
import type { Item } from "@/lib/cms";
import { blogCategories } from "@/lib/content";
import { saveCms, deleteCms } from "../../actions";

// extra per-kind fields stored in `data` (prefix d_)
const extra: Record<string, { n: string; l: string; opts?: string[] }[]> = {
  post: [{ n: "category", l: "Category", opts: blogCategories }, { n: "excerpt", l: "Excerpt" }, { n: "seo_title", l: "SEO title" }, { n: "seo_description", l: "SEO description" }],
  testimonial: [{ n: "company", l: "Company" }, { n: "verified_by", l: "How was this verified? (required)" }],
  case_study: [{ n: "client", l: "Client" }, { n: "verified_by", l: "How were these results verified? (required)" }],
  faq: [], banner: [], seo: [], setting: [],
};
const titleLabel: Record<string, string> = { testimonial: "Person name", seo: "Meta title", faq: "Question", setting: "Label" };
const bodyLabel: Record<string, string> = { testimonial: "Testimonial", seo: "Meta description", faq: "Answer", setting: "Value", post: "Article (blank line = new paragraph)" };

export default async function CmsKind({ params, searchParams }: PageProps<"/admin/cms/[kind]">) {
  const u = await requireUser();
  if (!canManage(u)) redirect("/admin");
  const { kind } = await params;
  const sp = await searchParams;
  const meta = kinds.find((k) => k[0] === kind);
  if (!meta) notFound();
  const items = await q<Item>("SELECT *, to_char(publish_at,'YYYY-MM-DD\"T\"HH24:MI') AS pa FROM cms_items WHERE kind=$1 ORDER BY created_at DESC", [kind]) as (Item & { pa: string | null })[];
  const editId = Number(sp.edit) || 0;
  const cur = editId ? items.find((i) => i.id === editId) : undefined;
  void one;
  const slugIsPath = kind === "seo" || kind === "setting";
  return (
    <div className="space-y-6">
      <Link href="/admin/cms" className="inline-block py-2 text-sm underline">← Content</Link>
      <h1 className="text-3xl">{meta[1]}</h1>
      {sp.err && <p className="card text-sm text-[#b42318]" role="alert">{String(sp.err)}</p>}
      <div className="card overflow-x-auto !p-0">
        <table className="tbl"><thead><tr><th>Title</th><th>Slug</th><th>Status</th><th></th></tr></thead><tbody>
          {items.map((i) => (
            <tr key={i.id}><td>{i.title}</td><td>{i.slug}</td>
              <td>{!i.published ? "Draft" : i.publish_at && new Date(i.publish_at) > new Date() ? `Scheduled ${i.pa}` : "Live"}</td>
              <td className="flex gap-3"><Link className="underline" href={`/admin/cms/${kind}?edit=${i.id}`}>Edit</Link>
                <form action={deleteCms}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="kind" value={kind} /><button className="text-[#b42318] underline">Delete</button></form></td></tr>
          ))}
          {items.length === 0 && <tr><td colSpan={4} className="text-muted">Nothing yet.</td></tr>}
        </tbody></table>
      </div>
      <form action={saveCms} key={cur?.id ?? "new"} className="card grid max-w-3xl gap-3">
        <h2 className="text-xl">{cur ? "Edit" : "Add new"}</h2>
        <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={cur?.id ?? ""} />
        <div className="field"><label htmlFor="t">{titleLabel[kind] ?? "Title"}</label><input id="t" name="title" defaultValue={cur?.title} required /></div>
        <div className="field"><label htmlFor="s">{slugIsPath ? (kind === "seo" ? "Page path (e.g. /services/lead-generation)" : "Key (e.g. home_banner)") : "URL slug (optional)"}</label><input id="s" name="slug" defaultValue={cur?.slug} required={slugIsPath} /></div>
        <div className="field"><label htmlFor="b">{bodyLabel[kind] ?? "Body"}</label><textarea id="b" name="body" rows={kind === "post" ? 14 : 4} defaultValue={cur?.body} /></div>
        {(extra[kind] ?? []).map((f) => (
          <div key={f.n} className="field"><label htmlFor={`d_${f.n}`}>{f.l}</label>
            {f.opts ? <select id={`d_${f.n}`} name={`d_${f.n}`} defaultValue={cur?.data[f.n] ?? ""}>{f.opts.map((o) => <option key={o}>{o}</option>)}</select>
              : <input id={`d_${f.n}`} name={`d_${f.n}`} defaultValue={cur?.data[f.n] ?? ""} />}</div>
        ))}
        {!slugIsPath && (
          <div className="flex flex-wrap items-end gap-5">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={cur?.published} /> Published</label>
            <div className="field"><label htmlFor="pa">Publish at (optional – schedules)</label><input id="pa" type="datetime-local" name="publish_at" defaultValue={(cur as { pa?: string } | undefined)?.pa ?? ""} /></div>
          </div>
        )}
        {slugIsPath && <input type="hidden" name="published" value="on" />}
        <button className="btn btn-primary w-fit">Save</button>
      </form>
    </div>
  );
}
