create extension if not exists pgcrypto;

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  feature text not null,
  context_label text not null default '',
  status text not null,
  model text not null default '',
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  total_tokens integer not null default 0,
  input_characters integer not null default 0,
  output_characters integer not null default 0,
  error_message text not null default '',
  response_id text not null default '',
  created_at timestamptz not null default now(),
  constraint ai_usage_events_feature_allowed
    check (feature in ('service_chat', 'intake_assistant')),
  constraint ai_usage_events_status_allowed
    check (status in ('success', 'error', 'rate_limited', 'rejected')),
  constraint ai_usage_events_input_tokens_non_negative
    check (input_tokens >= 0),
  constraint ai_usage_events_output_tokens_non_negative
    check (output_tokens >= 0),
  constraint ai_usage_events_total_tokens_non_negative
    check (total_tokens >= 0),
  constraint ai_usage_events_input_characters_non_negative
    check (input_characters >= 0),
  constraint ai_usage_events_output_characters_non_negative
    check (output_characters >= 0)
);

create index if not exists ai_usage_events_created_at_idx
  on public.ai_usage_events (created_at desc);

create index if not exists ai_usage_events_feature_idx
  on public.ai_usage_events (feature);

create index if not exists ai_usage_events_status_idx
  on public.ai_usage_events (status);

alter table public.ai_usage_events enable row level security;

comment on table public.ai_usage_events is
  'Stores server-side AI request usage, token counts, and protection outcomes for the admin dashboard.';
