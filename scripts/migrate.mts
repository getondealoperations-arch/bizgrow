import { readFileSync } from "node:fs";
import { pool, one } from "../lib/db.ts";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

for (const stmt of readFileSync("db/schema.sql", "utf8").split(";")) if (stmt.replace(/--.*$/gm, "").trim()) await pool.query(stmt);
console.log("schema ok");

if (process.argv.includes("--seed")) {
  const email = (process.env.ADMIN_EMAIL || "admin@bizgrow.local").toLowerCase();
  if (!(await one("SELECT 1 FROM users WHERE email=$1", [email]))) {
    const pw = process.env.ADMIN_PASSWORD || randomBytes(9).toString("base64url");
    await pool.query("INSERT INTO users (name,email,password_hash,role) VALUES ('Administrator',$1,$2,'admin')", [email, await bcrypt.hash(pw, 12)]);
    console.log(`admin created → ${email} / ${pw}   (change it after first login)`);
  } else console.log("admin exists");
}
await pool.end();
