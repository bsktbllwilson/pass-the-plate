import { content } from '@/lib/content'
import { getTrendingListings } from '@/lib/listings'
import SiteHeader from '@/components/sections/SiteHeader'
import Hero from '@/components/sections/Hero'
import TrendingHotspots from '@/components/sections/TrendingHotspots'
import ValueProps from '@/components/marketing/ValueProps'
import BuySellSplit from '@/components/sections/BuySellSplit'
import StatsBand from '@/components/sections/StatsBand'
import PartnerLogos from '@/components/sections/PartnerLogos'
import Subscribe from '@/components/sections/Subscribe'
import SiteFooter from '@/components/sections/SiteFooter'

export default async function Home() {
  const trending = await getTrendingListings(4)
  return (
    <main>
      <SiteHeader />
      <Hero headline={content.hero.headline} italicWord={content.hero.italicWord} subhead={content.hero.subhead} />
      <TrendingHotspots listings={trending} />
      <ValueProps heading="Why Pass The Plate" plates={content.platesAreFull} />
      <BuySellSplit />
      <StatsBand stats={content.stats} />
      <PartnerLogos partners={content.partners} />
      <Subscribe />
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
