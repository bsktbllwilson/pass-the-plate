-- Pass The Plate — migration 007
-- Tighten partner_inquiries INSERT policy to prevent sender_id spoofing
-- and ensure the target partner exists + is approved (don't let a covert
-- inquiry land against an unapproved / pending partner row).
-- Replaces the loose `partner_inquiries_insert_anyone` policy from
-- migration 002. Mirrors the listing_inquiries tightening from
-- migration 004.
--
-- Also adds a sender-self SELECT policy so authenticated users can
-- read back the inquiries they submitted (the existing partner-side
-- SELECT policy from migration 002 is left untouched).

drop policy if exists partner_inquiries_insert_anyone on public.partner_inquiries;
drop policy if exists partner_inquiries_insert_anon on public.partner_inquiries;
drop policy if exists partner_inquiries_insert_authenticated on public.partner_inquiries;
drop policy if exists partner_inquiries_select_sender on public.partner_inquiries;

create policy partner_inquiries_insert_anon
  on public.partner_inquiries for insert to anon
  with check (
    sender_id is null
    and partner_id is not null
    and exists (
      select 1 from public.partners
      where partners.id = partner_inquiries.partner_id
        and partners.approved = true
    )
  );

create policy partner_inquiries_insert_authenticated
  on public.partner_inquiries for insert to authenticated
  with check (
    (sender_id is null or sender_id = auth.uid())
    and partner_id is not null
    and exists (
      select 1 from public.partners
      where partners.id = partner_inquiries.partner_id
        and partners.approved = true
    )
  );

create policy partner_inquiries_select_sender
  on public.partner_inquiries for select to authenticated
  using (auth.uid() = sender_id);
