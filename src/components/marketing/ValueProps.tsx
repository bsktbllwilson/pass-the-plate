import type { PlateCard } from '@/lib/content'

export default function ValueProps({ heading, plates }: { heading: string; plates: PlateCard[] }) {
  return (
    <section className="px-4 pb-24">
      <div className="mx-auto" style={{ maxWidth: '1540px' }}>
        <h2 className="font-display font-medium tracking-[-0.01em] mb-10" style={{ fontSize: '3.875rem', lineHeight: '1.15' }}>{heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory xl:overflow-visible">
          {plates.map((plate) => (
            <div key={plate.title} className="rounded-[35px] p-7 flex flex-col border-[3px] border-black/75 min-h-[320px] snap-start" style={{ background: 'var(--color-brand)' }}>
              <h3 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.1' }}>{plate.title}</h3>
              <p className="flex-1" style={{ fontSize: '1.0625rem', lineHeight: '1.625rem' }}>{plate.body}</p>
              <a href={plate.href} className="mt-4 self-start font-semibold border-b border-black pb-0.5 hover:opacity-70 transition-opacity" style={{ fontSize: '1.125rem' }}>{plate.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
