import data from '../../content/homepage.json'

export type PlateCard = { title: string; body: string; cta: string; href: string }
export type Stat = { value: string; label: string }
export type Partner = { name: string; logo: string }
export type FooterLink = { label: string; href: string }
export type FooterColumn = { heading: string; links: FooterLink[] }

export const content = data as {
  hero: { headline: string; italicWord: string; subhead: string }
  platesAreFull: PlateCard[]
  stats: Stat[]
  partners: Partner[]
  footer: { columns: FooterColumn[] }
}
