import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '@/components/widget/ChatWidget'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.passtheplate.store'
const SITE_NAME = 'Pass The Plate'
const DEFAULT_TITLE = 'Pass The Plate — Marketplace for Asian F&B Businesses'
const DEFAULT_DESCRIPTION = 'The marketplace where Asian restaurant owners sell to vetted SBA, EB-5, and search-fund buyers — no upfront fees, ever.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s — Pass The Plate',
  },
  description: DEFAULT_DESCRIPTION,
  verification: {
    google: 'ZVQbgYvhlJkcahWyGPYB077MpeFVYMrNQE-VrYZYkc4',
  },
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    url: '/',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  // WeChat in-app browser reads OG tags for shared cards but also honors
  // the legacy wxcard:* and itemprop="*" namespaces. Adding both belt-
  // and-suspenders so links pasted into WeChat render with the correct
  // title and summary instead of falling back to the URL path.
  // Naver Whale and KakaoTalk use standard OG tags — covered above.
  other: {
    'wxcard:title': DEFAULT_TITLE,
    'wxcard:summary': DEFAULT_DESCRIPTION,
    'itemprop:name': DEFAULT_TITLE,
    'itemprop:description': DEFAULT_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/cub1hgl.css" />
      </head>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
