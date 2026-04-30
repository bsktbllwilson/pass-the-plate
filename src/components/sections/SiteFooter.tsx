import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

// Footer columns are defined here (locale-agnostic structure: hrefs +
// translation keys) instead of pulled from content/homepage.json so
// labels translate cleanly. The old cream "English" language picker
// is gone — language toggle now lives in the nav header.
const COLUMNS: { heading: 'marketplace' | 'resources' | 'company'; links: { key: string; href: string }[] }[] = [
  {
    heading: 'marketplace',
    links: [
      { key: 'buyBusiness', href: '/buy' },
      { key: 'sellBusiness', href: '/sell' },
    ],
  },
  {
    heading: 'resources',
    links: [
      { key: 'guides', href: '/playbook' },
      { key: 'addressBook', href: '/partners' },
    ],
  },
  {
    heading: 'company',
    links: [
      { key: 'about', href: '/about' },
      { key: 'member', href: '/membership' },
      { key: 'partner', href: '/partners/apply' },
      { key: 'contact', href: '/contact' },
    ],
  },
]

export default function SiteFooter() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()
  return (
    <footer className="px-4 py-16" style={{ background: '#000', color: 'var(--color-cream-soft)' }}>
      <div className="mx-auto" style={{ maxWidth: '1540px' }}>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/PTP_Logo_NavBar.png" alt="Pass The Plate" width={1486} height={170} className="h-6 w-auto mb-8" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-10 flex-1">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex-1">
                <h3 className="font-body text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">
                  {t(`columns.${col.heading}`)}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="font-body font-normal opacity-90 hover:opacity-60 transition-opacity leading-9"
                        style={{ fontSize: '15px' }}
                      >
                        {t(`links.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="font-body mt-12 pt-6 border-t border-white/10 text-sm opacity-40">
          {t('copyright', { year })}
        </div>
      </div>
    </footer>
  )
}
