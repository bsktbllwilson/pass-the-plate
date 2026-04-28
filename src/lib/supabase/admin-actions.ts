// These functions run with full DB privileges. Only call from server components
// or server actions, never from client code.
import 'server-only'
import { getAdminClient } from '@/lib/supabase/admin'

export async function bumpListingViewCount(listingId: string): Promise<void> {
  try {
    const admin = getAdminClient()
    const { data, error: readErr } = await admin
      .from('listings')
      .select('view_count')
      .eq('id', listingId)
      .maybeSingle()
    if (readErr || !data) return
    const next = (data.view_count ?? 0) + 1
    await admin.from('listings').update({ view_count: next }).eq('id', listingId)
  } catch {
    // View-count failures must never break a page render.
  }
}
