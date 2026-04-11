create extension if not exists pgcrypto;

create table if not exists public.job_listings (
  id uuid primary key default gen_random_uuid(),
  job_title text not null,
  company_name text not null,
  department text not null,
  employment_type text not null,
  work_mode text not null,
  location text not null,
  experience_min_years integer not null,
  experience_max_years integer not null,
  experience_range text not null,
  openings integer not null,
  salary_min_lpa integer not null,
  salary_max_lpa integer not null,
  annual_ctc text not null,
  application_deadline date not null,
  status text not null default 'Draft',
  required_skills text not null,
  job_summary_html text not null,
  responsibilities_html text not null,
  applicants_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint job_listings_job_title_not_blank
    check (btrim(job_title) <> ''),
  constraint job_listings_company_name_not_blank
    check (btrim(company_name) <> ''),
  constraint job_listings_department_not_blank
    check (btrim(department) <> ''),
  constraint job_listings_employment_type_allowed
    check (
      employment_type in (
        'Full Time',
        'Part Time',
        'Contract',
        'Contract-to-Hire',
        'Internship'
      )
    ),
  constraint job_listings_work_mode_allowed
    check (work_mode in ('On-site', 'Hybrid', 'Remote')),
  constraint job_listings_location_not_blank
    check (btrim(location) <> ''),
  constraint job_listings_experience_min_years_non_negative
    check (experience_min_years >= 0),
  constraint job_listings_experience_max_years_non_negative
    check (experience_max_years >= 0),
  constraint job_listings_experience_years_order
    check (experience_max_years >= experience_min_years),
  constraint job_listings_experience_range_not_blank
    check (btrim(experience_range) <> ''),
  constraint job_listings_openings_positive
    check (openings > 0),
  constraint job_listings_salary_min_lpa_non_negative
    check (salary_min_lpa >= 0),
  constraint job_listings_salary_max_lpa_non_negative
    check (salary_max_lpa >= 0),
  constraint job_listings_salary_lpa_order
    check (salary_max_lpa >= salary_min_lpa),
  constraint job_listings_annual_ctc_not_blank
    check (btrim(annual_ctc) <> ''),
  constraint job_listings_status_allowed
    check (
      status in (
        'Active',
        'Draft',
        'Urgent Requirement',
        'Upcoming Requirement',
        'Archived'
      )
    ),
  constraint job_listings_required_skills_not_blank
    check (btrim(required_skills) <> ''),
  constraint job_listings_job_summary_html_not_blank
    check (btrim(job_summary_html) <> ''),
  constraint job_listings_responsibilities_html_not_blank
    check (btrim(responsibilities_html) <> ''),
  constraint job_listings_applicants_count_non_negative
    check (applicants_count >= 0)
);

alter table public.job_listings
  add column if not exists company_name text;

alter table public.job_listings
  add column if not exists experience_min_years integer;

alter table public.job_listings
  add column if not exists experience_max_years integer;

alter table public.job_listings
  add column if not exists salary_min_lpa integer;

alter table public.job_listings
  add column if not exists salary_max_lpa integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_listings_company_name_not_blank'
  ) then
    alter table public.job_listings
      add constraint job_listings_company_name_not_blank
      check (company_name is null or btrim(company_name) <> '');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_listings_experience_min_years_non_negative'
  ) then
    alter table public.job_listings
      add constraint job_listings_experience_min_years_non_negative
      check (experience_min_years is null or experience_min_years >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_listings_experience_max_years_non_negative'
  ) then
    alter table public.job_listings
      add constraint job_listings_experience_max_years_non_negative
      check (experience_max_years is null or experience_max_years >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_listings_experience_years_order'
  ) then
    alter table public.job_listings
      add constraint job_listings_experience_years_order
      check (
        experience_min_years is null or
        experience_max_years is null or
        experience_max_years >= experience_min_years
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_listings_salary_min_lpa_non_negative'
  ) then
    alter table public.job_listings
      add constraint job_listings_salary_min_lpa_non_negative
      check (salary_min_lpa is null or salary_min_lpa >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_listings_salary_max_lpa_non_negative'
  ) then
    alter table public.job_listings
      add constraint job_listings_salary_max_lpa_non_negative
      check (salary_max_lpa is null or salary_max_lpa >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'job_listings_salary_lpa_order'
  ) then
    alter table public.job_listings
      add constraint job_listings_salary_lpa_order
      check (
        salary_min_lpa is null or
        salary_max_lpa is null or
        salary_max_lpa >= salary_min_lpa
      );
  end if;
end $$;

create index if not exists job_listings_created_at_idx
  on public.job_listings (created_at desc);

create index if not exists job_listings_status_idx
  on public.job_listings (status);

create index if not exists job_listings_department_idx
  on public.job_listings (department);

alter table public.job_listings enable row level security;

comment on table public.job_listings is
  'Stores admin-managed job listings created from the dashboard modal.';
