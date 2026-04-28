-- Pass The Plate — Contact form storage
-- Generic /contact page submissions (topic + message). Anon may INSERT.
-- Reads happen via service role from an admin / inbox UI when one exists.

create extension if not exists "pgcrypto";

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 120),
  email text not null check (length(email) between 1 and 254),
  topic text check (topic is null or length(topic) between 1 and 80),
  message text not null check (length(message) between 1 and 4000),
  status text not null check (status in ('new','replied','archived')) default 'new',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_created_at_idx
  on public.contact_messages (status, created_at desc);

alter table public.contact_messages enable row level security;

-- Anon (and authenticated) may submit. The CHECK constraints above bound
-- field lengths; no further filtering needed at the policy layer.
drop policy if exists contact_messages_insert_anyone on public.contact_messages;
create policy contact_messages_insert_anyone
  on public.contact_messages for insert to public
  with check (true);

-- No SELECT/UPDATE/DELETE for anon or authenticated. Reads + status changes
-- run through the service role from a future admin inbox UI.
