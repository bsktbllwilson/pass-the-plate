import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'

export const metadata: Metadata = {
  title: 'Verification — Pass The Plate',
  description: 'Buyer proof-of-funds verification for Pass The Plate.',
  robots: { index: false, follow: false },
}

export default async function VerifyPage() {
  await requireUser('/verify')

  return (
    <main style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
      <SiteHeader />
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto w-full max-w-2xl">
          <div className="font-body bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-8 py-10">
            <h1 className="font-display font-medium tracking-[-0.01em] mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.1' }}>
              Proof of funds verification
            </h1>
            <p className="text-black/70 mb-8">Coming soon.</p>
            <Link href="/account" className="text-sm text-black/55 hover:text-black underline">← Back to account</Link>
          </div>
        </div>
      </section>
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
