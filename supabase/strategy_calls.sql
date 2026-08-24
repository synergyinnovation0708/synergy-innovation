create table if not exists public.strategy_calls (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_email text not null,
  contact_number text not null,
  subject text not null,
  preferred_date date not null,
  preferred_time_slot text not null,
  notes text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint strategy_calls_full_name_not_blank
    check (btrim(full_name) <> ''),
  constraint strategy_calls_business_email_not_blank
    check (btrim(business_email) <> ''),
  constraint strategy_calls_contact_number_length
    check (char_length(contact_number) between 10 and 12),
  constraint strategy_calls_subject_not_blank
    check (btrim(subject) <> ''),
  constraint strategy_calls_status_allowed
    check (status in ('pending', 'scheduled', 'completed', 'cancelled'))
);

create index if not exists strategy_calls_created_at_idx
  on public.strategy_calls (created_at desc);

create index if not exists strategy_calls_status_idx
  on public.strategy_calls (status);

alter table public.strategy_calls enable row level security;

-- Disable RLS constraints for inserts from public anonymous users, or setup policy
create policy "Allow anonymous inserts" on public.strategy_calls
  for insert with check (true);

create policy "Allow admin select" on public.strategy_calls
  for select using (true);

create policy "Allow admin update" on public.strategy_calls
  for update using (true);
