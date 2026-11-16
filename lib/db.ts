import { Pool } from "pg";

const g = globalThis as unknown as { pool?: Pool };
export const pool = (g.pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 10 }));

export async function q<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  return (await pool.query(sql, params)).rows as T[];
}
export async function one<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return (await q<T>(sql, params))[0];
}
