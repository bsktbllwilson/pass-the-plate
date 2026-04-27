export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const url = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('[supabase env] NEXT_PUBLIC_SUPABASE_URL:', url)
  console.log('[supabase env] NEXT_PUBLIC_SUPABASE_ANON_KEY:', anon)
  console.log('[supabase env] SUPABASE_SERVICE_ROLE_KEY:', service)

  if (!url || !anon || !service) {
    console.warn(
      '[supabase env] One or more required Supabase env vars are missing. Auth and admin operations will fail at runtime. Set them in .env.local (dev) and Vercel project settings (prod).',
    )
  }
}
