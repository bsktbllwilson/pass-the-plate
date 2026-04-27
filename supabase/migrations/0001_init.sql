-- Pass The Plate — initial schema
-- Tables, indexes, triggers, and RLS-enable. Policies come in a later migration.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles  (id mirrors auth.users.id; populated by handle_new_user trigger)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'buyer'
    check (role in ('buyer','seller','partner','admin')),
  preferred_language text not null default 'en'
    check (preferred_language in ('en','zh','ko','vi')),
  phone text,
  proof_of_funds_verified boolean not null default false,
  proof_of_funds_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft','pending_review','active','under_offer','sold','withdrawn')),
  slug text not null unique,
  title text not null,
  title_translations jsonb not null default '{}'::jsonb,
  description text,
  description_translations jsonb not null default '{}'::jsonb,
  industry text check (industry in ('restaurant','bakery','grocery','manufacturing','catering')),
  cuisine text check (cuisine in ('chinese','japanese','korean','vietnamese','thai','pan_asian')),
  city text,
  state text,
  neighborhood text,
  lat double precision,
  lng double precision,
  asking_price_cents bigint,
  annual_revenue_cents bigint,
  annual_profit_cents bigint,
  year_established int,
  staff_count int,
  square_footage int,
  includes_real_estate boolean not null default false,
  assets jsonb not null default '[]'::jsonb,
  cover_image_url text,
  gallery_urls text[] not null default '{}'::text[],
  chowbus_verified boolean not null default false,
  view_count int not null default 0,
  inquiry_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- listing_inquiries
-- ---------------------------------------------------------------------------
create table public.listing_inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  buyer_name text,
  buyer_email text,
  message text,
  status text not null default 'pending'
    check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  job_title text,
  company text,
  email text,
  phone text,
  website text,
  address text,
  specialty text check (specialty in ('sba_lender','immigration_attorney','bilingual_broker','accountant','insurance')),
  languages text[] not null default '{}'::text[],
  bio text,
  referral_source text,
  approved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- partner_inquiries
-- ---------------------------------------------------------------------------
create table public.partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text,
  sender_email text,
  subject text,
  message text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- playbook_posts
-- ---------------------------------------------------------------------------
create table public.playbook_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_translations jsonb not null default '{}'::jsonb,
  excerpt text,
  body_md text,
  body_md_translations jsonb not null default '{}'::jsonb,
  category text check (category in ('buying','selling','legal','visa_immigration','market_entry','operations','finance')),
  cover_image_url text,
  author_name text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  tier text not null default 'first_bite'
    check (tier in ('first_bite','chefs_table','full_menu')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  status text not null default 'active'
    check (status in ('active','past_due','canceled','trialing')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index listings_active_idx on public.listings (status) where status = 'active';
create index listings_cuisine_idx on public.listings (cuisine);
create index listings_industry_idx on public.listings (industry);
create index listings_view_count_idx on public.listings (view_count desc);
create index listings_search_idx on public.listings
  using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
create index partners_approved_featured_idx on public.partners (approved, featured);
create index playbook_posts_published_idx on public.playbook_posts (published, published_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

create trigger playbook_posts_set_updated_at
  before update on public.playbook_posts
  for each row execute function public.set_updated_at();

create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create profile on auth.users insert
-- security definer + locked search_path so the trigger can write to public
-- regardless of the inserting role's privileges.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Enable RLS (policies added in a later migration)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_inquiries enable row level security;
alter table public.partners enable row level security;
alter table public.partner_inquiries enable row level security;
alter table public.playbook_posts enable row level security;
alter table public.memberships enable row level security;
alter table public.newsletter_subscribers enable row level security;
