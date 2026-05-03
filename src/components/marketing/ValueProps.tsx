import { useTranslations, useMessages } from 'next-intl'
import { Link } from '@/i18n/navigation'

type Plate = { title: string; body: string; cta: string; href: string }

type Props =
  | { headingKey?: string; heading?: undefined; plates?: undefined }
  | { headingKey?: undefined; heading: string; plates: Plate[] }

// ValueProps reads its content from one of two sources:
//   1. translations (default: home.valueProps) — used on the homepage
//   2. explicit heading + plates props — used by /sell while that page
//      hasn't been migrated to translations yet (PR2 swaps it over).
export default function ValueProps(props: Props = {}) {
  const headingKey = 'headingKey' in props && props.headingKey ? props.headingKey : 'home.valueProps'
  const useExplicit = 'heading' in props && props.heading !== undefined
  // Hooks must be called unconditionally; no-op when explicit props
  // override.
  const t = useTranslations(headingKey)
  const messages = useMessages() as Record<string, unknown>

  let heading: string
  let plates: Plate[]
  if (useExplicit) {
    heading = props.heading!
    plates = props.plates!
  } else {
    heading = t('heading')
    const node = headingKey.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, messages)
    plates = (node && typeof node === 'object' && 'items' in node ? (node as { items: Plate[] }).items : []) as Plate[]
  }

  return (
    <section className="pb-24">
      <div className="mx-auto px-4" style={{ maxWidth: '1540px' }}>
        <h2
          className="font-display font-medium tracking-[-0.01em] mb-10"
          style={{ fontSize: '60px', lineHeight: '1.1' }}
        >
          {heading}
        </h2>
      </div>
      {/* Single horizontal row, never stacks. Bleeds the scroll
          container to the page edges via -mx + matching px so the
          first/last cards align with the heading column above and
          subsequent cards extend off-screen until the user scrolls. */}
      <div
        className="overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-[calc((100vw-1540px)/2+1rem)]"
      >
        <div className="flex gap-6 px-4 sm:px-6 lg:px-[calc((100vw-1540px)/2+1rem)] pb-2">
          {plates.map((plate) => (
            <div
              key={plate.title}
              className="rounded-[35px] p-7 flex flex-col border-[3px] border-black/75 min-h-[320px] snap-start flex-shrink-0 w-[80vw] sm:w-[360px]"
              style={{ background: 'var(--color-brand)' }}
            >
              <h3 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.1' }}>
                {plate.title}
              </h3>
              <p className="flex-1" style={{ fontSize: '1.0625rem', lineHeight: '1.625rem' }}>
                {plate.body}
              </p>
              <Link
                href={plate.href}
                className="mt-4 self-start font-semibold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
                style={{ fontSize: '1.125rem' }}
              >
                {plate.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
