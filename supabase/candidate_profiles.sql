create extension if not exists pgcrypto;

create table if not exists public.candidate_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  email text not null unique,
  full_name text not null default '',
  contact_number varchar(12) not null default '',
  profile_headline text not null default '',
  profile_summary text not null default '',
  current_location text not null default '',
  home_address text not null default '',
  linkedin_url text not null default '',
  portfolio_url text not null default '',
  gender text not null default '',
  date_of_birth date,
  total_experience_years integer not null default 0,
  total_experience_months integer not null default 0,
  current_company text not null default '',
  current_position text not null default '',
  notice_period text not null default '',
  current_annual_ctc text not null default '',
  expected_annual_ctc text not null default '',
  preferred_job_titles text[] not null default '{}'::text[],
  preferred_locations text[] not null default '{}'::text[],
  preferred_employment_types text[] not null default '{}'::text[],
  preferred_work_modes text[] not null default '{}'::text[],
  key_skills text[] not null default '{}'::text[],
  languages jsonb not null default '[]'::jsonb,
  professional_qualifications jsonb not null default '[]'::jsonb,
  employment_history jsonb not null default '[]'::jsonb,
  education_history jsonb not null default '[]'::jsonb,
  it_skills jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  resume_url text not null default '',
  resume_original_name text not null default '',
  resume_extension text not null default '',
  resume_bytes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_profiles_email_not_blank
    check (btrim(email) <> ''),
  constraint candidate_profiles_full_name_not_blank
    check (btrim(full_name) <> ''),
  constraint candidate_profiles_contact_number_length
    check (char_length(contact_number) between 0 and 12),
  constraint candidate_profiles_total_experience_years_non_negative
    check (total_experience_years >= 0),
  constraint candidate_profiles_total_experience_months_valid
    check (total_experience_months between 0 and 11),
  constraint candidate_profiles_resume_bytes_non_negative
    check (resume_bytes >= 0)
);

create index if not exists candidate_profiles_user_id_idx
  on public.candidate_profiles (user_id);

create index if not exists candidate_profiles_email_idx
  on public.candidate_profiles (email);

alter table public.candidate_profiles enable row level security;

comment on table public.candidate_profiles is
  'Stores the complete candidate profile used by /candidate/profile.';
