# People & Research Capability Survey — setup notes

This feature is isolated on the `feature/people-capability-survey-v1` branch. It adds new routes and does not modify existing MCAS.tech pages, navigation, layout, global styles or current features.

## Routes

- Public staff questionnaire: `/people-survey`
- Restricted management dashboard: `/people-admin`
- Public submission endpoint: `POST /api/people/submit`
- Restricted results endpoint: `GET /api/people/admin`

The survey intentionally does not request a full name, staff number, email address or unit. It does request position/designation, grade, employment status, service-years band, responsibilities and project experience. These details may make a respondent recognisable; the survey therefore describes responses as confidential, not anonymous.

## Required server environment variables

Keep these values in the hosting provider's server-side environment settings. Never add secrets to Git or use a `NEXT_PUBLIC_` prefix for them.

- `NEXT_PUBLIC_SUPABASE_URL` — existing project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — existing public key, used only to verify an administrator's existing Supabase Auth access token.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only service-role key used by the route handlers to insert and read the private tables.
- `PEOPLE_ADMIN_EMAILS` — comma-separated email addresses for the Head of Unit and one designated administrative officer. These must be existing Supabase Auth accounts.
- `PEOPLE_RATE_LIMIT_SALT` — long random server-only value used to hash request IP addresses for a basic submission limit.

The management endpoint verifies the bearer token with Supabase Auth and checks the verified email against `PEOPLE_ADMIN_EMAILS`. The browser never receives the service-role key.

## Database setup

1. Obtain MIROS ICT/security/privacy approval for the use of the existing Supabase project and its data-hosting location before collecting real staff responses.
2. Review `docs/people-capability-survey-schema.sql`.
3. Apply the SQL in the Supabase SQL Editor only after approval.
4. Confirm both tables have RLS enabled and no access policies for `anon` or `authenticated`. The route handlers use the server-only service-role key.
5. Add the required environment variables to the hosting provider's **Preview** environment first.
6. Test the survey with synthetic responses and test that an ordinary authenticated account receives HTTP 403 from the management endpoint.
7. Only after review, configure production environment variables and deploy.

## Privacy and operational notes

- The profile table contains no name, staff number, email address or unit column.
- Position/designation and free-text answers can indirectly identify a respondent. The introductory notice explains this.
- Staff should not enter names, staff numbers, email addresses, unit names or confidential project details in free-text answers.
- The application stores only a salted hash of the request IP in the rate-limit table. The raw IP is not written to the database.
- The rate limit is a basic abuse-prevention measure, not a substitute for a managed CAPTCHA/Turnstile or hosting-level WAF rule.
- Individual responses are returned only to allowlisted administrators. The admin API sends `Cache-Control: private, no-store`.
- Define an approved retention period and deletion process before launch.
- No AI analysis, ranking or automated personnel decisions are included in this version.

## Scope protection

Do not edit existing site files as part of this feature. In particular, keep `src/app/layout.tsx`, `src/components/Navigation.tsx`, the homepage, global CSS and existing feature routes unchanged. Staff receive the direct survey link; the admin dashboard link is shared only with authorised administrators.
