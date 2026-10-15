# Supabase Independence Migration — MCAS.tech

## Goal

Decouple the public research website from Supabase while preserving the protected, live-telemetry dashboard on Supabase until a separately tested backend migration is approved.

## Safety rules

- Work on `migration/public-site-supabase-independence`; do not commit directly to `main`.
- Do not delete, pause, or modify the Supabase project or its data.
- Do not change production hosting or DNS during this migration.
- Keep dashboard authentication, row-level security, telemetry writes, and live subscriptions unchanged in the first phase.
- Never put a service-role key or database credential in client-side code.

## Repository findings

The public homepage currently imports the browser Supabase client to write email addresses to `leads_subscribers` (`src/app/page.tsx`). The blog feed and article route query `blog_posts` (`src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx`). The dashboard uses `fcws_telemetry_logs`, ground-truth updates, and live database subscriptions. Therefore, removing Supabase imports indiscriminately would break real features.

## Phased migration

### Phase 0 — Inventory and backup (required before changing blog behaviour)

1. Export the `blog_posts` table including all columns and content, plus a schema description.
2. Record the currently published slugs and confirm which rows should be public.
3. Export or separately back up `leads_subscribers` in accordance with applicable privacy requirements.
4. Back up dashboard tables and policies before any later dashboard migration.
5. Keep exports private; do not commit subscriber email addresses or telemetry containing personal data to Git.

### Phase 1 — Public research content

1. Move published blog articles into version-controlled content files under `content/blog/` (Markdown/MDX or JSON metadata plus Markdown body).
2. Preserve existing slugs, publication dates, author names, excerpts, cover image URLs, and article body formatting.
3. Render the blog from local content at build/runtime without a Supabase request.
4. Add static generation for published article routes where compatible with the chosen Next.js and Cloudflare deployment mode.
5. Verify every old blog URL and check math, tables, images, and code/figure formatting before switching.

**Blocker:** The repository alone does not contain the authoritative contents of the remote `blog_posts` table. Do not switch the blog to an empty local source until the database export has been imported and checked.

### Phase 2 — Homepage subscription

Choose and configure a real destination before removing the existing insert:
- a mailing-list provider, or
- a server-side form endpoint with validation, abuse protection, privacy notice, and secure storage.

Do not silently discard submissions or store email addresses in browser storage as a substitute for a mailing list.

### Phase 3 — Cloudflare compatibility

1. Confirm whether the existing Next.js application will run on Cloudflare Workers using the supported Next.js/OpenNext adapter, or whether the public site can be built as a static export on Cloudflare Pages.
2. Static export is only suitable if every route and feature used by the public site can be generated without unsupported server features.
3. Configure preview deployments and required environment variables separately from production.
4. Test the preview URL before changing production routing.

### Phase 4 — Protected dashboard (separate project)

Retain Supabase for the dashboard in the public-site migration. A future dashboard migration must separately replace:
- authentication/session management and access controls;
- database reads and ground-truth writes;
- real-time PostgreSQL change subscriptions;
- secrets management, backups, monitoring, and recovery.

No dashboard migration should be merged without a test plan for authorization and live telemetry.

## Acceptance checklist

- [ ] Blog feed no longer makes a Supabase request.
- [ ] Every previously published article slug resolves and content matches the export.
- [ ] Homepage subscription submissions reach the selected destination.
- [ ] Public research pages build and render in the Cloudflare preview.
- [ ] Dashboard login and access policies remain unchanged.
- [ ] Live telemetry updates and ground-truth writes still work.
- [ ] No production environment variables, DNS, or Supabase resources changed.
