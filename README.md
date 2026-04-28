# Pass The Plate

Marketplace for the $240B+ Asian F&B business transition. Production at
[passtheplate.store](https://www.passtheplate.store).

## Stack

- Next.js 16 (App Router, Turbopack) on React 19
- Supabase (Postgres + Auth) via `@supabase/ssr` — cookie-aware SSR
  client for user sessions, cookieless anon client for public reads,
  service-role client for privileged writes
- Tailwind CSS v4 (no config file — design tokens live in
  `src/app/globals.css` `@theme`)
- Anthropic Claude (Haiku) for the Shushu chat widget
- Vercel for hosting

## Getting started

```bash
pnpm install
cp .env.example .env.local
# fill in real values — see "Environment variables" below
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment variables

All required variables are listed in [`.env.example`](./.env.example).
Production values live in Vercel; local development uses `.env.local`
(git-ignored).

| Variable | Used for | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (RLS-bound reads + auth) | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key for privileged server writes (Stripe webhook, admin tools) | **server-only** |
| `NEXT_PUBLIC_SITE_URL` | Auth redirect target for email links | yes |
| `ANTHROPIC_API_KEY` | Powers `/api/chat` (Shushu widget) | **server-only** |
| `RESEND_API_KEY` | Transactional email sender for inquiry / contact / newsletter notifications | **server-only** |
| `NOTIFY_FROM_EMAIL` | `from:` address (must be on a verified Resend domain) | **server-only** |
| `NOTIFY_TO_EMAIL` | Team inbox that receives every notification | **server-only** |

The service-role key bypasses RLS — keep it out of any `'use client'`
file. `src/lib/supabase/admin.ts` uses `import 'server-only'` as a
build-time guard.

## Project layout

```
src/
  app/                       Next.js App Router routes
    api/chat/                Anthropic streaming endpoint (Shushu)
    actions/                 Cross-route server actions (newsletter, …)
    sitemap.ts robots.ts     SEO surfaces
  components/
    ui/                      Button, Input, Field — shared primitives
    sections/                Page sections (Hero, SiteHeader, …)
    auth/                    Sign-in / sign-up / password forms
    widget/                  Shushu chat widget
  lib/
    supabase/server.ts       SSR client (cookies → user session)
    supabase/anon.ts         Cookieless anon client for server reads
    supabase/admin.ts        Service-role client for privileged writes
    listings.ts partners.ts  Typed query helpers
  types/database.ts          Database types — keep in sync with
                             supabase/migrations/
supabase/
  schema.sql                 Initial public schema
  migrations/                Numbered migrations (apply in order)
audit/                       Multi-part codebase audit driving the
                             current cleanup work
```

## Database

Migrations under `supabase/migrations/` are numbered; apply in order to
rebuild a fresh environment. Production matches the latest migration.
After adding a migration, regenerate types:

```bash
supabase gen types typescript --project-id <id> > src/types/database.ts
```

(Or hand-edit `database.ts` to match — the file is only used for
TypeScript inference, not at runtime.)

## Deploy

```bash
git push origin main      # auto-deploys via Vercel
```

Branch previews build automatically on push.
