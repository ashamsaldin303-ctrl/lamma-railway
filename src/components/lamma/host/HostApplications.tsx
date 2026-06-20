'use client';
import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { useApplicationsStore } from '@/lib/applications-store';
import { getUserHost, getHostGatherings } from '@/lib/host-helpers';
import { localized } from '@/lib/use-localized';
import { ApplicationReviewCard } from '@/components/lamma/host/ApplicationReviewCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function HostApplications() {
  const t = useTranslations('host.applications');
  const locale = useLocale() as 'ar' | 'en';
  const sp = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const gatheringFilter = sp.get('gathering') ?? 'all';
  const { user, hasHydrated } = useAuthStore();
  const { getByHost } = useApplicationsStore();
  const setParam = (key: string, value: string | null) => { const params = new URLSearchParams(sp.toString()); if (!value || value === 'all') params.delete(key); else params.set(key, value); const qs = params.toString(); router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }); };
  const host = hasHydrated && user ? getUserHost(user.id) : null;
  const hostGatherings = host ? getHostGatherings(host.handle) : [];
  const allApps = hasHydrated && user ? getByHost(user.id) : [];
  const filtered = useMemo(() => { let list = allApps; if (gatheringFilter !== 'all') list = list.filter((a) => a.gatheringSlug === gatheringFilter); return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }, [allApps, gatheringFilter]);
  if (!hasHydrated || !user || !host) return null;
  return (
    <div>
      <header className="mb-6"><h1 className="font-display text-3xl font-semibold text-ink">{t('title')}</h1></header>
      <div className="mb-4 flex items-center gap-3"><span className="text-sm text-stone">{t('filterByGathering')}:</span><Select value={gatheringFilter} onValueChange={(v) => setParam('gathering', v)}><SelectTrigger className="w-[20rem] bg-card" size="sm"><SelectValue placeholder={t('allGatherings')} /></SelectTrigger><SelectContent><SelectItem value="all">{t('allGatherings')}</SelectItem>{hostGatherings.map((g) => <SelectItem key={g.slug} value={g.slug}>{localized(g.title, locale)}</SelectItem>)}</SelectContent></Select></div>
      {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-paper/50 px-6 py-16 text-center text-sm text-stone">{t('empty')}</div> : <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">{filtered.map((app) => <ApplicationReviewCard key={app.id} application={app} />)}</div>}
    </div>
  );
}
