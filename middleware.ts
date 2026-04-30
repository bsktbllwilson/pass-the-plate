import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// Locale-aware path checks: protected routes apply to BOTH /account and
// /zh/account. Strip the locale prefix before matching the path against
// the protected list.
const PROTECTED_PATHS = ["/account", "/verify", "/sell/new", "/sell/edit"];
const LOCALE_PREFIX_RE = new RegExp(
  `^/(${routing.locales.filter((l) => l !== routing.defaultLocale).join("|")})(?=/|$)`
);

function pathnameWithoutLocale(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX_RE, "") || "/";
}

function isProtectedPath(pathname: string): boolean {
  const normalized = pathnameWithoutLocale(pathname);
  return PROTECTED_PATHS.some(
    (p) => normalized === p || normalized.startsWith(`${p}/`)
  );
}

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Run the i18n middleware first so any locale rewriting / prefix
  // redirects happen before we look at auth. The returned response
  // carries the next-intl Set-Cookie headers we want to keep when we
  // chain Supabase below.
  const intlResponse = intlMiddleware(request);

  // If next-intl returned a redirect (e.g. /zh redirect when ZH is
  // disabled, or trailing-slash normalization), respect it without
  // running Supabase auth — we'd just redirect again to the same
  // place. This also makes the gate cheap when /zh is off.
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  let response = intlResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Preserve any headers next-intl already set (locale cookie,
          // x-default-locale, etc.) when we rebuild the response.
          response = NextResponse.next({ request });
          intlResponse.headers.forEach((value, key) => {
            response.headers.set(key, value);
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session first so getUser() reflects the latest state
  // and downstream pages see rotated tokens.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    // Preserve the locale prefix on the sign-in redirect.
    const localeMatch = request.nextUrl.pathname.match(LOCALE_PREFIX_RE);
    const localePrefix = localeMatch ? localeMatch[0] : "";
    url.pathname = `${localePrefix}/sign-in`;
    url.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
