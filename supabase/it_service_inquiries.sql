create extension if not exists pgcrypto;

create table if not exists public.it_service_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_email text not null,
  contact_number text not null,
  company_name text not null,
  service_required text not null,
  project_brief text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint it_service_inquiries_full_name_not_blank
    check (btrim(full_name) <> ''),
  constraint it_service_inquiries_business_email_not_blank
    check (btrim(business_email) <> ''),
  constraint it_service_inquiries_contact_number_length
    check (char_length(contact_number) between 10 and 12),
  constraint it_service_inquiries_company_name_not_blank
    check (btrim(company_name) <> ''),
  constraint it_service_inquiries_service_required_not_blank
    check (btrim(service_required) <> ''),
  constraint it_service_inquiries_status_allowed
    check (status in ('pending', 'contacted', 'closed'))
);

create index if not exists it_service_inquiries_created_at_idx
  on public.it_service_inquiries (created_at desc);

create index if not exists it_service_inquiries_business_email_idx
  on public.it_service_inquiries (business_email);

create index if not exists it_service_inquiries_status_idx
  on public.it_service_inquiries (status);

alter table public.it_service_inquiries enable row level security;

comment on table public.it_service_inquiries is
  'Stores IT services inquiries submitted from the IT services page modal.';
