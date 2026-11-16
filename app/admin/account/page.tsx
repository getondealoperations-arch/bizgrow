"use client";
import { useActionState } from "react";
import { changePasswordAction } from "../actions";

export default function Account() {
  const [msg, act, pending] = useActionState(changePasswordAction, "");
  return (
    <form action={act} className="card max-w-md space-y-4">
      <h1 className="text-2xl">Change password</h1>
      <div className="field"><label htmlFor="c">Current password</label><input id="c" name="current" type="password" autoComplete="current-password" required /></div>
      <div className="field"><label htmlFor="n">New password (min 10 characters)</label><input id="n" name="next" type="password" minLength={10} autoComplete="new-password" required /></div>
      <div className="field"><label htmlFor="f">Confirm new password</label><input id="f" name="confirm" type="password" minLength={10} autoComplete="new-password" required /></div>
      {msg === "ok"
        ? <p role="status" className="text-sm text-[#166534]">Password changed. Other devices have been signed out.</p>
        : msg && <p role="alert" className="text-sm text-[#b42318]">{msg}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : "Change password"}</button>
    </form>
  );
}
