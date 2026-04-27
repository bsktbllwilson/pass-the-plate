import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type Listing = Database['public']['Tables']['listings']['Row']

export async function getTrendingListings(limit = 4): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('view_count', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getTrendingListings error:', error)
    return []
  }
  return data ?? []
}
