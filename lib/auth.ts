import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { one } from "./db";

export type Role = "admin" | "manager" | "employee";
export type User = { id: number; name: string; email: string; role: Role };

const COOKIE = "bg_session";
const key = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ chars)");
  return new TextEncoder().encode(s);
};

export async function login(email: string, password: string): Promise<boolean> {
  const u = await one<{ id: number; password_hash: string; active: boolean }>(
    "SELECT id, password_hash, active FROM users WHERE email = lower($1)", [email.trim()]);
  // compare even when user is missing so timing doesn't reveal valid emails
  const ok = await bcrypt.compare(password, u?.password_hash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi");
  if (!u || !u.active || !ok) return false;
  await setSession(u.id, u.password_hash);
  return true;
}

// `v` ties a session to the current password hash: changing the password invalidates every other session.
const ver = (h: string) => h.slice(-12);
export async function setSession(uid: number, passwordHash: string) {
  const token = await new SignJWT({ uid, v: ver(passwordHash) }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("8h").sign(key());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8 * 3600 });
}

export async function changePassword(uid: number, current: string, next: string): Promise<boolean> {
  const u = await one<{ password_hash: string }>("SELECT password_hash FROM users WHERE id=$1 AND active", [uid]);
  if (!u || !(await bcrypt.compare(current, u.password_hash))) return false;
  const h = await hash(next);
  await one("UPDATE users SET password_hash=$2 WHERE id=$1", [uid, h]);
  await setSession(uid, h); // keep this browser signed in
  return true;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}

// Re-reads the user on every request so deactivation / role change take effect immediately.
export async function getUser(): Promise<User | null> {
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, key());
    const u = await one<User & { password_hash: string }>("SELECT id, name, email, role, password_hash FROM users WHERE id = $1 AND active", [payload.uid]);
    if (!u || payload.v !== ver(u.password_hash)) return null;
    return { id: u.id, name: u.name, email: u.email, role: u.role };
  } catch {
    return null;
  }
}

export async function requireUser(roles?: Role[]): Promise<User> {
  const u = await getUser();
  if (!u) redirect("/admin/login");
  if (roles && !roles.includes(u.role)) redirect("/admin");
  return u;
}

export const hash = (pw: string) => bcrypt.hash(pw, 12);
