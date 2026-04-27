-- Pass The Plate — RLS policies
-- Tables already have RLS enabled in 0001_init.sql.
-- Service role bypasses RLS, so admin-only operations need no policies here.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy profiles_select_own
  on public.profiles
  for select
  using (auth.uid() = id);

create policy profiles_update_own
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------
create policy listings_select_active_public
  on public.listings
  for select
  using (status = 'active');

create policy listings_select_own_any_status
  on public.listings
  for select
  using (auth.uid() = seller_id);

create policy listings_insert_own
  on public.listings
  for insert
  with check (auth.uid() = seller_id);

create policy listings_update_own
  on public.listings
  for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

create policy listings_delete_own
  on public.listings
  for delete
  using (auth.uid() = seller_id);

-- ---------------------------------------------------------------------------
-- listing_inquiries
-- ---------------------------------------------------------------------------
create policy inquiries_insert_anyone
  on public.listing_inquiries
  for insert
  with check (true);

create policy inquiries_select_buyer
  on public.listing_inquiries
  for select
  using (auth.uid() = buyer_id);

create policy inquiries_select_seller
  on public.listing_inquiries
  for select
  using (
    exists (
      select 1 from public.listings
      where listings.id = listing_inquiries.listing_id
        and listings.seller_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------
create policy partners_select_approved_public
  on public.partners
  for select
  using (approved = true);

create policy partners_select_own
  on public.partners
  for select
  using (auth.uid() = profile_id);

create policy partners_insert_apply
  on public.partners
  for insert
  with check (true);

create policy partners_update_own
  on public.partners
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- partner_inquiries
-- ---------------------------------------------------------------------------
create policy partner_inquiries_insert_anyone
  on public.partner_inquiries
  for insert
  with check (true);

create policy partner_inquiries_select_partner
  on public.partner_inquiries
  for select
  using (
    exists (
      select 1 from public.partners
      where partners.id = partner_inquiries.partner_id
        and partners.profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- playbook_posts
-- ---------------------------------------------------------------------------
create policy posts_select_published_public
  on public.playbook_posts
  for select
  using (published = true);

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------
create policy memberships_select_own
  on public.memberships
  for select
  using (auth.uid() = profile_id);

create policy memberships_insert_own
  on public.memberships
  for insert
  with check (auth.uid() = profile_id);

create policy memberships_update_own
  on public.memberships
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------
-- Insert-only for the public; reads happen via service role.
create policy newsletter_insert_anyone
  on public.newsletter_subscribers
  for insert
  with check (true);
