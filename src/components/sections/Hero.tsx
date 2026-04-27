import HeroSearch from '@/components/marketing/HeroSearch'

export default function Hero({ headline, italicWord, subhead }: { headline: string; italicWord: string; subhead: string }) {
  const words = headline.split(' ')
  const italicIdx = words.findIndex(w => w.toLowerCase().includes(italicWord.toLowerCase()))

  return (
    <section className="pt-16 pb-20 px-4 text-center">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <h1 className="font-medium leading-[1.1] tracking-[-0.01em] mb-6"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.75rem, 7vw, 6.25rem)', color: '#000' }}>
          {words.map((word, i) => (
            <span key={i}>{i === italicIdx ? <em style={{ fontStyle: 'italic' }}>{word}</em> : word}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </h1>
        <p className="font-medium mb-12 mx-auto" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)', maxWidth: '900px', color: '#000' }}>
          {subhead}
        </p>
        <HeroSearch submitLabel="Find A Seat →" />
      </div>
    </section>
  )
}
