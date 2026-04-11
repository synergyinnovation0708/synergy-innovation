create extension if not exists pgcrypto;

create table if not exists public.employer_inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  work_email text not null,
  contact_number varchar(12) not null,
  hiring_requirement text not null,
  hiring_type text not null,
  hiring_locations text[] not null default '{}'::text[],
  number_of_positions integer not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint employer_inquiries_company_name_not_blank
    check (btrim(company_name) <> ''),
  constraint employer_inquiries_contact_name_not_blank
    check (btrim(contact_name) <> ''),
  constraint employer_inquiries_work_email_not_blank
    check (btrim(work_email) <> ''),
  constraint employer_inquiries_contact_number_length
    check (char_length(contact_number) between 10 and 12),
  constraint employer_inquiries_hiring_requirement_not_blank
    check (btrim(hiring_requirement) <> ''),
  constraint employer_inquiries_hiring_type_allowed
    check (
      hiring_type in (
        'Permanent',
        'Contract',
        'Internship',
        'Freelance',
        'Part-time'
      )
    ),
  constraint employer_inquiries_hiring_locations_not_empty
    check (coalesce(array_length(hiring_locations, 1), 0) > 0),
  constraint employer_inquiries_status_allowed
    check (
      status in (
        'pending',
        'in_progress',
        'onboarded',
        'cancelled'
      )
    ),
  constraint employer_inquiries_number_of_positions_positive
    check (number_of_positions > 0)
);

alter table public.employer_inquiries
  add column if not exists status text;

update public.employer_inquiries
set status = 'pending'
where status is null or btrim(status) = '';

alter table public.employer_inquiries
  alter column status set default 'pending';

alter table public.employer_inquiries
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'employer_inquiries_status_allowed'
  ) then
    alter table public.employer_inquiries
      add constraint employer_inquiries_status_allowed
      check (
        status in (
          'pending',
          'in_progress',
          'onboarded',
          'cancelled'
        )
      );
  end if;
end $$;

create index if not exists employer_inquiries_created_at_idx
  on public.employer_inquiries (created_at desc);

create index if not exists employer_inquiries_work_email_idx
  on public.employer_inquiries (work_email);

create index if not exists employer_inquiries_status_idx
  on public.employer_inquiries (status);

alter table public.employer_inquiries enable row level security;

comment on table public.employer_inquiries is
  'Stores employer hiring requests submitted from the homepage apply form.';
