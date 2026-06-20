'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { type Topic } from '@/data/types';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function TopicCard({ topic, gatheringsCount, lettersCount, className }: { topic: Topic; gatheringsCount: number; lettersCount: number; className?: string }) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('topics');
  const name = topic.name[locale];
  return (
    <Link href={`/topics/${topic.slug}`} className={cn('group block overflow-hidden rounded-2xl bg-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]', className)} aria-label={name}>
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image src={topic.coverImageUrl} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute top-4 start-4"><span className="block h-1 w-8 rounded-full" style={{ backgroundColor: topic.color }} /></div>
        <div className="absolute inset-x-0 bottom-0 p-5"><h3 className="mb-2 font-display text-2xl font-semibold text-paper">{name}</h3><p className="line-clamp-2 text-sm text-paper/80">{topic.description[locale]}</p></div>
      </div>
      <div className="flex items-center justify-between p-4 text-xs text-stone tabular"><span>{gatheringsCount} {t('gatheringsCount')}</span><span>{lettersCount} {t('lettersCount')}</span></div>
    </Link>
  );
}
