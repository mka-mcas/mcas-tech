-- People & Research Capability Survey — initial schema
-- No name, staff number, email address or unit field is collected.
-- Keep this table inaccessible to anon/authenticated clients. All access is through
-- server-side route handlers using a server-only Supabase service-role secret.

create table if not exists public.people_capability_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  position text not null check (char_length(position) between 2 and 120),
  grade text not null check (char_length(grade) between 1 and 40),
  employment_status text not null check (employment_status in ('Permanent', 'Contract')),
  service_years text not null check (service_years in ('Under 2 years', '2–5 years', '6–10 years', '11–15 years', 'More than 15 years')),
  responsibilities text not null check (char_length(responsibilities) between 5 and 3000),
  current_projects text not null default '',

  expertise text[] not null default '{}',
  tools_methods text not null default '',
  underused_skills text not null default '',

  research_interests text[] not null default '{}',
  emerging_areas text not null default '',
  research_gaps text not null default '',

  next_two_years text not null check (char_length(next_two_years) between 10 and 3000),
  project_ideas text not null default '',
  development_goals text not null default '',

  road_safety_contribution text not null check (char_length(road_safety_contribution) between 10 and 3000),
  national_problem text not null default '',

  collaboration text not null default '',
  assignment_readiness text not null default '',
  support_needed text not null default '',
  preserve_practices text not null default '',
  positive_change text not null default ''
);

create index if not exists people_capability_submissions_created_at_idx
  on public.people_capability_submissions (created_at desc);

create index if not exists people_capability_submissions_employment_idx
  on public.people_capability_submissions (employment_status);

alter table public.people_capability_submissions enable row level security;
revoke all on table public.people_capability_submissions from anon, authenticated;
grant all on table public.people_capability_submissions to service_role;

-- Minimal abuse-prevention metadata. The application stores only a salted hash
-- of the request IP, never the raw IP address. Old rows are pruned by the route.
create table if not exists public.people_submission_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null check (char_length(ip_hash) = 64),
  created_at timestamptz not null default now()
);

create index if not exists people_submission_attempts_ip_created_idx
  on public.people_submission_attempts (ip_hash, created_at desc);

create index if not exists people_submission_attempts_created_at_idx
  on public.people_submission_attempts (created_at);

alter table public.people_submission_attempts enable row level security;
revoke all on table public.people_submission_attempts from anon, authenticated;
grant all on table public.people_submission_attempts to service_role;
