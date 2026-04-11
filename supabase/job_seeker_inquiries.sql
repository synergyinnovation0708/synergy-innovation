create extension if not exists pgcrypto;

create table if not exists public.job_seeker_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  contact_number varchar(12) not null,
  current_position text not null,
  current_company text not null,
  resume_url text not null,
  resume_public_id text not null,
  resume_original_name text not null,
  resume_extension text not null,
  resume_content_type text not null,
  resume_bytes integer not null,
  created_at timestamptz not null default now(),
  constraint job_seeker_inquiries_full_name_not_blank
    check (btrim(full_name) <> ''),
  constraint job_seeker_inquiries_email_not_blank
    check (btrim(email) <> ''),
  constraint job_seeker_inquiries_contact_number_length
    check (char_length(contact_number) between 10 and 12),
  constraint job_seeker_inquiries_current_position_not_blank
    check (btrim(current_position) <> ''),
  constraint job_seeker_inquiries_current_company_not_blank
    check (btrim(current_company) <> ''),
  constraint job_seeker_inquiries_resume_url_not_blank
    check (btrim(resume_url) <> ''),
  constraint job_seeker_inquiries_resume_public_id_not_blank
    check (btrim(resume_public_id) <> ''),
  constraint job_seeker_inquiries_resume_original_name_not_blank
    check (btrim(resume_original_name) <> ''),
  constraint job_seeker_inquiries_resume_extension_allowed
    check (resume_extension in ('pdf', 'doc', 'docx')),
  constraint job_seeker_inquiries_resume_bytes_positive
    check (resume_bytes > 0)
);

create index if not exists job_seeker_inquiries_created_at_idx
  on public.job_seeker_inquiries (created_at desc);

create index if not exists job_seeker_inquiries_email_idx
  on public.job_seeker_inquiries (email);

alter table public.job_seeker_inquiries enable row level security;

comment on table public.job_seeker_inquiries is
  'Stores job seeker inquiries submitted from the homepage apply form.';
