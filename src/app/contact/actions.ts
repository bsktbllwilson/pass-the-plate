'use server'

export type ContactState = { ok: boolean; message?: string } | null

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const payload = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    topic: String(formData.get('topic') ?? ''),
    message: String(formData.get('message') ?? ''),
  }
  console.log('Contact form submitted:', payload)
  return { ok: true }
}
