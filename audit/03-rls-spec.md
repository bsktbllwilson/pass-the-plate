# RLS Policy Spec — Pass The Plate

Inferred from how `src/lib/*.ts`, `src/app/**/page.tsx`, and `src/app/api/chat/route.ts` actually use each table. The PostgREST clients in this app are anon-key clients running with the user's cookie session, so RLS is the only thing standing between an unauthenticated browser and the database.

Conventions:
- All policies assume `to anon` / `to authenticated` rather than `to public` so we can reason about each role separately.
- `service_role` (used only from server-side code that bypasses RLS by definition) is listed for completeness; if those policies aren't written, the service-role key still works.
- "admin" = a row in `profiles` with `role = 'admin'`. No code currently relies on this, but the column already exists, so the spec includes it.

A reusable predicate is assumed throughout:

```sql
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;
```

---

### listings

How the code uses it:
- `getTrendingListings`, `getListings`, `getListingBySlug` filter `status = 'active'` and read every column.
- `api/chat` reads only active rows.
- No write paths exist yet, but `seller_id` and `status='draft'` are first-class in the schema, so the policy must already be safe for a future seller dashboard.

Policies:
- **anon:** `SELECT where status = 'active'`. No INSERT/UPDATE/DELETE.
- **authenticated:** `SELECT where status = 'active' OR seller_id = auth.uid()`. `INSERT with check (seller_id = auth.uid())`. `UPDATE/DELETE using (seller_id = auth.uid()) with check (seller_id = auth.uid())`.
- **admin:** `ALL using (public.is_admin()) with check (public.is_admin())`.
- **service_role:** `ALL` (implicit; bypasses RLS).

Notes:
- Draft, archived, or under-review listings must never be visible to anon — every public query already filters `status = 'active'`, so the RLS check just enforces what the app expects.
- `view_count` increments belong in a SECURITY DEFINER RPC; do not give anon UPDATE access just to bump it.

---

### partners

How the code uses it:
- `getPartners` and `getFeaturedPartners` filter `approved = true` and select all columns including `email`, `phone`, `address`, `referral_source`.
- `/partners` page renders email and phone publicly. That's a product decision; the spec follows it.
- No write paths exist; partner intake (`/partners/apply`) is referenced but not implemented.

Policies:
- **anon:** `SELECT where approved = true`. No write.
- **authenticated:** `SELECT where approved = true OR profile_id = auth.uid()`. `UPDATE using (profile_id = auth.uid()) with check (profile_id = auth.uid() and approved = (select approved from public.partners where id = partners.id))` — the user can edit their own partner row but cannot self-approve. INSERT is intake-only; if added, allow `INSERT with check (profile_id = auth.uid() and approved = false)`.
- **admin:** `ALL` — admins approve partners and can edit any row.
- **service_role:** `ALL`.

Notes:
- `referral_source` is an internal field. If the app ever adds an embed that selects partners + referral_source for anon, that leaks attribution data. Consider dropping it from the anon-visible Row by using a column-level grant or a view.

---

### playbook_posts

How the code uses it:
- `getPosts`, `getPostBySlug`, `getRelatedPosts` always filter `published = true` and read every column.
- No write paths.

Policies:
- **anon:** `SELECT where published = true`.
- **authenticated:** same as anon (no notion of authoring in the app yet).
- **admin:** `ALL`.
- **service_role:** `ALL`.

Notes:
- If a future "draft preview" link is added, gate it behind a signed token from a server action rather than relaxing this policy.

---

### profiles

How the code uses it:
- Not directly queried at all. Auto-populated by the `handle_new_user()` trigger on `auth.users` insert.
- `requireUser()` and `getCurrentUser()` only read `auth.users` via `supabase.auth.getUser()`.
- The `partners.profile_id` FK exists, which means PostgREST embedded selects could try to walk into `profiles` from `/partners` queries.

Policies:
- **anon:** **None.** No SELECT, no INSERT, no UPDATE, no DELETE. Anon must never see another user's email.
- **authenticated:** `SELECT using (id = auth.uid())`. `UPDATE using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()))` — users can edit name/phone/preferred_language but cannot self-promote to admin or partner.
- **admin:** `SELECT ALL` and `UPDATE ALL` (needed for support / role assignment). Admin must not be able to grant themselves admin via the same UI; enforce that at the app layer.
- **service_role:** `ALL`. The `handle_new_user` trigger runs as `security definer` so it bypasses RLS regardless.

Notes:
- This is the most important table to lock down. A blanket `to public select using (true)` here turns the site into an email harvester.
- If `partners` or `listings` ever uses PostgREST embedding (`select=*,profiles(*)`), the embedded read is governed by `profiles` RLS — this spec is correct only as long as embedding is never relaxed.

---

### listing_inquiries

How the code uses it:
- Not yet wired. `InquiryForm` console.logs. The schema is shaped for both anon and authed buyers (both `buyer_id` and `buyer_email` are present and nullable).
- When wired, the natural flow is: anonymous visitor or signed-in buyer submits an inquiry against a listing; the listing's seller reads it from a future `/account/inquiries` page.

Policies:
- **anon:** `INSERT with check (buyer_id is null and listing_id is not null and exists (select 1 from public.listings l where l.id = listing_id and l.status = 'active'))`. No SELECT, no UPDATE, no DELETE.
- **authenticated:** `INSERT with check ((buyer_id is null or buyer_id = auth.uid()) and exists (select 1 from public.listings l where l.id = listing_id and l.status = 'active'))`. `SELECT using (buyer_id = auth.uid() OR exists (select 1 from public.listings l where l.id = listing_inquiries.listing_id and l.seller_id = auth.uid()))`. `UPDATE using (exists (select 1 from public.listings l where l.id = listing_inquiries.listing_id and l.seller_id = auth.uid())) with check (status in ('pending','accepted','rejected'))` — only the seller can change status.
- **admin:** `ALL` (support / dispute resolution).
- **service_role:** `ALL`.

Notes:
- Anon must NOT be able to set `buyer_id` to spoof an authenticated user. Enforce `buyer_id is null` for the anon path.
- Anon must NOT be able to SELECT — buyer emails would be scrapable.
- Sellers must only see inquiries for listings they own; the `listings` join is essential.
- Migration 002's draft policy `inquiries_insert_anyone … with check (true)` is too loose: it lets anon spoof `buyer_id` and write inquiries against archived/draft listings. Tighten before this form is wired up.

---

### partner_inquiries

How the code uses it:
- Not yet wired. Mirrors `listing_inquiries`: a visitor reaches out to a partner; the partner reads via their `partners.profile_id` linkage.

Policies:
- **anon:** `INSERT with check (sender_id is null and partner_id is not null and exists (select 1 from public.partners p where p.id = partner_id and p.approved = true))`. No SELECT.
- **authenticated:** `INSERT with check ((sender_id is null or sender_id = auth.uid()) and exists (select 1 from public.partners p where p.id = partner_id and p.approved = true))`. `SELECT using (sender_id = auth.uid() OR exists (select 1 from public.partners p where p.id = partner_inquiries.partner_id and p.profile_id = auth.uid()))`.
- **admin:** `ALL`.
- **service_role:** `ALL`.

Notes:
- Same anon-spoofing risk as `listing_inquiries`. The `with check` must pin `sender_id is null` for the anon role.
- Don't allow inquiries against unapproved partners — otherwise the form becomes a covert backdoor for contact discovery.

---

### memberships

How the code uses it:
- Not yet wired. Holds Stripe customer / subscription IDs and current period end. This is the most sensitive non-PII table.

Policies:
- **anon:** **None.**
- **authenticated:** `SELECT using (profile_id = auth.uid())`. **No INSERT/UPDATE/DELETE from the client at all** — Stripe webhook should be the only writer, and it runs through the service role.
- **admin:** `SELECT ALL` (billing support). No UPDATE — corrections must go through Stripe to avoid drift.
- **service_role:** `ALL`. This is the only role that should ever write here.

Notes:
- Migration 002 currently grants authenticated users INSERT/UPDATE on their own membership row. That is wrong: a user could mint themselves a `tier='full_menu', status='active'` row with no Stripe coverage. Strip those policies and route every write through a webhook handler with the service role.
- If admin support staff ever need to grant a comp membership, do it via a server action that uses the service role, not via RLS-permitted UPDATE.

---

### newsletter_subscribers

How the code uses it:
- Not yet wired. `Subscribe` and `SubscribeCard` console.log.

Policies:
- **anon:** `INSERT with check (email is not null)`. No SELECT.
- **authenticated:** Same as anon (auth state is irrelevant to a newsletter signup).
- **admin:** `SELECT ALL` (export, audit). No DELETE except via service role to preserve unsubscribe audit trail.
- **service_role:** `ALL`.

Notes:
- The unique constraint on `email` means a duplicate insert will throw a 23505. Don't catch and rethrow with the email in the message — that's a membership oracle for "is this email subscribed?". Either swallow the conflict server-side or use `on conflict do nothing` via an RPC.
- If an `unsubscribed_at` column is ever added, anon should be able to UPDATE only their own row via a signed unsubscribe token (server action with service role), not via RLS.

---

## Risk areas

These are the spots where a wrong policy leaks data or breaks trust:

1. **`profiles` is the crown jewel.** Anon must never read it. The trigger that backfills it from `auth.users` runs as `security definer`, so RLS being strict here doesn't break signup. Watch for PostgREST embedded selects (`?select=*,profiles(*)`) bleeding through `partners.profile_id` or `listings.seller_id` — the embed is gated by *the embedded table's* RLS, not the parent's.

2. **`listing_inquiries` and `partner_inquiries` anon INSERT must scrub `buyer_id` / `sender_id`.** Without `with check (buyer_id is null)`, an anonymous attacker can submit an inquiry attributed to any user id they guess, and that user's "My Inquiries" page later renders attacker-supplied content as their own.

3. **`memberships` writes must be service-role only.** Migration 002 currently permits authenticated INSERT/UPDATE keyed off `auth.uid() = profile_id`. That is a self-service paid-tier upgrade. The Stripe webhook is the only legitimate writer.

4. **`listings.view_count` increment.** If this is ever wired to bump from the page render, do it via a SECURITY DEFINER RPC. Granting anon UPDATE on `listings` (even narrowly) is a footgun that will be widened later.

5. **`partners` exposes email, phone, address, referral_source to anon today.** That is a product decision but worth re-examining: most directories gate contact info behind a signed-in proof-of-funds gate. At minimum, drop `referral_source` from the anon-visible columns via a view or `revoke select (referral_source) on partners from anon`.

6. **`listings` draft visibility.** `status` is the one and only gate between a half-written listing and the public. The RLS predicate must include both the public `status='active'` clause and the owner clause `seller_id = auth.uid()` — a single missing condition turns every draft into an indexable page.

7. **`newsletter_subscribers` unique-violation oracle.** Returning a different error to "this email is already subscribed" vs "this email isn't" lets anyone enumerate subscribers. Use `insert ... on conflict do nothing` and always return the same response.

8. **`is_admin()` recursion.** The helper queries `profiles`. If `profiles` policies ever reference `is_admin()` directly in their `using` clause without `security definer` wrapping, you get a recursive RLS evaluation that Postgres will reject. Keep `is_admin()` `security definer` and call it from policies on every *other* table.
