# Routes Audit — Pass The Plate

Branch: `claude/audit-routes-KnWDJ` · scope: `src/app/**` + `middleware.ts`

## Middleware

`middleware.ts` runs on all paths except static assets. It instantiates a Supabase SSR client, calls `auth.getUser()`, and redirects unauthenticated users to `/sign-in?next=…` for any path matching `PROTECTED_PATHS = ["/account", "/verify", "/sell/new"]`.

## Inventory

| Route | File | Server/Client | Data sources | Auth |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Server (async) | `lib/content` (static), `getTrendingListings()` → Supabase `listings` | Public |
| `/about` | `src/app/about/page.tsx` | Server | `lib/content`, in-file `TIMELINE`/`TEAM`/`PRESS` consts | Public |
| `/account` | `src/app/account/page.tsx` | Server (async) | `requireUser()` → Supabase `auth.getUser()`, `lib/content` | `requireUser` + middleware |
| `/api/chat` | `src/app/api/chat/route.ts` | Route handler (`runtime=nodejs`, `dynamic=force-dynamic`) | POST body (zod-validated `messages`), Supabase `listings` (active, top 8), Anthropic API | Public (no auth check) |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Route handler (GET) | `searchParams.code`, `searchParams.next`, Supabase `auth.exchangeCodeForSession` | Public (token exchange) |
| `/buy` | `src/app/buy/page.tsx` | Server (async) | `searchParams` (`q`, `industry`, `location`, `assets`, `price`, `revenue`, `page`), `getListings()` → Supabase `listings` | Public |
| `/buy/[slug]` | `src/app/buy/[slug]/page.tsx` | Server (async) | `params.slug`, `getListingBySlug()` → Supabase `listings`; child `InquiryForm` is client | Public |
| `/contact` | `src/app/contact/page.tsx` | Server | `lib/content`, `data/faqs`; child `ContactForm` is client + uses `submitContact` server action | Public |
| `/debug/whoami` | `src/app/debug/whoami/page.tsx` | Server (`dynamic=force-dynamic`) | `getCurrentUser()` → Supabase `auth.getUser()` | Public (renders user JSON if signed in, else "Not signed in") |
| `/forgot-password` | `src/app/forgot-password/page.tsx` | Server | None directly; renders client `ForgotPasswordForm` | Public |
| `/partners` | `src/app/partners/page.tsx` | Server (async) | `lib/content`, `getPartners({perPage:100})` → Supabase `partners` (approved=true) | Public |
| `/playbook` | `src/app/playbook/page.tsx` | Server (async) | `searchParams` (`category`, `page`), `getPosts()` → Supabase `playbook_posts` (published=true) | Public |
| `/playbook/[slug]` | `src/app/playbook/[slug]/page.tsx` | Server (async) | `params.slug`, `getPostBySlug()`, `getRelatedPosts()` → Supabase `playbook_posts`; child `Markdown` renders MD | Public |
| `/reset-password` | `src/app/reset-password/page.tsx` | Server | None directly; renders client `ResetPasswordForm` | Public |
| `/sell` | `src/app/sell/page.tsx` | Server | `lib/content`, `data/testimonials` (in-process random shuffle) | Public |
| `/sign-in` | `src/app/sign-in/page.tsx` | Server | None directly; client `SignInForm` reads `next` search param | Public |
| `/sign-up` | `src/app/sign-up/page.tsx` | Server | None directly; client `SignUpForm` | Public |
| `/verify` | `src/app/verify/page.tsx` | Server (async) | `requireUser()` → Supabase `auth.getUser()`, `lib/content` | `requireUser` + middleware |

## Flags

### Missing Metadata API title/description
- **`src/app/page.tsx`** — no `export const metadata`; falls back to root layout (`Pass The Plate — Marketplace…`). Acceptable but worth an explicit home-page title/description for SEO.
- **`src/app/debug/whoami/page.tsx`** — no metadata, no SEO controls, no `noindex`. Page also leaks user id / email / sign-in timestamps as JSON to anyone who hits it while signed in. Should at minimum be `noindex` and ideally guarded behind an env check or removed from production.
- **`src/app/account/page.tsx`**, **`/verify`**, **`/sign-in`**, **`/sign-up`**, **`/forgot-password`**, **`/reset-password`** — `metadata` defines `title` only, no `description`. Minor.
- **Route handlers** (`/api/chat`, `/auth/callback`) — N/A (no Metadata API for route handlers).

### Server/client mixing oddities
- **`src/app/sell/page.tsx`** — server component calls `Math.random()` inside `shuffle(TESTIMONIALS)` at render time. With default static rendering this freezes one random pair into the cached HTML; with dynamic rendering it produces a hydration-stable but request-varying result. Either move the shuffle to a client component or pick deterministically on the server.
- **`src/app/api/chat/route.ts`** — uses `createClient()` from `@/lib/supabase/server` (the cookie-aware SSR client) only to make an unauthenticated `select` against `listings`. Using the anon/service client would be lighter and avoid coupling chat behavior to the user's auth cookies.
- **`src/app/buy/[slug]/InquiryForm.tsx`** — client component (no Supabase imports observed in the head); confirm it isn't doing direct browser-side Supabase writes that bypass RLS-aware server actions. (Not read in full here — flag for follow-up.)

### Dead imports / unused params
- **`src/app/buy/page.tsx`** — `BuySellSplit` is imported and rendered at the bottom (used). `FindYourNextBigDeal` likewise used. No obvious dead imports. Search-param keys read are consistent with `FilterBar`/`SearchBar`. Clean.
- **`src/app/playbook/page.tsx`** — `PlaybookPost` type is imported only for the `items` discriminated union typing; used. Clean.
- **`src/app/auth/callback/route.ts`** — `safeNext` only checks `startsWith('/')`; protocol-relative URLs starting with `//evil.com` would pass the check and produce an open-redirect via `${origin}${safeNext}`. Not strictly a "dead import" but worth tightening (also reject `//` and `/\\`).
- **`middleware.ts`** — protects `/sell/new`, but `src/app/sell/` contains only `page.tsx`; **no `/sell/new` route exists**. Either the route is missing or the middleware entry is stale.

### Half-built / placeholder
- **`/account`** — body is literally "Account dashboard / Coming soon." plus a sign-out button. Functional shell, no actual dashboard.
- **`/verify`** — body is "Proof of funds verification / Coming soon." with a back link. Pure placeholder behind auth.
- **`/sell`** — page is mostly built, but contains a 600px-tall "Interactive map coming soon" placeholder block in the Listing Hotspots section, and the hero CTA links to `/sell/new` which does not exist (see middleware flag above).
- **`/debug/whoami`** — debug-only utility shipped under `src/app/debug/`. No `noindex`, no auth gate, no env guard — should not exist in a production bundle as-is.

### Cross-cutting notes
- The chat route's system prompt references several pages that **don't exist** in `src/app/`: `/membership`, `/partners/apply`, `/tools`. Shushu will happily link users to 404s. Either add the routes or strip them from the prompt.
- `lib/content` footer references and `ContactForm`'s `ALT_LINKS` also point to `/membership#faqs` and `/partners/apply` — same dead-link problem at the UI layer, not just in the LLM prompt.
- All Supabase reads happen through the SSR cookie client (`@/lib/supabase/server`) even on fully public, cacheable pages (`/buy`, `/partners`, `/playbook`). Worth confirming this doesn't force every page into dynamic rendering unintentionally.
