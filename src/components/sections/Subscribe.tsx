'use client'
import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui'
import { subscribeNewsletter, type SubscribeState } from '@/app/actions/newsletter'

export default function Subscribe() {
  const t = useTranslations('home.subscribe')
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribeNewsletter, null)

  return (
    <section className="px-4 pb-12">
      <div
        className="mx-auto rounded-[80px] px-8 md:px-16 py-16 flex flex-col md:flex-row items-center md:items-start gap-10"
        style={{ background: 'var(--color-brand)', maxWidth: '1540px' }}
      >
        <div className="flex-1">
          <h2
            className="font-display font-medium tracking-[-0.01em] mb-3"
            style={{ fontSize: '2.1875rem', lineHeight: '1.05', color: '#000' }}
          >
            {t('heading')}
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#000', lineHeight: '1.5' }}>
            {t('subhead')}
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-[480px]">
          {state?.ok ? (
            <div className="px-8 py-4 rounded-full text-center font-medium" style={{ background: '#000', color: 'var(--color-cream-soft)' }}>
              {t('success')}
            </div>
          ) : (
            <form action={action} className="flex gap-3 flex-col sm:flex-row">
              <input type="hidden" name="source" value="homepage_newsletter" />
              <input
                type="email"
                name="email"
                placeholder={t('placeholder')}
                required
                className="flex-1 rounded-full px-7 py-4 font-medium outline-none border border-gray-200"
                style={{ color: '#000', fontSize: '15px' }}
              />
              <Button type="submit" variant="dark" size="lg" shape="rounded" disabled={pending}>
                {pending ? t('submitting') : t('submit')}
              </Button>
            </form>
          )}
          {state?.error && (
            <p className="mt-3 text-sm font-medium" style={{ color: '#000' }}>
              {state.error}
            </p>
          )}
          <p className="mt-3 text-xs" style={{ color: 'rgba(0,0,0,0.7)' }}>
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}
