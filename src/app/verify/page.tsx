import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'

export const metadata: Metadata = {
  title: 'Verification — Pass The Plate',
}

export default async function VerifyPage() {
  await requireUser('/verify')

  return (
    <main style={{ background: '#F5EDDC', minHeight: '100vh' }}>
      <SiteHeader />
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-8 py-10" style={{ fontFamily: 'var(--font-body)' }}>
            <h1 className="font-medium tracking-[-0.01em] mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', lineHeight: '1.1' }}>
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
