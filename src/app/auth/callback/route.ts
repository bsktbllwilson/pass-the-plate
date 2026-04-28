import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/account'

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`)
  }

  let safeNext = '/account'
  try {
    const candidate = new URL(next, origin)
    if (candidate.origin === origin) {
      safeNext = candidate.pathname + candidate.search + candidate.hash
    }
  } catch {
    // malformed next param → fall through to /account
  }
  return NextResponse.redirect(`${origin}${safeNext}`)
}
