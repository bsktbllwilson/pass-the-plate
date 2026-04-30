import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations, useMessages } from 'next-intl'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import StatsBand from '@/components/sections/StatsBand'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

const PRESS = ['World Journal', 'Korea Times', 'The Real Deal', 'Eater NY', 'TechCrunch']

type TeamMember = { name: string; role: string; bio: string }

function AboutHero() {
  const t = useTranslations('about')
  return (
    <section className="px-4 py-24 text-center">
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <h1 className="font-display font-medium tracking-[-0.02em] mb-6" style={{ fontSize: '3.875rem', lineHeight: '1' }}>
          {t('heroH1')}
        </h1>
        <p className="mx-auto" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: '1.55', color: 'rgba(0,0,0,0.65)', maxWidth: '640px' }}>
          {t('heroSubhead')}
        </p>
      </div>
    </section>
  )
}

function MissionSection() {
  const t = useTranslations('about.mission')
  return (
    <section className="px-4 py-24">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 lg:gap-16 items-center" style={{ maxWidth: '1280px' }}>
        <div className="lg:col-span-7">
          <h2 className="font-display font-medium tracking-[-0.01em] mb-8" style={{ fontSize: '2.1875rem', lineHeight: '1.1' }}>
            {t('heading')}
          </h2>
          <div className="space-y-6" style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.78)' }}>
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
            <p>{t('p3')}</p>
          </div>
        </div>
        <div className="lg:col-span-5 mt-12 lg:mt-0">
          <div className="relative mx-auto" style={{ maxWidth: '380px', height: '560px' }}>
            <div className="absolute left-0 top-0 rounded-2xl overflow-hidden border-8 border-white shadow-xl" style={{ width: '280px', height: '360px', transform: 'rotate(-3deg)' }}>
              <Image src="/images/brand/dessert.JPG" alt="Dessert" fill sizes="280px" className="object-cover" />
            </div>
            <div className="absolute right-0 top-32 rounded-2xl overflow-hidden border-8 border-white shadow-xl" style={{ width: '280px', height: '360px', transform: 'rotate(2deg)' }}>
              <Image src="/images/brand/girsl.JPG" alt="Owners" fill sizes="280px" className="object-cover" />
            </div>
            <div className="absolute left-4 top-64 rounded-2xl overflow-hidden border-8 border-white shadow-xl" style={{ width: '280px', height: '360px', transform: 'rotate(-1deg)' }}>
              <Image src="/images/brand/IMG_2672.JPG" alt="Family table" fill sizes="280px" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const t = useTranslations('about.team')
  const messages = useMessages() as { about?: { team?: { members?: TeamMember[] } } }
  const members = messages?.about?.team?.members ?? []
  return (
    <section id="trust" className="px-4 py-24">
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <h2 className="font-display font-medium tracking-[-0.01em] mb-12 text-center" style={{ fontSize: '2.1875rem' }}>
          {t('heading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map(member => (
            <article key={member.name} className="flex flex-col">
              <div className="aspect-square rounded-2xl mb-5" style={{ background: 'rgb(229,231,235)' }} aria-hidden />
              <h3 className="font-display font-medium tracking-[-0.01em]" style={{ fontSize: '1.5rem' }}>
                {member.name}
              </h3>
              <div className="text-black/55 mb-3" style={{ fontSize: '0.95rem' }}>{member.role}</div>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'rgba(0,0,0,0.72)' }}>
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PressSection() {
  const t = useTranslations('about.press')
  return (
    <section className="px-4 py-16">
      <div className="mx-auto text-center" style={{ maxWidth: '1100px' }}>
        <div className="text-xs uppercase tracking-widest mb-8" style={{ color: 'rgba(0,0,0,0.45)' }}>
          {t('heading')}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {PRESS.map(name => (
            <span
              key={name}
              className="font-display uppercase tracking-wide"
              style={{ fontSize: '1.25rem', color: '#6B6B6B' }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />
      <AboutHero />
      <MissionSection />
      <StatsBand />
      <TeamSection />
      <PressSection />
      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter />
    </main>
  )
}
