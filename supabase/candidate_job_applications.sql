create extension if not exists pgcrypto;

create table if not exists public.candidate_job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_listings (id) on delete cascade,
  candidate_user_id uuid not null,
  candidate_email text not null,
  candidate_full_name text not null,
  current_company text not null default '',
  current_position text not null default '',
  department text not null default '',
  job_title text not null,
  application_status text not null default 'applied',
  resume_url text not null default '',
  resume_original_name text not null default '',
  resume_extension text not null default '',
  resume_bytes integer not null default 0,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_job_applications_candidate_email_not_blank
    check (btrim(candidate_email) <> ''),
  constraint candidate_job_applications_candidate_full_name_not_blank
    check (btrim(candidate_full_name) <> ''),
  constraint candidate_job_applications_job_title_not_blank
    check (btrim(job_title) <> ''),
  constraint candidate_job_applications_resume_bytes_non_negative
    check (resume_bytes >= 0),
  constraint candidate_job_applications_status_allowed
    check (application_status in ('applied', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  constraint candidate_job_applications_unique_candidate_job
    unique (job_id, candidate_user_id)
);

create index if not exists candidate_job_applications_job_id_idx
  on public.candidate_job_applications (job_id);

create index if not exists candidate_job_applications_candidate_user_id_idx
  on public.candidate_job_applications (candidate_user_id);

create index if not exists candidate_job_applications_applied_at_idx
  on public.candidate_job_applications (applied_at desc);

alter table public.candidate_job_applications enable row level security;

comment on table public.candidate_job_applications is
  'Stores candidate applications submitted from the public jobs page.';
