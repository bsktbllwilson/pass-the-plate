import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function WhoamiPage() {
  const user = await getCurrentUser()

  return (
    <main className="max-w-2xl mx-auto p-12" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.875rem' }}>
      {user ? (
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(
            {
              user_id: user.id,
              email: user.email,
              email_confirmed_at: user.email_confirmed_at,
              last_sign_in_at: user.last_sign_in_at,
              created_at: user.created_at,
            },
            null,
            2,
          )}
        </pre>
      ) : (
        <p className="text-black/55">Not signed in.</p>
      )}
    </main>
  )
}
