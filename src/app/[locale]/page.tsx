import { setRequestLocale } from 'next-intl/server'
import { applyListingLocale, getTrendingListings } from '@/lib/listings'
import SiteHeader from '@/components/sections/SiteHeader'
import Hero from '@/components/sections/Hero'
import TrendingHotspots from '@/components/sections/TrendingHotspots'
import ValueProps from '@/components/marketing/ValueProps'
import BuySellSplit from '@/components/sections/BuySellSplit'
import PricingReframe from '@/components/sections/PricingReframe'
import StatsBand from '@/components/sections/StatsBand'
import Subscribe from '@/components/sections/Subscribe'
import SiteFooter from '@/components/sections/SiteFooter'

type Params = Promise<{ locale: string }>

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const rawTrending = await getTrendingListings(4)
  const trending = rawTrending.map((r) => applyListingLocale(r, locale))
  return (
    <main className="space-y-24 md:space-y-32">
      <SiteHeader />
      <Hero />
      <TrendingHotspots listings={trending} />
      <ValueProps />
      <BuySellSplit />
      <PricingReframe />
      <StatsBand />
      <Subscribe />
      <SiteFooter />
    </main>
  )
}
