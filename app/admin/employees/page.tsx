import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { createEmployee, updateEmployee } from "../actions";

export default async function Employees({ searchParams }: PageProps<"/admin/employees">) {
  const u = await requireUser(["admin", "manager"]);
  const err = (await searchParams).err;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await q<Record<string, any>>(`
    SELECT u.id, u.name, u.email, u.role, u.active,
      count(l.id) assigned,
      count(CASE WHEN l.status <> 'new' THEN 1 END) worked,
      count(CASE WHEN l.status IN ('qualified','meeting','proposal','negotiation') THEN 1 END) active_pipeline,
      count(CASE WHEN l.status = 'won' THEN 1 END) won,
      count(CASE WHEN l.status = 'lost' THEN 1 END) lost,
      count(CASE WHEN l.follow_up_at IS NOT NULL AND l.follow_up_at < CURDATE() AND l.status NOT IN ('won','lost') THEN 1 END) overdue,
      count(CASE WHEN l.follow_up_at = CURDATE() AND l.status NOT IN ('won','lost') THEN 1 END) due_today
    FROM users u LEFT JOIN leads l ON l.assigned_to = u.id GROUP BY u.id ORDER BY u.name`);
  const isAdmin = u.role === "admin";
  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Employees</h1>
      {err && <p className="card text-sm text-[#b42318]" role="alert">{err}</p>}
      <div className="card overflow-x-auto !p-0">
        <table className="tbl">
          <thead><tr><th>Name</th><th>Role</th><th>Assigned</th><th>Worked</th><th>In pipeline</th><th>Won</th><th>Lost</th><th>Follow-ups due today</th><th>Overdue</th>{isAdmin && <th>Manage</th>}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)}>
                <td><b>{r.name}</b><div className="text-xs text-muted">{r.email}</div></td><td>{r.role}{!r.active && " (inactive)"}</td>
                <td>{r.assigned}</td><td>{r.worked}</td><td>{r.active_pipeline}</td><td>{r.won}</td><td>{r.lost}</td><td>{r.due_today}</td><td className={Number(r.overdue) ? "font-bold text-[#b42318]" : ""}>{r.overdue}</td>
                {isAdmin && <td>
                  {r.id === u.id ? <span className="text-xs text-muted">you</span> : (
                    <form action={updateEmployee} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={String(r.id)} />
                      <select name="role" defaultValue={String(r.role)} aria-label="Role" className="rounded border border-line px-1 py-1 text-xs"><option>employee</option><option>manager</option><option>admin</option></select>
                      <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="active" defaultChecked={!!r.active} />active</label>
                      <button className="btn btn-ghost !px-2 !py-1 text-xs">Save</button>
                    </form>)}
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAdmin && (
        <form action={createEmployee} className="card grid max-w-2xl gap-3 sm:grid-cols-2">
          <h2 className="text-xl sm:col-span-2">Create employee account</h2>
          <div className="field"><label htmlFor="n">Name</label><input id="n" name="name" required /></div>
          <div className="field"><label htmlFor="e">Email</label><input id="e" name="email" type="email" required /></div>
          <div className="field"><label htmlFor="p">Temporary password (min 10)</label><input id="p" name="password" type="password" minLength={10} required autoComplete="new-password" /></div>
          <div className="field"><label htmlFor="r">Role</label><select id="r" name="role" defaultValue="employee"><option value="employee">Employee – own leads only</option><option value="manager">Manager – all leads, assign, content</option><option value="admin">Admin – everything</option></select></div>
          <button className="btn btn-primary sm:col-span-2">Create account</button>
        </form>
      )}
    </div>
  );
}
