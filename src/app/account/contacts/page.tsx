import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'

export const metadata: Metadata = {
  title: 'Saved Contacts — Pass The Plate',
  robots: { index: false, follow: false },
}

export default async function SavedContactsPage() {
  await requireUser('/account/contacts')

  return (
    <main style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
      <SiteHeader />
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto w-full max-w-2xl text-center">
          <h1
            className="font-display font-medium tracking-[-0.01em] mb-4"
            style={{ fontSize: '2.75rem', lineHeight: '1.1' }}
          >
            Saved Contacts
          </h1>
          <p className="font-body text-black/65 mb-8">
            Coming soon — your saved partners, advisors, and brokers will live here.
          </p>
          <Link href="/account" className="font-body text-sm underline">
            ← Back to account
          </Link>
        </div>
      </section>
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
