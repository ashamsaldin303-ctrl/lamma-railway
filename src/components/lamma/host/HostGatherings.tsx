'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/lib/auth-store';
import { useApplicationsStore } from '@/lib/applications-store';
import { getUserHost, getHostGatherings } from '@/lib/host-helpers';
import { StatusBadge } from '@/components/lamma/applications/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import { Calendar, MapPin, Users, Inbox, Plus } from 'lucide-react';

export function HostGatherings() {
  const t = useTranslations('host.gatherings');
  const tG = useTranslations('gatherings');
  const locale = useLocale() as 'ar' | 'en';
  const { user, hasHydrated } = useAuthStore();
  const { getByGathering } = useApplicationsStore();
  if (!hasHydrated || !user) return null;
  const host = getUserHost(user.id); if (!host) return null;
  const allGatherings = getHostGatherings(host.handle);
  return (
    <div>
      <header className="mb-6 flex items-center justify-between"><h1 className="font-display text-3xl font-semibold text-ink">{t('title')}</h1><Button asChild className="gap-1.5 bg-clay text-primary-foreground hover:bg-clay/90"><Link href="/dashboard/host/new"><Plus className="size-4" />{t('emptyCta')}</Link></Button></header>
      {allGatherings.length === 0 ? (<div className="rounded-2xl border border-dashed border-border bg-paper/50 px-6 py-16 text-center"><p className="text-sm text-stone">{t('empty')}</p><Button asChild className="mt-4 bg-clay text-primary-foreground hover:bg-clay/90"><Link href="/dashboard/host/new">{t('emptyCta')}</Link></Button></div>) : (
        <div className="space-y-4">{allGatherings.map((g) => { const apps = getByGathering(g.slug); const approved = apps.filter((a) => a.status === 'APPROVED').length; const fillPct = g.capacityMax > 0 ? Math.min(100, Math.round((approved / g.capacityMax) * 100)) : 0; return (
          <div key={g.slug} className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-border/60 sm:flex-row">
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:size-24 sm:aspect-square"><Image src={g.coverImageUrl} alt={g.title[locale]} fill sizes="96px" className="object-cover" /></div>
            <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="font-display text-base font-semibold text-ink">{g.title[locale]}</h3><StatusBadge status={g.status} size="sm" /></div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone"><span className="flex items-center gap-1"><Calendar className="size-3" />{formatDateTime(g.startDate, locale)}</span><span className="flex items-center gap-1"><MapPin className="size-3" />{g.venueName[locale]}</span></div>
              <div className="mt-2 flex items-center gap-3 text-xs text-stone tabular"><span className="flex items-center gap-1"><Inbox className="size-3" />{apps.length} {t('applications')}</span><span aria-hidden>·</span><span>{approved} {t('approved')}</span><span aria-hidden>·</span><span className="flex items-center gap-1"><Users className="size-3" />{fillPct}% {t('fill')}</span></div>
            </div>
            <div className="flex shrink-0 gap-2"><Button asChild variant="outline" size="sm"><Link href={`/dashboard/host/applications?gathering=${g.slug}`}>{t('viewApplications')}</Link></Button><Button asChild variant="ghost" size="sm"><Link href={`/gatherings/${g.slug}`}>{t('viewPublicPage')}</Link></Button></div>
          </div>); })}</div>)}
    </div>
  );
}
