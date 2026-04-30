import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import '../globals.css'
import ChatWidget from '@/components/widget/ChatWidget'
import { routing, type Locale } from '@/i18n/routing'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.passtheplate.store'
const SITE_NAME = 'Pass The Plate'
const DEFAULT_TITLE = 'Pass The Plate — Marketplace for Asian F&B Businesses'
const DEFAULT_DESCRIPTION =
  'The marketplace where Asian restaurant owners sell to vetted SBA, EB-5, and search-fund buyers — no upfront fees, ever.'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
}

const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
}

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
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      'zh-CN': '/zh',
      'x-default': '/',
    },
  },
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Params = Promise<{ locale: string }>

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  // Mark this locale active for static rendering. Required by
  // next-intl whenever a layout / page is statically rendered.
  setRequestLocale(locale)

  return (
    <html lang={HTML_LANG[locale]}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/cub1hgl.css" />
        <meta property="og:locale" content={OG_LOCALE[locale]} />
        {locale === 'en' && <meta property="og:locale:alternate" content="zh_CN" />}
        {locale === 'zh' && <meta property="og:locale:alternate" content="en_US" />}
      </head>
      <body>
        <NextIntlClientProvider>
          {children}
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
