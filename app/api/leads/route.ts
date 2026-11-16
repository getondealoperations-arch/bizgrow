import { NextRequest, NextResponse } from "next/server";
import { bodySchema, createLead, missing } from "@/lib/leads";
import { limited, recaptchaOk } from "@/lib/spam";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(`lead:${ip}`, 5, 10 * 60_000)) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0] ?? "form"), i.message]));
    // honeypot filled → pretend success so bots learn nothing
    if ("hp" in fields) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please check the highlighted fields.", fields }, { status: 400 });
  }
  const d = parsed.data;
  if (d.t && Date.now() - d.t < 2500) return NextResponse.json({ ok: true }); // submitted faster than a human
  const miss = missing(d);
  if (miss.length) return NextResponse.json({ error: "Please complete the required fields.", fields: Object.fromEntries(miss.map((m) => [m, "Required"])) }, { status: 400 });
  if (!(await recaptchaOk(d.rc))) return NextResponse.json({ error: "Spam check failed. Please try again." }, { status: 400 });

  await createLead(d);
  return NextResponse.json({ ok: true });
}
