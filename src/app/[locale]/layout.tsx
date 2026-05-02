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
        {/* Typekit JS loader (kit cub1hgl). Replaces the simpler
            <link rel="stylesheet"> approach so we get the wf-loading
            / wf-active / wf-inactive class hooks for FOUT control,
            plus a 3s timeout that flips html.wf-inactive if Typekit
            stalls. The IIFE injects the script tag asynchronously. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d){var config={kitId:'cub1hgl',scriptTimeout:3000,async:true},h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)})(document);`,
          }}
        />
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
