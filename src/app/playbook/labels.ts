import type { PlaybookPost } from '@/lib/playbook'

export const CATEGORY_LABEL: Record<PlaybookPost['category'], string> = {
  buying: 'Buying',
  selling: 'Selling',
  legal: 'Legal',
  visa_immigration: 'Visa & Immigration',
  market_entry: 'Market Entry',
  operations: 'Operations',
  finance: 'Finance',
}

export const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
