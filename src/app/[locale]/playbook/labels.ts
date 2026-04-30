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
