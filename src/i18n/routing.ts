import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Lamma is bilingual: Arabic (default, RTL) and English (LTR).
 * `localePrefix: 'as-needed'` keeps the default locale (ar) at `/`
 * and serves English at `/en`. This satisfies the sandbox constraint
 * that the user-facing route is `/`.
 */
export const routing = defineRouting({
  locales: ['ar', 'en'] as const,
  defaultLocale: 'ar',
  localePrefix: 'as-needed',
  // Disable Accept-Language negotiation so `/` is ALWAYS Arabic and `/en`
  // is ALWAYS English — deterministic for the sandbox preview.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
