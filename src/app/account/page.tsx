import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import SignOutButton from '@/components/auth/SignOutButton'

export const metadata: Metadata = {
  title: 'Account — Pass The Plate',
  description: 'Your Pass The Plate account dashboard.',
  robots: { index: false, follow: false },
}

export default async function AccountPage() {
  const user = await requireUser('/account')

  return (
    <main style={{ background: '#F5EDDC', minHeight: '100vh' }}>
      <SiteHeader />
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-8 py-10" style={{ fontFamily: 'var(--font-body)' }}>
            <h1 className="font-medium tracking-[-0.01em] mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', lineHeight: '1.1' }}>
              Account dashboard
            </h1>
            <p className="text-black/70 mb-2">Coming soon.</p>
            <p className="text-black/55 text-sm mb-8">You&apos;re signed in as <span className="text-black font-medium">{user.email}</span>.</p>

            <div className="flex flex-wrap gap-3 items-center">
              <SignOutButton />
              <Link href="/" className="text-sm text-black/55 hover:text-black underline">Back to home</Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
