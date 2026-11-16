"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { login, logout, requireUser, hash, changePassword } from "@/lib/auth";
import { q, one } from "@/lib/db";
import { canManage } from "@/lib/admin";
import { statuses } from "@/lib/content";
import { limited } from "@/lib/spam";
import { headers } from "next/headers";

export type LoginState = { error: string; email: string };
export async function loginAction(_: LoginState, fd: FormData): Promise<LoginState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const email = String(fd.get("email") ?? "");
  if (limited(`login:${ip}`, 10, 15 * 60_000) || limited(`login:${email}`, 6, 15 * 60_000)) return { error: "Too many attempts. Try again later.", email };
  if (!(await login(email, String(fd.get("password") ?? "")))) return { error: "Invalid email or password.", email };
  redirect("/admin");
}
export async function logoutAction() { await logout(); redirect("/admin/login"); }

// Ensures the actor may touch this lead (employees: only their own)
async function leadAccess(id: number) {
  const u = await requireUser();
  const l = await one<{ assigned_to: number | null }>("SELECT assigned_to FROM leads WHERE id=$1", [id]);
  if (!l || (u.role === "employee" && l.assigned_to !== u.id)) redirect("/admin/leads");
  return u;
}
const ev = (lead: number, user: number, kind: string, body: string) =>
  q("INSERT INTO lead_events (lead_id,user_id,kind,body) VALUES ($1,$2,$3,$4)", [lead, user, kind, body]);

export async function updateLead(fd: FormData) {
  const id = Number(fd.get("id"));
  const u = await leadAccess(id);
  const cur = await one<{ status: string; assigned_to: number | null; follow_up_at: string | null }>("SELECT status, assigned_to, DATE_FORMAT(follow_up_at,'%Y-%m-%d') follow_up_at FROM leads WHERE id=$1", [id]);
  const status = String(fd.get("status"));
  if (statuses.some((s) => s[0] === status) && status !== cur!.status) {
    await q("UPDATE leads SET status=$2 WHERE id=$1", [id, status]);
    await ev(id, u.id, "status", `Status: ${cur!.status} → ${status}`);
  }
  const fu = String(fd.get("follow_up_at") || "");
  if (fu !== (cur!.follow_up_at ?? "") && (!fu || /^\d{4}-\d{2}-\d{2}$/.test(fu))) {
    await q("UPDATE leads SET follow_up_at=$2 WHERE id=$1", [id, fu || null]);
    await ev(id, u.id, "follow_up", fu ? `Follow-up set for ${fu}` : "Follow-up cleared");
  }
  if (canManage(u)) {
    const a = Number(fd.get("assigned_to")) || null;
    if (a !== cur!.assigned_to) {
      await q("UPDATE leads SET assigned_to=$2 WHERE id=$1", [id, a]);
      const n = a ? (await one<{ name: string }>("SELECT name FROM users WHERE id=$1", [a]))?.name : "nobody";
      await ev(id, u.id, "assign", `Assigned to ${n}`);
    }
  }
  const note = String(fd.get("note") ?? "").trim().slice(0, 3000);
  if (note) await ev(id, u.id, "note", note);
  revalidatePath(`/admin/leads/${id}`);
}

export async function createEmployee(fd: FormData) {
  const u = await requireUser(["admin"]);
  const d = z.object({ name: z.string().trim().min(1), email: z.string().trim().email().toLowerCase(), password: z.string().min(10), role: z.enum(["admin", "manager", "employee"]) })
    .safeParse(Object.fromEntries(fd));
  if (!d.success) redirect("/admin/employees?err=Invalid+input+(password+min+10+chars)");
  try { await q("INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4)", [d.data.name, d.data.email, await hash(d.data.password), d.data.role]); }
  catch { redirect("/admin/employees?err=Email+already+exists"); }
  void u; revalidatePath("/admin/employees");
}

export async function updateEmployee(fd: FormData) {
  const u = await requireUser(["admin"]);
  const id = Number(fd.get("id"));
  if (id === u.id) redirect("/admin/employees?err=You+cannot+change+your+own+role+or+status");
  const role = z.enum(["admin", "manager", "employee"]).parse(fd.get("role"));
  await q("UPDATE users SET role=$2, active=$3 WHERE id=$1", [id, role, fd.get("active") === "on"]);
  revalidatePath("/admin/employees");
}

const kinds = ["post", "testimonial", "case_study", "faq", "banner", "seo", "setting"];
export async function saveCms(fd: FormData) {
  const u = await requireUser();
  if (!canManage(u)) redirect("/admin");
  const kind = String(fd.get("kind"));
  if (!kinds.includes(kind)) redirect("/admin/cms");
  const id = Number(fd.get("id")) || 0;
  const title = String(fd.get("title") ?? "").trim();
  const slug = String(fd.get("slug") || title).trim().toLowerCase().replace(/[^a-z0-9/_-]+/g, "-").replace(/^-+|-+$/g, "") || "item";
  const data: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (k.startsWith("d_")) data[k.slice(2)] = String(v);
  const pub = fd.get("published") === "on";
  // trust rule: testimonials / case studies cannot go live without a note on how they were verified
  if (pub && ["testimonial", "case_study"].includes(kind) && !data.verified_by?.trim()) redirect(`/admin/cms/${kind}?err=Add+how+this+was+verified+before+publishing`);
  const at = String(fd.get("publish_at") || "").replace("T", " ") || null;
  const args = [kind, kind === "seo" ? String(fd.get("slug")) : slug, title, String(fd.get("body") ?? ""), JSON.stringify(data), pub, at];
  try {
    if (id) await q("UPDATE cms_items SET kind=$1, slug=$2, title=$3, body=$4, data=$5, published=$6, publish_at=$7, updated_at=now() WHERE id=$8 AND kind=$1", [...args, id]);
    else await q("INSERT INTO cms_items (kind,slug,title,body,data,published,publish_at) VALUES ($1,$2,$3,$4,$5,$6,$7) ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body), data=VALUES(data), published=VALUES(published), publish_at=VALUES(publish_at), updated_at=now()", args);
  } catch { redirect(`/admin/cms/${kind}?err=Could+not+save`); }
  revalidatePath("/", "layout");
  redirect(`/admin/cms/${kind}`);
}

export async function deleteCms(fd: FormData) {
  const u = await requireUser();
  if (!canManage(u)) redirect("/admin");
  const kind = String(fd.get("kind"));
  await q("DELETE FROM cms_items WHERE id=$1 AND kind=$2", [Number(fd.get("id")), kind]);
  revalidatePath("/", "layout");
  redirect(`/admin/cms/${kind}`);
}

export async function changePasswordAction(_: string, fd: FormData): Promise<string> {
  const u = await requireUser();
  if (limited(`pw:${u.id}`, 5, 15 * 60_000)) return "Too many attempts. Try again later.";
  const cur = String(fd.get("current") ?? ""), next = String(fd.get("next") ?? "");
  if (next.length < 10) return "New password must be at least 10 characters.";
  if (next !== String(fd.get("confirm") ?? "")) return "New passwords do not match.";
  if (next === cur) return "New password must differ from the current one.";
  if (!(await changePassword(u.id, cur, next))) return "Current password is incorrect.";
  return "ok";
}
