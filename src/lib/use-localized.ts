'use client';

import { useLocale } from 'next-intl';
import type { LocalizedString } from '@/data/types';

export function useLocalized() {
  const locale = useLocale() as 'ar' | 'en';
  return (obj: LocalizedString): string => obj[locale] ?? obj.ar;
}

/** Non-hook helper: pick the correct string given an explicit locale. */
export function localized(obj: LocalizedString, locale: 'ar' | 'en'): string {
  return obj[locale] ?? obj.ar;
}
