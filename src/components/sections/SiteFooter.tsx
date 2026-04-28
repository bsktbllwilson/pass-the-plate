import Image from 'next/image'
import type { FooterColumn } from '@/lib/content'

export default function SiteFooter({ columns }: { columns: FooterColumn[] }) {
  return (
    <footer className="px-4 py-16" style={{ background: '#000', color: 'var(--color-cream-soft)' }}>
      <div className="mx-auto" style={{ maxWidth: '1540px' }}>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="flex-shrink-0">
            <a href="/">
              <Image src="/logo-passtheplate.png" alt="Pass The Plate" width={220} height={53} className="h-12 w-auto mb-8"
                style={{ filter: 'brightness(0) saturate(100%) invert(97%) sepia(6%) saturate(1350%) hue-rotate(2deg) brightness(99%) contrast(90%)' }} />
            </a>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium" style={{ background: 'var(--color-brand)', borderColor: 'var(--color-cream-soft)', color: '#fff' }}>
              English
              <svg width="12" height="7" viewBox="0 0 14 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,1 7,7 13,1"/></svg>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-10 flex-1">
            {columns.map((col) => (
              <div key={col.heading} className="flex-1">
                <h3 className="font-body text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">{col.heading}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}><a href={link.href} className="font-body text-lg font-medium opacity-90 hover:opacity-60 transition-opacity leading-10">{link.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="font-body mt-12 pt-6 border-t border-white/10 text-sm opacity-40">© {new Date().getFullYear()} Pass The Plate. All rights reserved.</div>
      </div>
    </footer>
  )
}
