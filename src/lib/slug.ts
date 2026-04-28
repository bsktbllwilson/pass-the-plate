import 'server-only'

const RESERVED = new Set([
  'new',
  'edit',
  'preview',
  'draft',
])

/**
 * Convert any string to a URL-safe slug. Always returns at least one
 * non-empty character (falls back to a short timestamp if the input
 * is unusable).
 */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accent marks
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

  if (!base || RESERVED.has(base)) {
    return `listing-${Date.now().toString(36)}`
  }
  return base
}

/**
 * Find a unique slug for a new listing by checking existence with the
 * caller-supplied predicate. Caller MUST use a client that can see
 * EVERY listing regardless of status (i.e. service role / admin),
 * otherwise we'd dedupe only against the rows visible to the caller
 * and the DB unique constraint would still catch collisions but the
 * UX would be poor.
 *
 * Adds -2, -3, … up to 50 before falling back to a timestamp suffix.
 */
export async function generateUniqueSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(title)
  if (!(await exists(base))) return base

  for (let i = 2; i <= 50; i++) {
    const candidate = `${base}-${i}`
    if (!(await exists(candidate))) return candidate
  }
  return `${base}-${Date.now().toString(36)}`
}
