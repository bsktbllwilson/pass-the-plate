-- Pass The Plate — migration 004
-- Tighten listing_inquiries INSERT policy to prevent buyer_id spoofing
-- and ensure the target listing is publicly visible (status = 'active').
-- Replaces the loose `inquiries_insert_anyone` policy from migration 002.

drop policy if exists inquiries_insert_anyone on public.listing_inquiries;

create policy inquiries_insert_anon
  on public.listing_inquiries for insert to anon
  with check (
    buyer_id is null
    and exists (
      select 1 from public.listings
      where listings.id = listing_inquiries.listing_id
        and listings.status = 'active'
    )
  );

create policy inquiries_insert_authenticated
  on public.listing_inquiries for insert to authenticated
  with check (
    (buyer_id is null or buyer_id = auth.uid())
    and exists (
      select 1 from public.listings
      where listings.id = listing_inquiries.listing_id
        and listings.status = 'active'
    )
  );
