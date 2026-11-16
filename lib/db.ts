import mysql from "mysql2/promise";

const g = globalThis as unknown as { pool?: mysql.Pool };
export const pool = (g.pool ??= (() => {
  const p = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 10, timezone: "Z" });
  p.pool.on("connection", (c) => c.query("SET time_zone = '+00:00'")); // store/read everything in UTC
  return p;
})());

// Callers keep Postgres-style "$1" placeholders; convert to "?" (a repeated $n is bound again each time).
// Arrays/objects are bound as JSON text (services, utm, data columns).
function bind(sql: string, params: unknown[]): [string, unknown[]] {
  const out: unknown[] = [];
  const text = sql.replace(/\$(\d+)/g, (_, n) => {
    const v = params[Number(n) - 1];
    out.push(v === undefined ? null : v !== null && typeof v === "object" && !(v instanceof Date) ? JSON.stringify(v) : v);
    return "?";
  });
  return [text, out];
}

const JSON_COLS = ["services", "utm", "data"];

export async function q<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool.query(...bind(sql, params));
  if (!Array.isArray(rows)) return [];
  for (const r of rows as Record<string, unknown>[])
    for (const k of JSON_COLS) if (typeof r[k] === "string") { try { r[k] = JSON.parse(r[k] as string); } catch { /* leave as text */ } }
  return rows as T[];
}
export async function one<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return (await q<T>(sql, params))[0];
}
// For INSERTs that need the new row id (replaces Postgres RETURNING id)
export async function insert(sql: string, params: unknown[] = []): Promise<number> {
  const [res] = await pool.query(...bind(sql, params));
  return (res as mysql.ResultSetHeader).insertId;
}
