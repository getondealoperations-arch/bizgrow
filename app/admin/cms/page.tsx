import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { canManage, kinds } from "@/lib/admin";
import { redirect } from "next/navigation";


export default async function Cms() {
  const u = await requireUser();
  if (!canManage(u)) redirect("/admin");
  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Website content</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kinds.map(([k, t, d]) => <Link key={k} href={`/admin/cms/${k}`} className="card"><h2 className="text-xl">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></Link>)}
      </div>
      <p className="text-sm text-muted">Service and industry page copy lives in <code>lib/content.ts</code> (developer-managed); their SEO titles/descriptions are editable under “SEO metadata”.</p>
    </div>
  );
}
