-- Pass The Plate — migration 003
-- Memberships are written only by the Stripe webhook (service_role).
-- Drop the client-write policies so authenticated users cannot self-grant a
-- paid tier. Keep memberships_select_own — users still need to read their
-- own membership row.

drop policy if exists memberships_insert_own on public.memberships;
drop policy if exists memberships_update_own on public.memberships;
