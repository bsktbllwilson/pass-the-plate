// Backward-compat sync exports for /playbook and /playbook/[slug]
// pages. The English label table stays here so the [slug] chrome
// (untranslated until PR2b) keeps rendering. The index page uses
// translations directly via useTranslations.
export const CATEGORY_LABEL: Record<string, string> = {
  buying: 'Buying',
  selling: 'Selling',
  legal: 'Legal',
  visa_immigration: 'Visa & Immigration',
  market_entry: 'Market Entry',
  operations: 'Operations',
  finance: 'Finance',
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? category
}

export const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
