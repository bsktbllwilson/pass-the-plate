import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireUser(redirectTo?: string): Promise<User> {
  const user = await getCurrentUser()
  if (user) return user

  let next = redirectTo
  if (!next) {
    const headersList = await headers()
    next = headersList.get('x-pathname') ?? '/'
  }
  redirect(`/sign-in?next=${encodeURIComponent(next)}`)
}
