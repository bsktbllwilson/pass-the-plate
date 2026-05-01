import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type Partner = Database['public']['Tables']['partners']['Row']

// Overlay manually-translated zh-CN bio / job title / company onto
// the canonical English fields when locale is 'zh'. Partners and
// playbook content are NOT auto-translated — copy is editorial and
// needs a native Mandarin reviewer pass. Manual translations land
// via SQL updates against the *_zh columns.
export function applyPartnerLocale<T extends Pick<Partner, 'job_title' | 'company' | 'bio' | 'job_title_zh' | 'company_zh' | 'bio_zh'>>(
  row: T,
  locale: string,
): T {
  if (locale !== 'zh') return row
  return {
    ...row,
    job_title: row.job_title_zh ?? row.job_title,
    company: row.company_zh ?? row.company,
    bio: row.bio_zh ?? row.bio,
  }
}

type GetPartnersOpts = {
  specialty?: string
  page?: number
  perPage?: number
}

export async function getPartners(opts: GetPartnersOpts = {}): Promise<{ rows: Partner[]; totalCount: number; totalPages: number }> {
  const { specialty, page = 1, perPage = 24 } = opts
  const supabase = await createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('partners')
    .select('*', { count: 'exact' })
    .eq('approved', true)
    .order('featured', { ascending: false })
    .order('full_name', { ascending: true })
    .range(from, to)

  if (specialty) query = query.eq('specialty', specialty)

  const { data, count, error } = await query
  if (error) {
    console.error('getPartners error:', error)
    return { rows: [], totalCount: 0, totalPages: 1 }
  }
  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  return { rows: data ?? [], totalCount, totalPages }
}

export async function getFeaturedPartners(limit = 4): Promise<Partner[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('approved', true)
    .eq('featured', true)
    .order('full_name', { ascending: true })
    .limit(limit)
  if (error) {
    console.error('getFeaturedPartners error:', error)
    return []
  }
  return data ?? []
}
