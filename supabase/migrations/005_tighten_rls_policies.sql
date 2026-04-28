-- Pass The Plate — migration 005: Tighten RLS policies across all 8 tables
--
-- Implements the policy spec in audit/03-rls-spec.md. This migration is
-- idempotent and safe to apply to a fresh database. It does NOT need to be
-- applied to production via supabase CLI — production already has RLS via
-- the Supabase Dashboard. See audit/09-rls-apply-instructions.md for the
-- manual paste-into-Dashboard procedure.
--
-- Tables covered:
--   listings, partners, playbook_posts, profiles,
--   listing_inquiries, partner_inquiries, memberships, newsletter_subscribers
--
-- Policy naming convention: <table>_<operation>_<scope>
--
-- Key invariants (see audit/03-rls-spec.md "Risk areas"):
--   1. profiles is never readable by anon
--   2. memberships writes are service-role only (no authed INSERT/UPDATE)
--   3. inquiry inserts cannot spoof buyer_id / sender_id
--   4. listings.view_count bumps go through bumpListingViewCount() server
--      action (service role), not via anon UPDATE
--   5. profiles role column cannot be self-promoted
--   6. partners.referral_source is hidden from anon via column-level revoke

-- ---------------------------------------------------------------------------
-- 0. Helper: is_admin()
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 1. listings
-- ---------------------------------------------------------------------------

alter table public.listings enable row level security;

drop policy if exists listings_select_active_public on public.listings;
drop policy if exists listings_select_own_drafts on public.listings;
drop policy if exists listings_insert_own on public.listings;
drop policy if exists listings_update_own on public.listings;
drop policy if exists listings_delete_own on public.listings;
drop policy if exists listings_admin_all on public.listings;
-- Drop legacy/dashboard-applied policy names defensively.
drop policy if exists listings_select_anon on public.listings;
drop policy if exists listings_public_read on public.listings;
drop policy if exists "Public listings are viewable by everyone" on public.listings;

create policy listings_select_active_public
  on public.listings for select
  to anon, authenticated
  using (status = 'active');

create policy listings_select_own_drafts
  on public.listings for select
  to authenticated
  using (seller_id = auth.uid());

create policy listings_insert_own
  on public.listings for insert
  to authenticated
  with check (seller_id = auth.uid());

create policy listings_update_own
  on public.listings for update
  to authenticated
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

create policy listings_delete_own
  on public.listings for delete
  to authenticated
  using (seller_id = auth.uid());

create policy listings_admin_all
  on public.listings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. partners
-- ---------------------------------------------------------------------------

alter table public.partners enable row level security;

drop policy if exists partners_select_approved_public on public.partners;
drop policy if exists partners_select_own on public.partners;
drop policy if exists partners_insert_own on public.partners;
drop policy if exists partners_update_own on public.partners;
drop policy if exists partners_admin_all on public.partners;
drop policy if exists partners_select_anon on public.partners;
drop policy if exists partners_public_read on public.partners;
drop policy if exists "Public partners are viewable by everyone" on public.partners;

create policy partners_select_approved_public
  on public.partners for select
  to anon, authenticated
  using (approved = true);

create policy partners_select_own
  on public.partners for select
  to authenticated
  using (profile_id = auth.uid());

create policy partners_insert_own
  on public.partners for insert
  to authenticated
  with check (profile_id = auth.uid() and approved = false);

create policy partners_update_own
  on public.partners for update
  to authenticated
  using (profile_id = auth.uid())
  with check (
    profile_id = auth.uid()
    and approved = (select p.approved from public.partners p where p.id = partners.id)
  );

create policy partners_admin_all
  on public.partners for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- referral_source is an internal field. Strip it from the anon-visible row.
revoke select (referral_source) on public.partners from anon;

-- ---------------------------------------------------------------------------
-- 3. playbook_posts
-- ---------------------------------------------------------------------------

alter table public.playbook_posts enable row level security;

drop policy if exists playbook_posts_select_published_public on public.playbook_posts;
drop policy if exists playbook_posts_admin_all on public.playbook_posts;
drop policy if exists playbook_posts_select_anon on public.playbook_posts;
drop policy if exists playbook_posts_public_read on public.playbook_posts;
drop policy if exists "Public playbook_posts are viewable by everyone" on public.playbook_posts;

create policy playbook_posts_select_published_public
  on public.playbook_posts for select
  to anon, authenticated
  using (published = true);

create policy playbook_posts_admin_all
  on public.playbook_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. profiles  (NO anon policies)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_select_all on public.profiles;
drop policy if exists profiles_admin_update_all on public.profiles;
drop policy if exists profiles_select_anon on public.profiles;
drop policy if exists profiles_public_read on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;

create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

create policy profiles_admin_select_all
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy profiles_admin_update_all
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. listing_inquiries
-- ---------------------------------------------------------------------------

alter table public.listing_inquiries enable row level security;

drop policy if exists listing_inquiries_insert_anon on public.listing_inquiries;
drop policy if exists listing_inquiries_insert_authed on public.listing_inquiries;
drop policy if exists listing_inquiries_select_buyer on public.listing_inquiries;
drop policy if exists listing_inquiries_select_seller on public.listing_inquiries;
drop policy if exists listing_inquiries_update_seller on public.listing_inquiries;
drop policy if exists listing_inquiries_admin_all on public.listing_inquiries;
-- Drop legacy/draft policy names from migrations 002 and 004.
drop policy if exists inquiries_insert_anyone on public.listing_inquiries;
drop policy if exists inquiries_insert_anon on public.listing_inquiries;
drop policy if exists inquiries_insert_authenticated on public.listing_inquiries;
drop policy if exists inquiries_select_buyer on public.listing_inquiries;
drop policy if exists inquiries_select_seller on public.listing_inquiries;

create policy listing_inquiries_insert_anon
  on public.listing_inquiries for insert
  to anon
  with check (
    buyer_id is null
    and exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'active'
    )
  );

create policy listing_inquiries_insert_authed
  on public.listing_inquiries for insert
  to authenticated
  with check (
    (buyer_id is null or buyer_id = auth.uid())
    and exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'active'
    )
  );

create policy listing_inquiries_select_buyer
  on public.listing_inquiries for select
  to authenticated
  using (buyer_id = auth.uid());

create policy listing_inquiries_select_seller
  on public.listing_inquiries for select
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_inquiries.listing_id
        and l.seller_id = auth.uid()
    )
  );

create policy listing_inquiries_update_seller
  on public.listing_inquiries for update
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_inquiries.listing_id
        and l.seller_id = auth.uid()
    )
  )
  with check (status in ('pending', 'accepted', 'rejected'));

create policy listing_inquiries_admin_all
  on public.listing_inquiries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. partner_inquiries
-- ---------------------------------------------------------------------------

alter table public.partner_inquiries enable row level security;

drop policy if exists partner_inquiries_insert_anon on public.partner_inquiries;
drop policy if exists partner_inquiries_insert_authed on public.partner_inquiries;
drop policy if exists partner_inquiries_select_sender on public.partner_inquiries;
drop policy if exists partner_inquiries_select_partner on public.partner_inquiries;
drop policy if exists partner_inquiries_admin_all on public.partner_inquiries;
drop policy if exists partner_inquiries_insert_anyone on public.partner_inquiries;

create policy partner_inquiries_insert_anon
  on public.partner_inquiries for insert
  to anon
  with check (
    sender_id is null
    and exists (
      select 1 from public.partners p
      where p.id = partner_id and p.approved = true
    )
  );

create policy partner_inquiries_insert_authed
  on public.partner_inquiries for insert
  to authenticated
  with check (
    (sender_id is null or sender_id = auth.uid())
    and exists (
      select 1 from public.partners p
      where p.id = partner_id and p.approved = true
    )
  );

create policy partner_inquiries_select_sender
  on public.partner_inquiries for select
  to authenticated
  using (sender_id = auth.uid());

create policy partner_inquiries_select_partner
  on public.partner_inquiries for select
  to authenticated
  using (
    exists (
      select 1 from public.partners p
      where p.id = partner_inquiries.partner_id
        and p.profile_id = auth.uid()
    )
  );

create policy partner_inquiries_admin_all
  on public.partner_inquiries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. memberships  (NO authenticated INSERT/UPDATE/DELETE — service role only)
-- ---------------------------------------------------------------------------

alter table public.memberships enable row level security;

drop policy if exists memberships_select_own on public.memberships;
drop policy if exists memberships_admin_select on public.memberships;
drop policy if exists memberships_insert_own on public.memberships;
drop policy if exists memberships_update_own on public.memberships;

create policy memberships_select_own
  on public.memberships for select
  to authenticated
  using (profile_id = auth.uid());

create policy memberships_admin_select
  on public.memberships for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 8. newsletter_subscribers
-- ---------------------------------------------------------------------------

alter table public.newsletter_subscribers enable row level security;

drop policy if exists newsletter_insert_public on public.newsletter_subscribers;
drop policy if exists newsletter_admin_select on public.newsletter_subscribers;
drop policy if exists newsletter_insert_anyone on public.newsletter_subscribers;

create policy newsletter_insert_public
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (email is not null);

create policy newsletter_admin_select
  on public.newsletter_subscribers for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- VERIFICATION (run after applying):
--
-- set role anon;
-- select count(*) from listings where status = 'active';   -- should return real count
-- select count(*) from listings where status = 'draft';    -- should return 0
-- select count(*) from profiles;                            -- should error or return 0
-- select count(*) from memberships;                         -- should return 0 from anon
-- select count(*) from newsletter_subscribers;              -- should return 0 from anon
-- select referral_source from partners limit 1;             -- should error: permission denied
-- reset role;
-- ---------------------------------------------------------------------------
