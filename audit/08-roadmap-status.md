# Roadmap Status Audit — Pass The Plate

## Source-of-truth search

I checked the standard locations for a build roadmap:

- `/pass-the-plate-build-prompts.md` — **not found**
- `/docs/build-prompts.md` — `/docs/` directory does not exist
- `/BUILD.md` — **not found**
- `/README.md` — present but is the unmodified `create-next-app` boilerplate; no roadmap content
- `/AGENTS.md`, `/CLAUDE.md` — present, but only contain a one-line "this is not the Next.js you know" warning + `currentDate`

**No build-prompts roadmap is checked into the repo.** The 17 prompts are not enumerable from source. The audit below is therefore inferred from the codebase: features that exist (file evidence), features that are referenced but unbuilt, and features whose schema/wiring is half-present.

If the original prompts file is somewhere else (Notion, a private gist, a previous branch), feed it back in and I'll re-map this section item-by-item.

## Inferred build status

### Marketing & content surface

- ✅ **Homepage** — `src/app/page.tsx` with Hero, TrendingHotspots, ValueProps, BuySellSplit, StatsBand, PartnerLogos, Subscribe, SiteFooter.
- ✅ **About page** — `src/app/about/page.tsx` with mission, timeline, team, press.
- ✅ **Contact page + FAQ** — `src/app/contact/page.tsx` + `FaqAccordion`. Form is client-rendered.
- ✅ **Buy index + filters + search** — `src/app/buy/page.tsx`, `SearchBar`, `FilterBar`, server-side filter via `getListings`.
- ✅ **Listing detail page** — `src/app/buy/[slug]/page.tsx` with Gallery, sidebar pricing, inquiry form shell, per-item `generateMetadata`.
- ✅ **Sell landing page** — `src/app/sell/page.tsx`. Hero CTA, value props, stats, testimonials.
- ✅ **Partners directory** — `src/app/partners/page.tsx` reads from `partners` table, filters approved-only.
- ✅ **Playbook index + post detail** — `src/app/playbook/page.tsx`, `[slug]/page.tsx`, `Markdown` renderer, `CategoryFilter`, `SubscribeCard`.
- ✅ **Site chrome** — `SiteHeader`, `SiteFooter`, `UserMenu`, `ChatWidget` (Shushu).

### Auth & account

- ✅ **Email + password sign-in** — `SignInForm.tsx`, `SignInPage`, plus `signInWithOtp` (magic-link) fallback.
- ✅ **Sign-up** — `SignUpForm.tsx` with role/language pickers writing to `auth.users` (the `handle_new_user` trigger backfills `profiles`).
- ✅ **Forgot / reset password flow** — `ForgotPasswordForm`, `ResetPasswordForm`, `auth/callback/route.ts` exchanges code for session.
- ✅ **Sign-out** — `SignOutButton` calls `supabase.auth.signOut()`.
- ✅ **Middleware-protected routes** — `middleware.ts` redirects unauthenticated users away from `/account`, `/verify`, `/sell/new`.
- 🟡 **Account dashboard (`/account`)** — page exists and is auth-gated, but body is literally "Account dashboard / Coming soon." plus a sign-out button. No real dashboard content.
- 🟡 **Proof-of-funds verification (`/verify`)** — page exists and is auth-gated, but body is "Proof of funds verification / Coming soon." Pure stub.
- ⏸️ **Admin role / admin UI** — `profiles.role` allows `'admin'` but no admin path exists in `src/app/`.

### Marketplace transactions

- ❌ **Inquiry form actually writes to DB** — `src/app/buy/[slug]/InquiryForm.tsx` only `console.log`s. The `listing_inquiries` table is typed in `database.ts` and created by migration 002, but no code inserts into it.
- ❌ **Seller listing creation (`/sell/new`)** — middleware protects this route, the `/sell` hero CTA links to it (`src/app/sell/page.tsx:61`), but the page does not exist.
- ❌ **Seller dashboard / "my listings" / inbox** — no UI to read `listing_inquiries` from the seller side.
- ❌ **Buyer dashboard / saved searches / favorites** — none.
- ❌ **Listing edit / status transitions (`draft → active → sold`)** — none.

### Partners

- ✅ **Partners directory read** — `getPartners`, `getFeaturedPartners`.
- ❌ **Partner application (`/partners/apply`)** — referenced from chat-widget prompt and `/contact` quick-links, but no page exists.
- ❌ **Partner inquiry form** — `partner_inquiries` table is typed and migrated but no UI inserts into it.

### Membership / billing

- ❌ **`/membership` page** — referenced by `/contact` (`/membership#faqs`), the chat widget, and `content/homepage.json` footer ("Become A Member" → `#`), but no page exists.
- ❌ **Stripe wiring** — `memberships` table has `stripe_customer_id`, `stripe_subscription_id`, `current_period_end`, but no Stripe SDK, no webhook route, no checkout button. Migration 002 even gives authenticated users self-INSERT/UPDATE on memberships, which would let them mint a paid tier with no payment (see `03-rls-spec.md`).

### Tools & data

- ❌ **`/tools` valuation calculator + benchmarks** — referenced by `/sell` ("Get Free Valuation"), homepage `content/homepage.json` ("Market Tools →"), and the chat widget, but no page exists.
- ❌ **Listing heatmap / interactive map** — `/sell` page renders a 600px placeholder ("Interactive map coming soon"). `content/homepage.json` footer also links "Listing Heatmap" → `#`.

### Communications

- ❌ **Newsletter signup actually subscribes** — both homepage `Subscribe` and playbook `SubscribeCard` only `console.log`. `newsletter_subscribers` table is typed and migrated but unused.
- ❌ **Contact form actually emails** — `src/app/contact/actions.ts` is a real server action but its body is `console.log('Contact form submitted:', payload); return { ok: true }`. No transactional email provider, no DB write, no Slack notification.
- ❌ **Inbound email / Resend / Postmark integration** — none.

### Integrations promised in copy but not in code

- ❌ **Chowbus API partnership** — referenced in `/about` timeline and chat widget; no API client, no env var, no data flow.
- ❌ **SBA pre-qualification flow** — referenced in `/verify` page copy and chat widget; no implementation.
- ❌ **Bilingual content (Mandarin / Korean / Vietnamese)** — repeatedly promised in homepage copy and chat widget; site is English-only. No `next-intl`, `next-translate`, or `[lang]` route segment.

### Infrastructure

- ✅ **Supabase SSR + middleware session refresh** — properly wired (see `04-env-vars.md`).
- ✅ **Service-role admin client** — `src/lib/supabase/admin.ts` exists with `import 'server-only'` guard, but is **never imported anywhere**. Set up but unused.
- ✅ **Anthropic chat (Shushu widget)** — fully wired streaming, including dynamic listings injection into the system prompt.
- ❌ **Sitemap, robots, OG image, metadataBase** — see `07-seo-meta.md`.
- ❌ **Rate limiting** — `/api/chat` accepts up to 40 messages × 4000 chars per request with no per-IP throttle and no auth check. A single-vertex chat scrape would burn the Anthropic budget.
- 🟡 **Migrations** — corrupted (see `02-schema-drift.md`). Production matches `database.ts` only because migration 002 was hand-pasted into the Supabase dashboard.

## What I'd recommend building next, in priority order

1. **Wire the listing inquiry form to actually insert.** This is the marketplace's central conversion event. The schema, the RLS shape, and the form UI are all in place — the form currently console.logs (`src/app/buy/[slug]/InquiryForm.tsx`). One server action that calls `supabase.from('listing_inquiries').insert(...)` (with the anon-INSERT RLS pattern in `03-rls-spec.md`) plus a Resend/Postmark notification to the seller turns the entire `/buy/[slug]` page from a brochure into a lead-gen surface. Without this, every other shipped page is decoration.
2. **Build `/sell/new` (the seller listing form).** The `/sell` hero CTA already links there, middleware already protects it, and the `listings` table has every column the form needs. Until this exists, there is no way for a new seller to actually list — the marketplace is read-only for the supply side. This is also the natural home for the bilingual-listing promise that the marketing copy makes.
3. **Build `/membership` and wire Stripe.** Three different surfaces (chat widget, `/contact`, footer) link to `/membership`, and `memberships.stripe_*` columns are waiting. Until this ships, the "First Bite / Chef's Table / Full Menu" pricing in the chat widget is a promise the site can't honor. **Critical:** lock down the memberships RLS as part of this work — current policies let users self-grant paid tiers (`03-rls-spec.md`).

## What's safe to defer

1. **Account dashboard (`/account`).** Today it's a "Coming soon" stub behind auth. Nothing else depends on it; users who sign in only need it to see they're signed in. Ship after the inquiry inbox actually has data to show.
2. **Proof-of-funds verification (`/verify`).** Same shape as `/account` — auth-gated stub. Real implementation requires a document-upload pipeline + manual review queue + reviewer UI; weeks of work for a feature only matters once buyer volume justifies gating.
3. **`/tools` valuation calculator.** Marketing surface that the chat widget and homepage promise. A static "Request a valuation" form that reuses the contact-action wiring is a fine v0; the real calculator is a long tail.
4. **Interactive map / Listing Heatmap.** Currently a 600px placeholder on `/sell`. Looks impressive, requires a real data layer + tile provider + perf budget. Defer until inventory density makes it useful.
5. **Bilingual UI (zh/ko/vi).** Promised throughout the marketing copy, but the audience for v1 will tolerate English-only as long as inquiries reach the seller in their preferred language. Defer until the inquiry flow is live and actual volume signals which languages to start with.
