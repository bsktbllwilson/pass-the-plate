-- Pass The Plate — migration 008
-- Two related changes that together unlock the seller listing form:
--
-- 1. Apply the audit's recommended RLS policies to public.listings.
--    The table has been wide-open since schema.sql; until now nothing
--    wrote to it from anon code, so it didn't matter. With /sell/new
--    landing, sellers need to INSERT (drafts only) and SELECT (their
--    own drafts) without leaking other sellers' drafts to anon.
--
-- 2. Configure the listing-images Storage bucket policies. The bucket
--    itself has to be created via the Dashboard (Storage → New bucket
--    → name `listing-images`, mark Public). This migration wires up
--    the storage.objects RLS so authenticated sellers can upload
--    inside their own auth.uid() prefix and nobody else can.
--
-- Idempotent: drops every policy this migration would create up
-- front so re-runs don't trip on 42710.

-- ─── Part 1: listings RLS ──────────────────────────────────────────

alter table public.listings enable row level security;

drop policy if exists listings_select_anon on public.listings;
drop policy if exists listings_select_authenticated on public.listings;
drop policy if exists listings_insert_authenticated on public.listings;
drop policy if exists listings_update_owner on public.listings;
drop policy if exists listings_delete_owner on public.listings;

-- Anon reads only published listings.
create policy listings_select_anon
  on public.listings for select to anon
  using (status = 'active');

-- Authenticated reads published listings AND their own drafts/archived.
create policy listings_select_authenticated
  on public.listings for select to authenticated
  using (status = 'active' or seller_id = auth.uid());

-- Sellers can only create drafts attributed to themselves. Promotion
-- to status='active' goes through the service role from a future
-- admin queue.
create policy listings_insert_authenticated
  on public.listings for insert to authenticated
  with check (seller_id = auth.uid() and status = 'draft');

-- Sellers can edit their own listing while it is a draft or archived;
-- they cannot change seller_id and cannot self-promote to active /
-- sold (the with check pins status to draft|archived).
create policy listings_update_owner
  on public.listings for update to authenticated
  using (seller_id = auth.uid())
  with check (
    seller_id = auth.uid()
    and status in ('draft', 'archived')
  );

-- Sellers can delete their own drafts. Once active/sold the row stays
-- (admins archive instead).
create policy listings_delete_owner
  on public.listings for delete to authenticated
  using (seller_id = auth.uid() and status = 'draft');

-- ─── Part 2: storage.objects RLS for the listing-images bucket ────
--
-- The bucket itself must be created via Dashboard before applying:
--   Storage → New bucket → name: listing-images, public: yes,
--   file size limit: 10485760 (10 MB),
--   allowed mime types: image/jpeg, image/png, image/webp.

drop policy if exists listing_images_insert_owner on storage.objects;
drop policy if exists listing_images_update_owner on storage.objects;
drop policy if exists listing_images_delete_owner on storage.objects;
drop policy if exists listing_images_select_public on storage.objects;

-- Authenticated users may INSERT only into their own auth.uid() prefix.
-- We rely on the path matching pattern `{uid}/...` — the form code
-- only ever produces paths of that shape, and this policy enforces it
-- at the DB layer regardless.
create policy listing_images_insert_owner
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Same constraint for UPDATE (replace cover, etc.) and DELETE.
create policy listing_images_update_owner
  on storage.objects for update to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy listing_images_delete_owner
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Anyone can read images. The bucket is marked public so URLs work
-- without auth; this SELECT policy backs the API path.
create policy listing_images_select_public
  on storage.objects for select to public
  using (bucket_id = 'listing-images');
