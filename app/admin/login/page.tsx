"use client";
import { useActionState } from "react";
import { loginAction } from "../actions";

export default function Login() {
  const [st, act, pending] = useActionState(loginAction, { error: "", email: "" });
  return (
    <form action={act} className="card mx-auto mt-16 max-w-sm space-y-4">
      <h1 className="text-2xl">Admin sign in</h1>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="username" defaultValue={st.email} required /></div>
      <div className="field"><label htmlFor="pw">Password</label><input id="pw" name="password" type="password" autoComplete="current-password" required /></div>
      {st.error && <p className="err text-sm text-[#b42318]" role="alert">{st.error}</p>}
      <button className="btn btn-primary w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
