'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { type Gathering } from '@/data/types';
import { getTopic } from '@/data/topics';
import { getHost } from '@/data/hosts';
import { TopicPill } from './TopicPill';
import { PrayerTimeBadge } from './PrayerTimeBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, MapPin, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime, formatDate, formatKwd } from '@/lib/format';

/**
 * Gathering card — supports a large `featured` variant (used on the
 * homepage hero) and a compact `compact` variant (used in lists).
 *
 * TODO(Phase 1): wire the CTA to the gathering detail page + application flow.
 */
export function GatheringCard({
  gathering,
  variant = 'compact',
  className,
}: {
  gathering: Gathering;
  variant?: 'compact' | 'featured';
  className?: string;
}) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations();
  const tG = useTranslations('gatherings');
  const topic = getTopic(gathering.topicSlug);
  const host = getHost(gathering.hostHandle);

  const title = gathering.title[locale];
  const venue = gathering.venueName[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  const filled = gathering.approvedAttendeesCount;
  const total = gathering.capacityMax;
  const pct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;

  const priceLabel = gathering.isFree
    ? tG('free')
    : `${tG('priceFrom')} ${formatKwd(gathering.priceKwd, locale)} ${tG('kwd')}`;

  const statusLabel = t(`status.${gathering.status}` as 'APPLICATIONS_OPEN' | 'PUBLISHED' | 'COMPLETED');

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card text-card-foreground shadow-[var(--shadow-card)] ring-1 ring-border/60 transition-all hover:shadow-[0_12px_40px_rgba(26,22,20,0.12)]',
        variant === 'featured' && 'lg:flex',
        className,
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative overflow-hidden bg-secondary',
          variant === 'featured' ? 'aspect-[16/9] lg:aspect-auto lg:w-1/2' : 'aspect-[16/9]',
        )}
      >
        <Image
          src={gathering.coverImageUrl}
          alt={title}
          fill
          sizes={variant === 'featured' ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {topic && <TopicPill topic={topic} />}
          <span className="rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-medium text-paper backdrop-blur">
            {statusLabel}
          </span>
        </div>
        {gathering.isPrayerAware && (
          <div className="absolute inset-x-0 bottom-0 p-3">
            <PrayerTimeBadge />
          </div>
        )}
      </div>

      {/* Body */}
      <div className={cn('flex flex-col p-5', variant === 'featured' && 'lg:w-1/2 lg:p-8')}>
        {host && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone">
            {host.displayName[locale]}
          </p>
        )}
        <h3
          className={cn(
            'font-display font-semibold text-ink',
            variant === 'featured' ? 'text-2xl sm:text-3xl' : 'text-lg',
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            'mt-3 text-sm text-ink/70',
            variant === 'featured' ? 'line-clamp-4' : 'line-clamp-3',
          )}
        >
          {gathering.description[locale]}
        </p>

        {/* Meta */}
        <dl className="mt-4 grid grid-cols-1 gap-2 text-xs text-ink/70 sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-clay" />
            <dd>{formatDateTime(gathering.startDate, locale)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-clay" />
            <dd className="truncate">{venue}</dd>
          </div>
        </dl>

        {/* Capacity bar */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-stone">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {filled} / {total}
            </span>
            <span className="tabular">{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-ink">
            {priceLabel}
          </span>
          <Button
            size={variant === 'featured' ? 'default' : 'sm'}
            className="gap-1.5 bg-clay text-primary-foreground hover:bg-clay/90"
          >
            {tG('viewGathering')}
            <Arrow className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
