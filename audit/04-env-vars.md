# Environment Variables Audit — Pass The Plate

Sources scanned: `src/**`, `middleware.ts`, `next.config.ts`, `.env.example`, `README.md`.

## Inventory

| Variable | Used in | Client-exposed? | In `.env.example`? | In README? |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `middleware.ts`; `src/lib/supabase/{client,server,admin}.ts`; `src/instrumentation.ts` | Yes (`NEXT_PUBLIC_`) | Yes | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `middleware.ts`; `src/lib/supabase/{client,server}.ts`; `src/instrumentation.ts` | Yes (`NEXT_PUBLIC_`) | Yes | No |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/lib/supabase/admin.ts`; `src/instrumentation.ts` | No (server-only, file is `import 'server-only'`) | Yes | No |
| `NEXT_PUBLIC_SITE_URL` | `src/components/auth/{SignInForm,SignUpForm,ForgotPasswordForm}.tsx` | Yes (`NEXT_PUBLIC_`) | Yes | No |
| `ANTHROPIC_API_KEY` | `src/app/api/chat/route.ts` | No (route handler, server-only) | **No** | No |
| `NEXT_RUNTIME` | `src/instrumentation.ts` | No (Next.js built-in, not user-set) | N/A | N/A |

## LIST A — Used in code, missing from `.env.example`

- **`ANTHROPIC_API_KEY`** — required by `/api/chat`. Without it the chat widget returns a generic 500 ("trouble connecting"). Should be in `.env.example` so new contributors and Vercel previews don't ship a broken widget.

## LIST B — In `.env.example` but never used

None. Every documented variable has at least one consumer.

## Alarm flags

- **`NEXT_PUBLIC_SUPABASE_ANON_KEY` referenced in `middleware.ts`** — fine in itself (anon key is meant to be public), but worth noting that middleware runs on every request and a misconfigured project could swap this for the service-role key. The non-null assertion (`!`) hides that footgun. Consider an explicit guard.
- **`NEXT_PUBLIC_SITE_URL` is used inside three `'use client'` files** — correct usage (it *is* a `NEXT_PUBLIC_` var), no leak. Flagging only because it's the only env var read from client components; any future addition of a non-public var here would be inlined into the JS bundle.
- **No non-`NEXT_PUBLIC_` var is read from a `'use client'` file.** `ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are both server-only; `admin.ts` even uses `import 'server-only'` as a build-time guard. Clean.
- **README documents zero environment variables.** A new contributor cloning the repo learns about env vars only by tripping over runtime errors. At minimum, the README should point at `.env.example` and explain the Supabase + Anthropic setup.
- **`SUPABASE_SERVICE_ROLE_KEY` is wired up but the resulting `getAdminClient()` is never called** anywhere in `src/`. The credential is loaded into Vercel for nothing today; either delete the helper or wire it into the inquiry/membership/newsletter writes that the schema is waiting on (see `02-schema-drift.md`).
