import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Locale-aware Link / useRouter / usePathname / redirect.
// Use these instead of next/link or next/navigation in any
// component that lives under app/[locale]/* so internal links
// preserve the active locale prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
