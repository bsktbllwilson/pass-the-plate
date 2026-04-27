-- Pass The Plate — schema
-- Run this once in Supabase (SQL Editor) before seed.sql.
-- Matches the columns used by supabase/seed.sql.

create extension if not exists "pgcrypto";

create table if not exists listings (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  title                 text not null,
  description           text not null,
  industry              text not null,
  cuisine               text not null,
  location              text not null,
  asking_price_cents    bigint not null,
  annual_revenue_cents  bigint not null,
  annual_profit_cents   bigint,
  year_established      integer,
  staff_count           integer,
  square_footage        integer,
  cover_image_url       text,
  gallery_urls          text[] not null default '{}',
  assets                jsonb not null default '[]'::jsonb,
  view_count            integer not null default 0,
  status                text not null default 'draft',
  seller_id             uuid references auth.users(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists listings_status_idx       on listings (status);
create index if not exists listings_industry_idx     on listings (industry);
create index if not exists listings_cuisine_idx      on listings (cuisine);
create index if not exists listings_view_count_idx   on listings (view_count desc);

create table if not exists partners (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  job_title       text,
  company         text,
  email           text not null,
  phone           text,
  website         text,
  address         text,
  languages       text[] not null default '{}',
  bio             text,
  specialty       text not null,
  approved        boolean not null default false,
  featured        boolean not null default false,
  referral_source text,
  created_at      timestamptz not null default now()
);

create index if not exists partners_specialty_idx on partners (specialty);
create index if not exists partners_approved_idx  on partners (approved);
create index if not exists partners_featured_idx  on partners (featured);

create table if not exists playbook_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  body_md         text not null,
  category        text not null,
  cover_image_url text,
  author_name     text not null,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists playbook_posts_category_idx     on playbook_posts (category);
create index if not exists playbook_posts_published_idx    on playbook_posts (published, published_at desc);
