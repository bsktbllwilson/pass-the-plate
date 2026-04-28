import { content } from '@/lib/content'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
      <SiteHeader />
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-8 py-10">
            {children}
          </div>
        </div>
      </section>
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
