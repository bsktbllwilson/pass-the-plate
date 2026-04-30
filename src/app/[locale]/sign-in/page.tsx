import { Suspense } from 'react'
import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'
import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign In — Pass The Plate',
  description: 'Sign in to your Pass The Plate account.',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  )
}
