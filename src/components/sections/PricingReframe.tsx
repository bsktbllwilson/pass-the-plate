import { LinkButton } from '@/components/ui'

export default function PricingReframe() {
  return (
    <section className="px-4">
      <div
        className="mx-auto rounded-[35px] px-8 md:px-16 py-20 md:py-28 text-center"
        style={{ background: 'var(--color-yellow)', maxWidth: '1540px' }}
      >
        <p
          className="font-display font-medium tracking-[-0.01em] mx-auto"
          style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
            lineHeight: '1.15',
            color: '#000',
            maxWidth: '1100px',
          }}
        >
          We don&apos;t charge you to list.
          <br />
          We don&apos;t charge you to wait.
          <br />
          We charge when we deliver a closed deal —
          <br />
          <span style={{ fontStyle: 'italic' }}>
            because if we don&apos;t, why should you pay?
          </span>
        </p>
        <div className="mt-12">
          <LinkButton href="/sell" variant="dark" size="lg">
            List Your Business
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
