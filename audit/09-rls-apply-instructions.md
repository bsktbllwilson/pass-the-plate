# RLS Apply Instructions — Pass The Plate

Production already has RLS policies applied via the Supabase Dashboard. The
`supabase/migrations/005_tighten_rls_policies.sql` migration file is for
fresh-database recovery only (e.g. spinning up a staging environment from a
clean schema).

To bring **production** in line with the new spec
(`audit/03-rls-spec.md`), paste each of the three SQL blocks below into the
Supabase Dashboard SQL Editor in order. Then run the verification block at
the bottom to confirm.

> The blocks are split by intent (helper, drop, recreate) so you can pause
> between them. They are idempotent — safe to re-run.

---

## Block 1 — Add the `is_admin()` helper

Safe to run any time; updates the function in place.

```sql
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
```

---

## Block 2 — Drop all existing policies on the 8 tables

Wipes the slate clean so Block 3 can recreate everything to spec. Includes
defensive drops for legacy / dashboard-applied policy names.

```sql
-- listings
drop policy if exists listings_select_active_public on public.listings;
drop policy if exists listings_select_own_drafts on public.listings;
drop policy if exists listings_insert_own on public.listings;
drop policy if exists listings_update_own on public.listings;
drop policy if exists listings_delete_own on public.listings;
drop policy if exists listings_admin_all on public.listings;
drop policy if exists listings_select_anon on public.listings;
drop policy if exists listings_public_read on public.listings;
drop policy if exists "Public listings are viewable by everyone" on public.listings;

-- partners
drop policy if exists partners_select_approved_public on public.partners;
drop policy if exists partners_select_own on public.partners;
drop policy if exists partners_insert_own on public.partners;
drop policy if exists partners_update_own on public.partners;
drop policy if exists partners_admin_all on public.partners;
drop policy if exists partners_select_anon on public.partners;
drop policy if exists partners_public_read on public.partners;
drop policy if exists "Public partners are viewable by everyone" on public.partners;

-- playbook_posts
drop policy if exists playbook_posts_select_published_public on public.playbook_posts;
drop policy if exists playbook_posts_admin_all on public.playbook_posts;
drop policy if exists playbook_posts_select_anon on public.playbook_posts;
drop policy if exists playbook_posts_public_read on public.playbook_posts;
drop policy if exists "Public playbook_posts are viewable by everyone" on public.playbook_posts;

-- profiles
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_select_all on public.profiles;
drop policy if exists profiles_admin_update_all on public.profiles;
drop policy if exists profiles_select_anon on public.profiles;
drop policy if exists profiles_public_read on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;

-- listing_inquiries
drop policy if exists listing_inquiries_insert_anon on public.listing_inquiries;
drop policy if exists listing_inquiries_insert_authed on public.listing_inquiries;
drop policy if exists listing_inquiries_select_buyer on public.listing_inquiries;
drop policy if exists listing_inquiries_select_seller on public.listing_inquiries;
drop policy if exists listing_inquiries_update_seller on public.listing_inquiries;
drop policy if exists listing_inquiries_admin_all on public.listing_inquiries;
drop policy if exists inquiries_insert_anyone on public.listing_inquiries;
drop policy if exists inquiries_insert_anon on public.listing_inquiries;
drop policy if exists inquiries_insert_authenticated on public.listing_inquiries;
drop policy if exists inquiries_select_buyer on public.listing_inquiries;
drop policy if exists inquiries_select_seller on public.listing_inquiries;

-- partner_inquiries
drop policy if exists partner_inquiries_insert_anon on public.partner_inquiries;
drop policy if exists partner_inquiries_insert_authed on public.partner_inquiries;
drop policy if exists partner_inquiries_select_sender on public.partner_inquiries;
drop policy if exists partner_inquiries_select_partner on public.partner_inquiries;
drop policy if exists partner_inquiries_admin_all on public.partner_inquiries;
drop policy if exists partner_inquiries_insert_anyone on public.partner_inquiries;

-- memberships
drop policy if exists memberships_select_own on public.memberships;
drop policy if exists memberships_admin_select on public.memberships;
drop policy if exists memberships_insert_own on public.memberships;
drop policy if exists memberships_update_own on public.memberships;

-- newsletter_subscribers
drop policy if exists newsletter_insert_public on public.newsletter_subscribers;
drop policy if exists newsletter_admin_select on public.newsletter_subscribers;
drop policy if exists newsletter_insert_anyone on public.newsletter_subscribers;
```

---

## Block 3 — Apply the new policies per the spec

Recreates every policy and locks down `partners.referral_source` from anon.
Make sure RLS is enabled on each table; the `alter table … enable row level
security` calls are idempotent.

```sql
-- listings
alter table public.listings enable row level security;

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

-- partners
alter table public.partners enable row level security;

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

revoke select (referral_source) on public.partners from anon;

-- playbook_posts
alter table public.playbook_posts enable row level security;

create policy playbook_posts_select_published_public
  on public.playbook_posts for select
  to anon, authenticated
  using (published = true);

create policy playbook_posts_admin_all
  on public.playbook_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- profiles  (NO anon policies)
alter table public.profiles enable row level security;

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

-- listing_inquiries
alter table public.listing_inquiries enable row level security;

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

-- partner_inquiries
alter table public.partner_inquiries enable row level security;

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

-- memberships  (NO authenticated INSERT/UPDATE/DELETE — service role only)
alter table public.memberships enable row level security;

create policy memberships_select_own
  on public.memberships for select
  to authenticated
  using (profile_id = auth.uid());

create policy memberships_admin_select
  on public.memberships for select
  to authenticated
  using (public.is_admin());

-- newsletter_subscribers
alter table public.newsletter_subscribers enable row level security;

create policy newsletter_insert_public
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (email is not null);

create policy newsletter_admin_select
  on public.newsletter_subscribers for select
  to authenticated
  using (public.is_admin());
```

---

## Verification

After applying Blocks 1-3, paste this into the SQL Editor. Every row should
return `pass = true`.

```sql
set role anon;
select 'listings_active' as test, count(*) > 0 as pass from listings where status = 'active'
union all
select 'listings_draft_blocked', count(*) = 0 from listings where status = 'draft'
union all
select 'profiles_blocked', count(*) = 0 from profiles
union all
select 'memberships_blocked', count(*) = 0 from memberships
union all
select 'newsletter_blocked', count(*) = 0 from newsletter_subscribers;
reset role;
```

Optional column-level check (must error with `permission denied for column referral_source`):

```sql
set role anon;
select referral_source from partners limit 1;
reset role;
```

---

## Rollback

If applying Block 3 breaks the live site, paste this to restore the
previous public-read behavior on the three publicly-readable tables. This
is a **temporary** safety net — re-apply Block 3 (or fix the failing
policy) as soon as the issue is identified.

```sql
-- Re-open public reads on listings, partners, playbook_posts.
drop policy if exists listings_select_active_public on public.listings;
create policy listings_select_active_public
  on public.listings for select
  to anon, authenticated
  using (status = 'active');

drop policy if exists partners_select_approved_public on public.partners;
create policy partners_select_approved_public
  on public.partners for select
  to anon, authenticated
  using (approved = true);

-- Restore anon access to referral_source if the column-level revoke is the
-- cause of breakage.
grant select (referral_source) on public.partners to anon;

drop policy if exists playbook_posts_select_published_public on public.playbook_posts;
create policy playbook_posts_select_published_public
  on public.playbook_posts for select
  to anon, authenticated
  using (published = true);
```

If the breakage is on `listing_inquiries` / `partner_inquiries` / `memberships` /
`profiles` / `newsletter_subscribers`, the safest rollback is to disable RLS on
the offending table only (`alter table public.<table> disable row level
security;`) until the policy can be fixed. Do **not** leave RLS disabled on
`profiles` or `memberships` — those tables hold PII and billing data.
