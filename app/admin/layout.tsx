import Link from "next/link";
import type { Metadata } from "next";
import { getUser } from "@/lib/auth";
import { canManage } from "@/lib/admin";
import { logoutAction } from "./actions";
import { Logo } from "@/components/Header";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await getUser();
  return (
    <div className="min-h-screen bg-soft">
      {u && (
        <header className="border-b border-line bg-navy text-white">
          <div className="container-x flex items-center justify-between gap-3 py-2">
            <Link href="/admin" className="flex items-center gap-3" aria-label="Admin home"><Logo light className="h-8 w-auto" /><span className="hidden border-l border-white/25 pl-3 text-sm text-white/70 sm:inline">Admin</span></Link>
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden whitespace-nowrap text-white/70 sm:inline">{u.name} · {u.role}</span><span className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize sm:hidden">{u.role}</span>
              <form action={logoutAction}><button className="flex h-11 items-center whitespace-nowrap px-2 underline">Sign out</button></form>
            </div>
          </div>
          {/* scrolls sideways on phones instead of wrapping into a pile */}
          <nav className="container-x flex gap-1 overflow-x-auto pb-1 text-sm [&>a]:flex [&>a]:h-11 [&>a]:shrink-0 [&>a]:items-center [&>a]:rounded-lg [&>a]:px-3 [&>a]:hover:bg-white/10" aria-label="Admin">
            <Link href="/admin">Dashboard</Link><Link href="/admin/leads">Leads</Link>
            {canManage(u) && <Link href="/admin/employees">Employees</Link>}
            {canManage(u) && <Link href="/admin/cms">Content</Link>}
            <Link href="/admin/account">Account</Link>
          </nav>
        </header>
      )}
      <div className="container-x py-6 sm:py-8">{children}</div>
    </div>
  );
}
