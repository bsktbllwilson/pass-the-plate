'use client'
import { createClient } from '@/lib/supabase/client'

export const LISTING_IMAGES_BUCKET = 'listing-images'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export type UploadResult =
  | { ok: true; url: string; path: string }
  | { ok: false; error: string }

/**
 * Upload a single image to the `listing-images` bucket under the
 * caller's auth.uid() prefix. Returns the public URL on success;
 * relies on bucket-level RLS (migration 008) to reject mismatched
 * prefixes and unauthenticated uploads.
 *
 * Path shape: `{auth.uid()}/{section}/{timestamp}-{safeName}`.
 * Path scoping by uid is what the RLS policy keys on, so the
 * `section` segment is purely organizational (cover / gallery).
 */
export async function uploadListingImage(
  file: File,
  section: 'cover' | 'gallery',
): Promise<UploadResult> {
  if (file.size > MAX_BYTES) {
    return { ok: false, error: `Image is too large. Max ${MAX_BYTES / 1024 / 1024} MB.` }
  }
  if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
    return { ok: false, error: 'Image must be JPEG, PNG, or WebP.' }
  }

  const supabase = createClient()
  const { data: userResult, error: userError } = await supabase.auth.getUser()
  if (userError || !userResult.user) {
    return { ok: false, error: 'You must be signed in to upload.' }
  }
  const uid = userResult.user.id

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
  const path = `${uid}/${section}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    return { ok: false, error: uploadError.message }
  }

  const { data } = supabase.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(path)
  return { ok: true, url: data.publicUrl, path }
}

/**
 * Best-effort delete of an uploaded object — used by the form to
 * clean up after a failed listing INSERT so we don't leave orphan
 * objects in the bucket. Failures are swallowed; the seller can
 * retry the upload and the orphan can be reaped by an admin job.
 */
export async function deleteListingImage(path: string): Promise<void> {
  const supabase = createClient()
  await supabase.storage.from(LISTING_IMAGES_BUCKET).remove([path])
}
