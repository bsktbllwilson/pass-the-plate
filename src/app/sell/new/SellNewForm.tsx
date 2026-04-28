'use client'

import Image from 'next/image'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Field, Input, Select, Textarea } from '@/components/ui'
import { uploadListingImage, deleteListingImage } from '@/lib/upload'
import { createListing, type CreateListingState } from './actions'

const INDUSTRIES: { value: string; label: string }[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'catering', label: 'Catering' },
]

const CUISINES: { value: string; label: string }[] = [
  { value: 'chinese', label: 'Chinese' },
  { value: 'korean', label: 'Korean' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'thai', label: 'Thai' },
  { value: 'pan_asian', label: 'Pan-Asian' },
  { value: 'other', label: 'Other' },
]

const ASSETS: { value: string; label: string }[] = [
  { value: 'walk-in cooler', label: 'Walk-in cooler' },
  { value: 'walk-in freezer', label: 'Walk-in freezer' },
  { value: 'liquor license', label: 'Liquor license' },
  { value: 'patio', label: 'Outdoor patio' },
  { value: 'POS', label: 'POS system' },
  { value: 'hood', label: 'Hood system' },
]

const GALLERY_MAX = 6

type UploadedImage = { url: string; path: string }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-black/10 p-6 sm:p-8 space-y-4">
      <h2 className="font-display font-medium" style={{ fontSize: '1.25rem' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function DollarHint() {
  return <span className="font-body text-sm text-black/45 ml-2">USD</span>
}

export default function SellNewForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState<CreateListingState, FormData>(
    createListing,
    null,
  )

  const [cover, setCover] = useState<UploadedImage | null>(null)
  const [gallery, setGallery] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState<'cover' | 'gallery' | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Form-level field error tracking — falls back to action-returned message.
  const errorMessage = uploadError ?? (state && !state.ok ? state.message : null)

  // On successful submit, redirect to /account so the seller sees their new
  // draft. revalidatePath in the action ensures fresh data.
  useEffect(() => {
    if (state?.ok) {
      router.push('/account?created=' + encodeURIComponent(state.slug))
    }
  }, [state, router])

  async function onCoverPick(file: File) {
    setUploadError(null)
    setUploading('cover')
    const result = await uploadListingImage(file, 'cover')
    setUploading(null)
    if (!result.ok) {
      setUploadError(result.error)
      return
    }
    // Replace any prior cover; orphan cleanup is best-effort.
    if (cover) void deleteListingImage(cover.path)
    setCover({ url: result.url, path: result.path })
  }

  async function onGalleryPick(files: FileList) {
    setUploadError(null)
    const remaining = GALLERY_MAX - gallery.length
    if (remaining <= 0) {
      setUploadError(`Gallery is full (max ${GALLERY_MAX} images).`)
      return
    }
    setUploading('gallery')
    const picks = Array.from(files).slice(0, remaining)
    const next: UploadedImage[] = []
    for (const file of picks) {
      const result = await uploadListingImage(file, 'gallery')
      if (!result.ok) {
        setUploadError(result.error)
        break
      }
      next.push({ url: result.url, path: result.path })
    }
    setUploading(null)
    if (next.length > 0) setGallery((g) => [...g, ...next])
  }

  function removeCover() {
    if (cover) void deleteListingImage(cover.path)
    setCover(null)
  }

  function removeGalleryAt(index: number) {
    const item = gallery[index]
    if (item) void deleteListingImage(item.path)
    setGallery((g) => g.filter((_, i) => i !== index))
  }

  const isBusy = pending || uploading !== null || state?.ok === true

  return (
    <form action={action} className="space-y-6">
      {/* Hidden image URL fields the server action picks up via formData. */}
      {cover && <input type="hidden" name="coverImageUrl" value={cover.url} />}
      {gallery.map((g) => (
        <input key={g.path} type="hidden" name="galleryUrls" value={g.url} />
      ))}

      <Section title="Basics">
        <Field label="Listing title" htmlFor="title" required>
          <Input id="title" name="title" type="text" required maxLength={120} placeholder="e.g. Family-run dumpling shop in Flushing" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Industry" htmlFor="industry" required>
            <Select id="industry" name="industry" required defaultValue="">
              <option value="" disabled>Choose…</option>
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Cuisine" htmlFor="cuisine" required>
            <Select id="cuisine" name="cuisine" required defaultValue="">
              <option value="" disabled>Choose…</option>
              {CUISINES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Location" htmlFor="location" required helper='(City, State — e.g. "Flushing, NY")'>
          <Input id="location" name="location" type="text" required maxLength={120} placeholder="Flushing, NY" />
        </Field>
        <Field label="Year established" htmlFor="yearEstablished">
          <Input id="yearEstablished" name="yearEstablished" type="number" min={1850} max={new Date().getUTCFullYear()} placeholder="(optional)" />
        </Field>
      </Section>

      <Section title="Financials">
        <Field label={<>Asking price <DollarHint /></>} htmlFor="askingPrice" required>
          <Input id="askingPrice" name="askingPrice" type="text" inputMode="decimal" required placeholder="450000" />
        </Field>
        <Field label={<>Annual revenue <DollarHint /></>} htmlFor="annualRevenue" required>
          <Input id="annualRevenue" name="annualRevenue" type="text" inputMode="decimal" required placeholder="800000" />
        </Field>
        <Field label={<>Annual profit <DollarHint /></>} htmlFor="annualProfit">
          <Input id="annualProfit" name="annualProfit" type="text" inputMode="decimal" placeholder="(optional)" />
        </Field>
      </Section>

      <Section title="Operations">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Staff count" htmlFor="staffCount">
            <Input id="staffCount" name="staffCount" type="number" min={0} max={10000} placeholder="(optional)" />
          </Field>
          <Field label="Square footage" htmlFor="squareFootage">
            <Input id="squareFootage" name="squareFootage" type="number" min={1} max={10_000_000} placeholder="(optional)" />
          </Field>
        </div>
        <fieldset className="pt-2">
          <legend className="font-body block text-sm font-medium mb-3">Assets included</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ASSETS.map((a) => (
              <label
                key={a.value}
                className="font-body flex items-center gap-3 px-4 py-3 rounded-lg border border-black/10 cursor-pointer hover:border-black/30 transition-colors"
              >
                <input
                  type="checkbox"
                  name="assets"
                  value={a.value}
                  className="w-4 h-4 accent-[var(--color-brand)]"
                />
                <span className="text-sm">{a.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </Section>

      <Section title="Description">
        <Field
          label="What makes this business special?"
          htmlFor="description"
          required
          helper="(100–8000 characters; markdown is fine)"
        >
          <Textarea
            id="description"
            name="description"
            rows={10}
            required
            minLength={100}
            maxLength={8000}
            placeholder="Story of the business, what's included, why you're selling, lease terms, customer base, neighborhood — buyers read this carefully."
          />
        </Field>
      </Section>

      <Section title="Photos">
        <p className="font-body text-sm text-black/55 -mt-1">
          Cover image shows up at the top of the listing. Gallery is optional but
          adds context. JPEG / PNG / WebP, up to 10 MB each.
        </p>

        {/* Cover */}
        <div>
          <div className="font-body block text-sm font-medium mb-2">Cover image</div>
          {cover ? (
            <div className="rounded-xl overflow-hidden border border-black/10 bg-black/5 relative">
              <div className="relative aspect-[16/9]">
                <Image src={cover.url} alt="" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-white">
                <span className="font-body text-sm text-black/55 truncate max-w-[60%]">{cover.path.split('/').pop()}</span>
                <button
                  type="button"
                  onClick={removeCover}
                  className="font-body text-sm underline text-black/55 hover:text-black"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label
              className="font-body block rounded-xl border border-dashed border-black/20 px-6 py-10 text-center cursor-pointer hover:border-black/40 transition-colors"
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void onCoverPick(file)
                  e.target.value = ''
                }}
                className="sr-only"
                disabled={isBusy}
              />
              <span className="block font-medium mb-1">Click to upload cover</span>
              <span className="block text-sm text-black/55">{uploading === 'cover' ? 'Uploading…' : 'JPEG / PNG / WebP, max 10 MB'}</span>
            </label>
          )}
        </div>

        {/* Gallery */}
        <div>
          <div className="font-body block text-sm font-medium mb-2">
            Gallery <span className="text-black/45 font-normal">({gallery.length} / {GALLERY_MAX})</span>
          </div>
          {gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {gallery.map((g, i) => (
                <div key={g.path} className="relative rounded-lg overflow-hidden border border-black/10 bg-black/5 aspect-square">
                  <Image src={g.url} alt="" fill sizes="(max-width: 640px) 50vw, 240px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryAt(i)}
                    className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/70 text-white text-sm hover:bg-black"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {gallery.length < GALLERY_MAX && (
            <label
              className="font-body block rounded-xl border border-dashed border-black/20 px-6 py-6 text-center cursor-pointer hover:border-black/40 transition-colors"
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) void onGalleryPick(e.target.files)
                  e.target.value = ''
                }}
                className="sr-only"
                disabled={isBusy}
              />
              <span className="block font-medium mb-1">Add gallery images</span>
              <span className="block text-sm text-black/55">{uploading === 'gallery' ? 'Uploading…' : `Up to ${GALLERY_MAX - gallery.length} more`}</span>
            </label>
          )}
        </div>
      </Section>

      {errorMessage && (
        <p className="font-body text-sm text-red-600 px-1">{errorMessage}</p>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <Button type="submit" disabled={isBusy} size="lg">
          {state?.ok ? 'Redirecting…' : pending ? 'Saving draft…' : 'Save Draft →'}
        </Button>
        <p className="font-body text-sm text-black/55">
          Drafts are private until our team reviews and publishes.
        </p>
      </div>
    </form>
  )
}
