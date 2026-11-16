# Bizgrow Solutions – website + lead CRM

Next.js 16 (App Router) · MySQL 8 / MariaDB (`mysql2`, plain SQL) · jose/bcrypt auth · Zod · Nodemailer · Tailwind v4.
Chosen over a headless CMS/ORM to keep the stack small: one DB, one deployable app, no extra services.

## Run
```
cp .env.example .env.local   # fill DATABASE_URL, SESSION_SECRET (32+ chars)
mysql -e "CREATE DATABASE bizgrow CHARACTER SET utf8mb4" && npm run seed   # schema + first admin (password printed once)
npm run dev                         # or: npm run build && npm start
```
Admin: `/admin` (noindex, excluded from robots/sitemap). Change the seeded password after first login (create a new admin, deactivate the seed one).

## Roles
- **admin** – everything, creates/deactivates employees. **manager** – all leads, assign, content, team performance. **employee** – only leads assigned to them (enforced in SQL in `lib/admin.ts` and in every server action).

## Database (`db/schema.sql`)
`users` (role, active) · `leads` (one row per form submission; `form_type`, status pipeline, `assigned_to`, `follow_up_at`, `utm`, `consent_at`) · `lead_events` (history: created/note/status/assign/follow_up) · `cms_items` (kind = post|testimonial|case_study|faq|banner|seo|setting; `published` + `publish_at` = scheduling).

## Content & placeholders
Brand, services, industries: `lib/content.ts`. Contact details, social links, map, analytics IDs: env vars (`.env.example`); the site shows `[… – to be added]` until set. Not supplied and therefore placeholders: hex colours (tokens in `globals.css`), founder profile, Privacy/Terms text, testimonials/case studies/articles. Testimonials and case studies cannot be published without a “verified by” note.

## Integrations
GA4 / Meta Pixel / Google Ads load only after cookie consent. reCAPTCHA v3 active when both keys set (honeypot, timing check and rate limit always on). SMTP: set `SMTP_URL`, `MAIL_FROM`, `LEAD_NOTIFY_TO` → internal notification + acknowledgement to the lead. WhatsApp: floating button + per-service click-to-chat with pre-filled text (appears once `NEXT_PUBLIC_WHATSAPP` is set). Automated WhatsApp acknowledgement needs WhatsApp Business Cloud API templates – not wired. External CRM sync (Phase 4) not built; CSV export covers it for now.

## Backup & recovery
`mysqldump --single-transaction DBNAME > bizgrow-$(date +%F).sql` daily (Hostinger also keeps daily backups). Restore: `mysql NEWDB < bizgrow-YYYY-MM-DD.sql`, then point `DATABASE_URL` at it. Test a restore before launch.

## Deploy
Any Node host + MySQL/MariaDB (e.g. Hostinger Cloud: Node.js web app + its MySQL database). Set all env vars, run `npm run migrate` against the prod DB, set `SITE_URL`, serve over HTTPS (cookie is `secure` in production). Note: rate limiting is in-memory per instance.

## Pre-launch QA checklist
Submit each of the 4 forms; confirm lead row, email, and assignment; log in as employee and confirm scope; CSV opens in Excel; Lighthouse on `/` and a service page; `/sitemap.xml` and `/robots.txt`; accept/decline cookie banner and check GA/Pixel only fire after accept; backup + restore drill.
