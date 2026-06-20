'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Lamma wordmark — "لَمَّة" in Arabic, "Lamma" in English.
 * A small clay dot sits beneath as the brand's only flourish.
 */
export function Logo({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <Link
      href="/"
      aria-label="Lamma"
      className={cn(
        'group inline-flex flex-col items-start leading-none transition-opacity hover:opacity-80',
        className,
      )}
    >
      <span className="font-display text-2xl font-semibold tracking-tight text-ink">
        {locale === 'ar' ? 'لَمَّة' : 'Lamma'}
      </span>
      <span
        aria-hidden
        className="mt-1 h-1 w-1 rounded-full bg-clay transition-all group-hover:h-1.5 group-hover:w-1.5"
      />
    </Link>
  );
}
