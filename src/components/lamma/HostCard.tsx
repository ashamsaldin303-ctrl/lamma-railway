'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { type Host } from '@/data/types';
import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Compact host card. TODO(Phase 1): link to host profile page.
 */
export function HostCard({ host, className }: { host: Host; className?: string }) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('hosts');
  const name = host.displayName[locale];
  const bio = host.bio[locale];

  return (
    <article
      className={cn(
        'group flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-border/60 transition-all hover:shadow-[var(--shadow-soft)]',
        className,
      )}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-paper">
        <Image
          src={host.avatarUrl}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-display text-base font-semibold text-ink">{name}</h3>
          {host.isVerified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-teal" aria-label={t('verified')} />
          )}
        </div>
        <p className="mt-0.5 text-xs text-stone">{host.handle}</p>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink/70">{bio}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone">
          <span className="tabular">{host.totalGatherings} {t('gatheringsHosted')}</span>
          <span aria-hidden>·</span>
          <span className="tabular">{host.totalAttendees} {t('totalAttendees')}</span>
          <span aria-hidden>·</span>
          <span className="tabular">★ {host.avgRating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}
