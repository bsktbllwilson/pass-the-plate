'use client'
import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Input } from '@/components/ui'
import { subscribeNewsletter, type SubscribeState } from '@/app/actions/newsletter'

export default function SubscribeCard() {
  const t = useTranslations('playbook.subscribeCard')
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribeNewsletter, null)

  return (
    <article className="rounded-2xl overflow-hidden flex flex-col p-8" style={{ background: 'var(--color-yellow)' }}>
      {state?.ok ? (
        <div className="flex flex-col flex-1 justify-center">
          <h3 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.1' }}>
            {t('success')}
          </h3>
        </div>
      ) : (
        <>
          <h3 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.1' }}>
            {t('heading')}
          </h3>
          <p className="mb-5" style={{ fontSize: '1rem' }}>
            {t('subhead')}
          </p>
          <form action={action} className="mt-auto flex flex-col gap-3">
            <input type="hidden" name="source" value="playbook" />
            <Input
              type="email"
              name="email"
              required
              placeholder={t('placeholder')}
            />
            <Button type="submit" variant="dark" disabled={pending}>
              {pending ? t('submitting') : t('submit')}
            </Button>
            {state?.error && (
              <p className="font-body text-sm">{state.error}</p>
            )}
          </form>
        </>
      )}
    </article>
  )
}
