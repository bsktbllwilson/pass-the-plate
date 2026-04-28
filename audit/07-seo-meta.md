# SEO & Metadata Audit — Pass The Plate

## Page metadata coverage

| Route | title | description | openGraph | twitter |
|---|---|---|---|---|
| `/` (`src/app/page.tsx`) | inherited from layout | inherited | No | No |
| `/about` | Yes | Yes | No | No |
| `/account` | Yes | No | No | No |
| `/buy` | Yes | Yes | No | No |
| `/buy/[slug]` (via `generateMetadata`) | Yes (per listing) | Yes (per listing — first paragraph of description) | No | No |
| `/contact` | Yes | Yes | No | No |
| `/debug/whoami` | **No** | No | No | No |
| `/forgot-password` | Yes | No | No | No |
| `/partners` | Yes | Yes | No | No |
| `/playbook` | Yes | Yes | No | No |
| `/playbook/[slug]` (via `generateMetadata`) | Yes (per post) | Yes (per post `excerpt`) | No | No |
| `/reset-password` | Yes | No | No | No |
| `/sell` | Yes | Yes | No | No |
| `/sign-in` | Yes | No | No | No |
| `/sign-up` | Yes | No | No | No |
| `/verify` | Yes | No | No | No |

Route handlers (`/api/chat`, `/auth/callback`) have no metadata, which is correct — they don't render pages.

Layout-level metadata (`src/app/layout.tsx`):
```ts
title: 'Pass The Plate — Marketplace for Asian F&B Businesses',
description: 'The first marketplace for the $240B+ Asian F&B business transition.',
```
That's the entire site-wide SEO baseline. **No `metadataBase`**, **no `openGraph`**, **no `twitter`**, **no `icons`**, **no `alternates.canonical`**, **no `robots`** field.

## Site-wide SEO infrastructure

| Asset | Status |
|---|---|
| `src/app/sitemap.ts` | **Missing** |
| `public/sitemap.xml` | **Missing** |
| `src/app/robots.ts` | **Missing** |
| `public/robots.txt` | **Missing** |
| `src/app/favicon.ico` | Present (default Next.js 15 favicon — has not been replaced) |
| `public/og-default.png` | **Missing** |
| `src/app/opengraph-image.{png,tsx}` | **Missing** |
| `src/app/api/og` route | **Missing** (the only file under `src/app/api` is `chat/route.ts`) |
| `metadataBase` in root layout | **Not set** |

There is a `public/logo-passtheplate.png` and a number of brand JPEGs in `public/`, but none are wired up as the OG default or as a manifest icon.

## Per-item dynamic metadata

Both detail routes use `generateMetadata`:

- `src/app/buy/[slug]/page.tsx:33` — sets `title: '<Listing Title> — Pass The Plate'` and `description` = first line of the listing's description. No `openGraph.images: [listing.cover_image_url]`, which is the obvious next step.
- `src/app/playbook/[slug]/page.tsx:14` — sets `title: '<Post Title> — Pass The Plate'` and `description: post.excerpt`. No `openGraph.images: [post.cover_image_url]`.

Both have the ingredients (cover image URL, title, description) to populate rich social cards but neither does.

## `<img>` vs `next/image`

A grep for `<img ` across `src/**/*.tsx` returns **zero matches**. Every cover and hero image goes through `next/image` (e.g. `src/app/about/page.tsx`, `src/app/sell/page.tsx`, `src/app/playbook/page.tsx`, `src/app/playbook/[slug]/page.tsx`, `src/app/buy/page.tsx`, `src/app/buy/[slug]/Gallery.tsx`, `src/components/sections/TrendingHotspots.tsx`). Good.

## Other observations

- **`/debug/whoami`** has no `metadata`, no `noindex`, and no auth gate. It will be indexed by anything that crawls it, and it renders signed-in users' email, user id, and timestamps as JSON. Either delete it or add `export const metadata = { robots: { index: false, follow: false } }` plus a server-side env guard.
- **Auth pages** (`/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/verify`) should probably be `noindex` too — there's no SEO value in indexing form pages and they often clutter sitelinks.
- **Home page (`src/app/page.tsx`)** falls back to the layout title `Pass The Plate — Marketplace for Asian F&B Businesses`. That's fine, but the home page is the single most-shared URL on the site and benefits the most from an explicit `openGraph` block.
- **Twitter Card** absence means `summary_large_image` cards never render on X; tweets degrade to plain link previews.
- The Anthropic chat-widget system prompt directs users to `/membership`, `/partners/apply`, `/tools` — none of which exist — so even if a sitemap is added, those will 404. Fix in code, not in metadata.

## Critical gaps that hurt SEO right now

1. **No `metadataBase` and no `openGraph` anywhere.** Every link to the site shared on Slack, X, LinkedIn, WeChat, or KakaoTalk renders without a preview image or a structured card. For a marketplace whose acquisition motion is "share this listing in a WeChat group," this is the single most expensive SEO miss. Fix: add `metadataBase: new URL('https://www.passtheplate.store')` and a default `openGraph: { siteName, type: 'website', images: ['/og-default.png'] }` in `src/app/layout.tsx`, then layer per-listing and per-post `openGraph.images` into the existing `generateMetadata` blocks.
2. **No `sitemap.ts` and no `robots.ts`.** Google has to discover every listing and every playbook post by crawling. New listings (the inventory the business actually monetizes) get indexed days late at best. Fix: add `src/app/sitemap.ts` that pulls active listings and published posts via the existing `getListings` / `getPosts` and emits the URLs; add `src/app/robots.ts` that allows everything except `/debug`, `/account`, `/verify`, and `/api`.
3. **`/debug/whoami` is publicly indexable and leaks user PII when a signed-in Googlebot session ever hits it.** This is both an SEO and a privacy problem. Fix immediately: either delete the route or guard it behind `process.env.NODE_ENV !== 'production'` and add `robots: { index: false, follow: false }` to its metadata.
