-- Pass The Plate — Add profiles, inquiries, memberships, newsletter
-- Applied to production via Supabase Dashboard SQL Editor on 2026-04-27.
-- This file captures that migration so the schema history is reproducible.
--
-- Adds:
--   - profiles (linked to auth.users)
--   - listing_inquiries
--   - partner_inquiries
--   - memberships
--   - newsletter_subscribers
--   - profile_id and updated_at columns on partners
--   - listings.seller_id foreign key (deferred until profiles existed)
--   - auto-profile-creation trigger on auth.users
--   - updated_at triggers
--   - RLS policies on all 5 new tables

create extension if not exists "pgcrypto";

-- Shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text check (role in ('buyer','seller','partner','admin')) default 'buyer',
  preferred_language text check (preferred_language in ('en','zh','ko','vi')) default 'en',
  proof_of_funds_verified boolean default false,
  proof_of_funds_verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any existing auth users
insert into public.profiles (id, email, full_name)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', null)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- Add missing columns to partners
alter table public.partners
  add column if not exists profile_id uuid references public.profiles(id) on delete set null;

alter table public.partners
  add column if not exists updated_at timestamptz default now();

drop trigger if exists partners_set_updated_at on public.partners;
create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

-- listings.seller_id FK (only if seller_id column exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = 'seller_id'
  ) and not exists (
    select 1 from pg_constraint where conname = 'listings_seller_id_fkey'
  ) then
    alter table public.listings
      add constraint listings_seller_id_fkey
      foreign key (seller_id) references public.profiles(id) on delete cascade;
  end if;
end $$;

-- listing_inquiries
create table if not exists public.listing_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  listing_id uuid references public.listings(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  buyer_name text,
  buyer_email text,
  message text,
  status text check (status in ('pending','accepted','rejected')) default 'pending'
);

create index if not exists listing_inquiries_listing_idx on public.listing_inquiries (listing_id);
create index if not exists listing_inquiries_buyer_idx on public.listing_inquiries (buyer_id);

-- partner_inquiries
create table if not exists public.partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  partner_id uuid references public.partners(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text,
  sender_email text,
  subject text,
  message text
);

create index if not exists partner_inquiries_partner_idx on public.partner_inquiries (partner_id);

-- memberships
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  profile_id uuid references public.profiles(id) on delete cascade unique,
  tier text check (tier in ('first_bite','chefs_table','full_menu')) default 'first_bite',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  status text check (status in ('active','past_due','canceled','trialing')) default 'active'
);

drop trigger if exists memberships_set_updated_at on public.memberships;
create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

-- newsletter_subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique not null,
  source text
);

-- RLS — enable on all 5 new tables
alter table public.profiles enable row level security;
alter table public.listing_inquiries enable row level security;
alter table public.partner_inquiries enable row level security;
alter table public.memberships enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- profiles policies
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- listing_inquiries policies
drop policy if exists inquiries_insert_anyone on public.listing_inquiries;
create policy inquiries_insert_anyone
  on public.listing_inquiries for insert to public
  with check (true);

drop policy if exists inquiries_select_buyer on public.listing_inquiries;
create policy inquiries_select_buyer
  on public.listing_inquiries for select to authenticated
  using (auth.uid() = buyer_id);

drop policy if exists inquiries_select_seller on public.listing_inquiries;
create policy inquiries_select_seller
  on public.listing_inquiries for select to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_inquiries.listing_id
      and l.seller_id = auth.uid()
    )
  );

-- partner_inquiries policies
drop policy if exists partner_inquiries_insert_anyone on public.partner_inquiries;
create policy partner_inquiries_insert_anyone
  on public.partner_inquiries for insert to public
  with check (true);

drop policy if exists partner_inquiries_select_partner on public.partner_inquiries;
create policy partner_inquiries_select_partner
  on public.partner_inquiries for select to authenticated
  using (
    exists (
      select 1 from public.partners p
      where p.id = partner_inquiries.partner_id
      and p.profile_id = auth.uid()
    )
  );

-- memberships policies
drop policy if exists memberships_select_own on public.memberships;
create policy memberships_select_own
  on public.memberships for select to authenticated
  using (auth.uid() = profile_id);

drop policy if exists memberships_insert_own on public.memberships;
create policy memberships_insert_own
  on public.memberships for insert to authenticated
  with check (auth.uid() = profile_id);

drop policy if exists memberships_update_own on public.memberships;
create policy memberships_update_own
  on public.memberships for update to authenticated
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- newsletter_subscribers policies
drop policy if exists newsletter_insert_anyone on public.newsletter_subscribers;
create policy newsletter_insert_anyone
  on public.newsletter_subscribers for insert to public
  with check (true);
