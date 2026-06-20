'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { type Letter } from '@/data/types';
import { getTopic } from '@/data/topics';
import { getHost } from '@/data/hosts';
import { TopicPill } from './TopicPill';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';

/**
 * Editorial letter card. TODO(Phase 1): link to the letter reader page.
 */
export function LetterCard({ letter, className }: { letter: Letter; className?: string }) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('letters');
  const topic = getTopic(letter.topicSlug);
  const host = getHost(letter.authorHostHandle);
  const title = letter.title[locale];
  const excerpt = letter.excerpt[locale];

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border/60 transition-all hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        <Image
          src={letter.coverImageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {topic && (
          <div className="absolute inset-x-0 top-0 p-3">
            <TopicPill topic={topic} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-stone">
          <Clock className="h-3.5 w-3.5" />
          <span className="tabular">{letter.readTimeMinutes} {t('minRead')}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(letter.publishedAt, locale)}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm italic text-stone">{letter.subtitle[locale]}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">{excerpt}</p>
        {host && (
          <p className="mt-4 text-xs font-medium text-stone">
            {t('byAuthor')} {host.displayName[locale]}
          </p>
        )}
      </div>
    </article>
  );
}
