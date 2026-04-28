-- Pass The Plate — Partner application intake (/partners/apply)
-- People applying to JOIN the partner directory (separate from
-- partner_inquiries, which is for messaging an existing partner).
--
-- Reads + status changes happen via service role from the future admin
-- review queue; anon may INSERT only.

create extension if not exists "pgcrypto";

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 120),
  email text not null check (length(email) between 1 and 254),
  phone text check (phone is null or length(phone) between 1 and 30),
  company text not null check (length(company) between 1 and 120),
  specialty text not null check (specialty in (
    'sba_lender',
    'immigration_attorney',
    'bilingual_broker',
    'cpa',
    'business_attorney',
    'business_broker',
    'other'
  )),
  website text check (website is null or length(website) between 1 and 254),
  pitch text not null check (length(pitch) between 1 and 4000),
  status text not null check (status in ('new','approved','rejected')) default 'new',
  created_at timestamptz not null default now()
);

create index if not exists partner_applications_created_at_idx
  on public.partner_applications (created_at desc);

create index if not exists partner_applications_status_created_at_idx
  on public.partner_applications (status, created_at desc);

alter table public.partner_applications enable row level security;

drop policy if exists partner_applications_insert_anyone on public.partner_applications;
create policy partner_applications_insert_anyone
  on public.partner_applications for insert to public
  with check (true);

-- No SELECT/UPDATE/DELETE for anon or authenticated. Reads + reviewer
-- workflow run through the service role from a future admin UI.
