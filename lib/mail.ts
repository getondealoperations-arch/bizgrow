import nodemailer, { type Transporter } from "nodemailer";

let tx: Transporter | null | undefined;
export async function mail(to: string | string[], subject: string, text: string) {
  if (tx === undefined) tx = process.env.SMTP_URL ? nodemailer.createTransport(process.env.SMTP_URL) : null;
  if (!tx || !to.length) return; // SMTP not configured → skip silently (logged in lead_events anyway)
  try {
    await tx.sendMail({ from: process.env.MAIL_FROM, to, subject, text });
  } catch (e) {
    console.error("mail failed", e); // never fail the lead submission because of email
  }
}
