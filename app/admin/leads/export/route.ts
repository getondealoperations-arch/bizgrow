import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { leadWhere, LeadQuery } from "@/lib/admin";

// Neutralise spreadsheet formula injection (=,+,-,@) and quote per RFC 4180
const cell = (v: unknown) => {
  let s = Array.isArray(v) ? v.join("; ") : v instanceof Date ? v.toISOString() : v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[0-9 ()-]+$/.test(s)) s = "'" + s; // plain phone numbers are safe to leave as-is
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  const u = await getUser();
  if (!u) return new NextResponse("Unauthorized", { status: 401 });
  const f = Object.fromEntries(req.nextUrl.searchParams) as LeadQuery;
  const { where, params } = leadWhere(u, f);
  const rows = await q<Record<string, unknown>>(
    `SELECT l.id, l.created_at, l.form_type, l.name, l.company, l.phone, l.whatsapp, l.email, l.industry, l.location, l.website, l.business_type,
       l.services, l.business_stage, l.budget, l.message, l.contact_method, l.preferred_time, l.partnership_type, l.source, l.page, l.status, u.name AS assigned_to, l.follow_up_at
     FROM leads l LEFT JOIN users u ON u.id=l.assigned_to ${where} ORDER BY l.created_at DESC`, params);
  const cols = rows[0] ? Object.keys(rows[0]) : ["id"];
  const csv = "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n"); // BOM → opens correctly in Excel
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
