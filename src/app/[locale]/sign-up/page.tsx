import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'
import SignUpForm from '@/components/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Sign Up — Pass The Plate',
  description: 'Create a Pass The Plate account.',
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  )
}
