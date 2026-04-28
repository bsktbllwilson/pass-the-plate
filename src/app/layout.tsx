import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '@/components/widget/ChatWidget'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.passtheplate.store'
const SITE_NAME = 'Pass The Plate'
const DEFAULT_TITLE = 'Pass The Plate — Marketplace for Asian F&B Businesses'
const DEFAULT_DESCRIPTION = 'The first marketplace for the $240B+ Asian F&B business transition.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s — Pass The Plate',
  },
  description: DEFAULT_DESCRIPTION,
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
