# HUB Centre Capability Survey — setup notes

## Routes
- Staff survey: `/hub-survey` (direct link; no MCAS.tech login)
- Shared aggregate findings: `/hub-survey/findings` (shared access code)
- Management dashboard: `/hub-admin` (existing MCAS.tech sign-in; one to three allowlisted manager emails during MVP (start with one; expand after testing))
- Submit: `POST /api/hub/submit`
- Management data: `GET /api/hub/admin`
- Aggregate findings: `POST /api/hub/findings`

**Tagline:** Different strengths. Shared purpose. Safer roads.

## Server environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server only
- `HUB_ADMIN_EMAILS` — one to three comma-separated, verified Supabase Auth email addresses for the authorised managers
- `HUB_RATE_LIMIT_SALT` — long random server-only salt
- `HUB_FINDINGS_ACCESS_CODE` — shared HUB Findings access phrase; server only, never prefix with `NEXT_PUBLIC_`

The Findings access phrase is a shared gate, not individual authentication; it can be forwarded. The management dashboard remains separately protected by verified Supabase Auth identities and the Pejabat Pengarah access allowlist. The Findings API returns aggregate counts only and never returns raw submissions or free-text answers. Small-cell breakdowns are suppressed (minimum count 5).

## Database
1. Obtain MIROS ICT/security/privacy approval for the Supabase project and hosting location before collecting real responses.
2. Review `docs/hub-capability-survey-schema.sql`.
3. Apply the SQL manually only after approval.
4. Keep RLS enabled; deny anon/authenticated table access. Route handlers use the server-only service role.
5. Configure secrets in Preview first and test with synthetic responses.
6. Confirm that ordinary staff can see only aggregate Findings, and that access to individual submissions is restricted to Pejabat Pengarah through the allowlist.
7. Configure production only after review and approval.

## Privacy and operational safeguards
- No name, staff number, email or unit field is collected.
- Position, grade, service band and free-text may indirectly identify a respondent. This is confidential, not anonymous.
- Ask staff not to include names, staff numbers, unit names or confidential project information in free text.
- Shared Findings contains aggregated structured selections only; no verbatim responses or individual-level rows.
- Suppress categories with fewer than five responses and avoid cross-tabulations that could identify individuals.
- The submission endpoint uses a honeypot and salted IP hash rate-limiting; raw IP is not stored in the database.
- Define retention, deletion, data ownership and access-review procedures before launch.
- No AI ranking, automated personnel decisions or performance appraisal is included.

No SQL has been applied and no hosting secrets have been configured as part of this code change.
