# Schema Drift Audit — Pass The Plate

Source of truth: `src/types/database.ts` · queried via `.from(...)` in `src/lib/*.ts` and `src/app/api/chat/route.ts` · migrations under `supabase/`.

## Tables in `database.ts` (public schema)

| Table | Columns (Row) |
|---|---|
| `listings` | id, slug, title, description, industry, cuisine, location, asking_price_cents, annual_revenue_cents, annual_profit_cents, year_established, staff_count, square_footage, cover_image_url, gallery_urls, assets, view_count, status, seller_id, created_at, updated_at |
| `partners` | id, full_name, job_title, company, email, phone, website, address, languages, bio, specialty, approved, featured, referral_source, profile_id, created_at, updated_at |
| `playbook_posts` | id, slug, title, excerpt, body_md, category, cover_image_url, author_name, published, published_at, created_at |
| `profiles` | id, email, full_name, phone, role, preferred_language, proof_of_funds_verified, proof_of_funds_verified_at, created_at, updated_at |
| `listing_inquiries` | id, listing_id, buyer_id, buyer_name, buyer_email, message, status, created_at |
| `partner_inquiries` | id, partner_id, sender_id, sender_name, sender_email, subject, message, created_at |
| `memberships` | id, profile_id, tier, stripe_customer_id, stripe_subscription_id, current_period_end, status, created_at, updated_at |
| `newsletter_subscribers` | id, email, source, created_at |

## Queries in code

| Call site | Table | Op | Columns read / filter / write |
|---|---|---|---|
| `src/lib/listings.ts:9` (`getTrendingListings`) | listings | select `*` | filter: `status`; order: `view_count` |
| `src/lib/listings.ts:24` (`getListingBySlug`) | listings | select `*` | filter: `slug`, `status` |
| `src/lib/listings.ts:82` (`getListings`) | listings | select `*` (count exact) | filter/order: `status`, `title`, `description`, `location`, `industry`, `cuisine`, `asking_price_cents`, `annual_revenue_cents`, `view_count`; in-memory: `assets` |
| `src/lib/partners.ts:19` (`getPartners`) | partners | select `*` (count exact) | filter/order: `approved`, `specialty`, `featured`, `full_name` |
| `src/lib/partners.ts:41` (`getFeaturedPartners`) | partners | select `*` | filter/order: `approved`, `featured`, `full_name` |
| `src/lib/playbook.ts:19` (`getPosts`) | playbook_posts | select `*` (count exact) | filter/order: `published`, `category`, `published_at` |
| `src/lib/playbook.ts:43` (`getPostBySlug`) | playbook_posts | select `*` | filter: `slug`, `published` |
| `src/lib/playbook.ts:60` (`getRelatedPosts`) | playbook_posts | select `*` | filter/order: `published`, `category`, `slug`, `published_at` |
| `src/app/api/chat/route.ts:45` | listings | select `id, title, location, cuisine, asking_price_cents, annual_revenue_cents, slug, description` | filter: `status`; order: `created_at` |

Page render-time field reads (all fields exist in the typed Row, listed for completeness):

- `app/buy/page.tsx`: `id, slug, title, location, cuisine, cover_image_url, asking_price_cents, annual_revenue_cents, description`
- `app/buy/[slug]/page.tsx`: above plus `industry, gallery_urls, assets, year_established, staff_count, square_footage, annual_profit_cents`
- `app/partners/page.tsx`: `id, specialty, featured, full_name, job_title, company, languages, bio, email, phone, website`
- `app/playbook/page.tsx` & `app/playbook/[slug]/page.tsx`: `slug, title, excerpt, body_md, category, cover_image_url, author_name, published_at`

No code performs `.insert()`, `.update()`, `.upsert()`, `.delete()`, or `.rpc()` against any table. Every form that looks like it should write (`InquiryForm`, `ContactForm`/`submitContact`, `Subscribe`, `SubscribeCard`) just `console.log`s and sets local state.

## LIST A — Columns referenced by code that don't exist in `database.ts`

**None.** Every column read or filtered against in the queries above is present in the corresponding Row type. The TS types are consistent with how the code actually uses the schema.

## LIST B — Tables in `database.ts` never queried by code

| Table | Status |
|---|---|
| `profiles` | Not read or written by app code. Auto-populated by the `handle_new_user` trigger. `requireUser()` only calls `supabase.auth.getUser()` (auth schema), never selects from `public.profiles`. |
| `listing_inquiries` | Dead. `InquiryForm` only `console.log`s. No server action exists to insert. |
| `partner_inquiries` | Dead. No code path inserts or reads. |
| `memberships` | Dead. No Stripe webhook, no membership read on `/account`. |
| `newsletter_subscribers` | Dead. Both `Subscribe` (homepage) and `SubscribeCard` (playbook) only `console.log`. |

That's 5 of 8 tables wired in the type system but unused — most of the user-facing forms are no-ops behind a UI shell.

## LIST C — Queried tables with potential type mismatches

| Concern | Detail |
|---|---|
| `listings.assets` typed loosely | DB is `jsonb not null default '[]'`; type is `Json`. `getListings` filters in-memory with `Array.isArray(assets)` — works, but a stricter `string[]` or tagged shape would catch bad seed data at compile time. |
| String columns with DB-side CHECK constraints | `listing_inquiries.status` (`pending|accepted|rejected`), `memberships.status` (`active|past_due|canceled|trialing`), `memberships.tier` (`first_bite|chefs_table|full_menu`), `profiles.role` (`buyer|seller|partner|admin`), `profiles.preferred_language` (`en|zh|ko|vi`) are all typed `string \| null` in `database.ts`. Any future `.insert()` or `.update()` would type-check with arbitrary strings and only blow up at runtime. (No current code is exposed because none of these tables are written.) |
| `listings.seller_id` FK target ambiguity | Typed `string \| null`. The original `schema.sql` defines the FK as `references auth.users(id) on delete set null`; migration 002 conditionally re-points it to `references public.profiles(id) on delete cascade`. Same column, different parent table and delete behavior depending on order of application — see migrations section. |
| `chat` route `select(...)` projection | Selects only 8 columns and maps them locally to `ListingForPrompt`. Not type-checked against the Row, but every column name is correct. |

No genuine type mismatches in current call sites — risk is concentrated in the unused tables, where the first real `.insert()` will silently accept invalid enum strings.

## Migrations vs `database.ts`

Files: `supabase/schema.sql` (73 lines) + `migrations/001_add_listings_gallery_urls.sql` + `migrations/002_add_profiles_and_inquiries.sql`.

### CRITICAL: `migrations/002_add_profiles_and_inquiries.sql` is corrupted

The file is 380 lines. Lines 1–140 are a **truncated** copy of the migration that stops mid-statement inside `create table public.memberships`:

```sql
  tier text check (tier in ('first_bite','chefs_table','full_menu'))
ls -la supabase/migrations/
wc -l supabase/migrations/002_add_profiles_and_inquiries.sql
cat > supabase/migrations/002_add_profiles_and_inquiries.sql << 'EOF'
-- Pass The Plate — Add profiles, inquiries, memberships, newsletter
...
```

Lines 141–143 are literal shell commands embedded as SQL text. Lines 144–380 are a **second, complete copy** of the migration (the heredoc that should have replaced the file but was instead concatenated into it).

Consequences:
- `psql -f 002_…sql` fails: the truncated `tier text check (...)` line has no closing `)` or `;`, the next non-blank line is `ls -la ...`.
- Even `idempotent` re-runs against a clean DB will not reproduce the schema described in `database.ts`.
- The file's own header comment says it "was applied to production via Supabase Dashboard SQL Editor on 2026-04-27" — so production is fine, but the committed migration **cannot rebuild a fresh environment**. CI / branch databases / new contributors are broken.

Fix: replace the file with just the second copy (lines 144–end), or re-export from production.

### Other divergences vs `database.ts`

| Item | schema.sql / migrations | database.ts | Note |
|---|---|---|---|
| `listings.seller_id` FK target | `auth.users(id) ON DELETE SET NULL` (schema.sql) — migration 002 only adds a *new* FK to `public.profiles(id) ON DELETE CASCADE` if no FK named `listings_seller_id_fkey` exists. Because schema.sql creates an unnamed FK, Postgres assigns it a generated name → migration 002's existence check passes → both FKs end up applied, or only the auth one does, depending on history. | `seller_id: string \| null` (no FK metadata) | Real-world FK shape depends on apply order. Worth pinning explicitly. |
| `partners.updated_at` | Not in `schema.sql`; added by migration 002 as `timestamptz default now()` (nullable, no NOT NULL) | `updated_at: string \| null` | Matches. |
| `partners.profile_id` | Not in `schema.sql`; added by migration 002 (nullable FK to `profiles`) | Present | Matches. |
| `listings.gallery_urls` | Added by migration 001 as `text[] not null default '{}'` | `gallery_urls: string[]` (non-null) | Matches. |
| `profiles`, `listing_inquiries`, `partner_inquiries`, `memberships`, `newsletter_subscribers` | Defined only in (corrupted) migration 002 | All present in `database.ts` | If a fresh DB ever runs the broken migration, these tables won't exist; types will compile but every query returns "relation does not exist". |
| RLS policies | Defined only in (the second half of) migration 002 | N/A in TS types | A fresh-from-migrations DB has zero RLS, so anon clients would have full read/write on every table. |
| Indexes | `schema.sql` and 002 declare them `if not exists` | Not represented in types | OK. |

### Summary

- **Types are not stale** — every column the code actually touches exists in `database.ts` (LIST A is empty).
- **Most of the typed schema is dead weight in the app today** — 5 of 8 tables are never queried (LIST B). The forms that should populate them silently swallow input.
- **No live type mismatches**, but the unused tables hide loose enum typing that will bite the moment those forms are wired up (LIST C).
- **The migration history is broken** — `002_add_profiles_and_inquiries.sql` cannot be re-applied; only production matches `database.ts` because the migration was hand-pasted into the dashboard.
