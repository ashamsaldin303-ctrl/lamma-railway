'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { type Host } from '@/data/types';
import { Link } from '@/i18n/routing';
import { BadgeCheck } from 'lucide-react';

export function DetailHostCard({ host, className }: { host: Host; className?: string }) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('hosts');
  const name = host.displayName[locale];
  return (
    <Link href={`/hosts/${host.handle.replace('@', '')}`} className={'block rounded-2xl bg-card p-6 ring-1 ring-border/60 transition-all hover:shadow-[var(--shadow-card)] ' + (className ?? '')}>
      <div className="flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-paper"><Image src={host.avatarUrl} alt={name} fill sizes="64px" className="object-cover" /></div>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><h3 className="truncate font-display text-lg font-semibold text-ink">{name}</h3>{host.isVerified && <BadgeCheck className="size-4 shrink-0 text-teal" />}</div><p className="text-xs text-stone">{host.handle}</p></div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm text-ink/70">{host.bio[locale]}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone"><span className="tabular">{host.totalGatherings} {t('gatheringsHosted')}</span><span className="tabular">★ {host.avgRating.toFixed(1)}</span><span>{t('responseTime')} {t('hours', { count: host.responseTimeHours })}</span></div>
    </Link>
  );
}
