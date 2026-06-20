'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { type Gathering } from '@/data/types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/lamma/applications/StatusBadge';
import { MatchScoreRing } from '@/components/lamma/matching/MatchScoreRing';
import { useAuthStore } from '@/lib/auth-store';
import { useApplicationsStore } from '@/lib/applications-store';
import { computeMatchScore } from '@/lib/matching/engine';
import { formatKwd, formatRelative } from '@/lib/format';
import { cn } from '@/lib/utils';
import { CheckCircle2, LogIn, Clock } from 'lucide-react';

export function ApplicationCTA({ gathering, className }: { gathering: Gathering; className?: string }) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('gatherings');
  const tM = useTranslations('matching');
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const { hasApplied, getByUser } = useApplicationsStore();

  const existingApp = hasHydrated && user ? getByUser(user.id).find((a) => a.gatheringSlug === gathering.slug) : undefined;
  const isClosed = gathering.status === 'APPLICATIONS_CLOSED' || new Date(gathering.applicationsCloseAt) < new Date();
  const matchScore = hasHydrated && isAuthenticated && user ? computeMatchScore(user, gathering) : null;
  const priceLabel = gathering.isFree ? t('free') : `${formatKwd(gathering.priceKwd, locale)} ${t('kwd')}`;

  const handleApply = () => {
    if (!hasHydrated) return;
    if (!isAuthenticated) { window.dispatchEvent(new CustomEvent('lamma:show-login')); return; }
    router.push(`/gatherings/apply/${gathering.slug}`);
  };

  return (
    <section className={cn('sticky top-24 rounded-2xl border border-clay/20 bg-paper p-6 shadow-[var(--shadow-soft)]', className)} aria-label={t('applyCta')}>
      <div className="mb-4 flex items-center justify-between">
        <div><p className="text-xs uppercase tracking-wider text-stone">{t('price')}</p><p className="font-display text-3xl font-semibold tabular text-ink">{priceLabel}</p></div>
        <StatusBadge status={gathering.status} size="sm" />
      </div>

      {hasHydrated && existingApp ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 p-3">
            <CheckCircle2 className="size-5 shrink-0 text-success" />
            <div><p className="text-sm font-medium text-success">{t('alreadyApplied')}</p><p className="text-xs text-stone">{t('applicationId')}: {existingApp.id.slice(-8)}</p></div>
          </div>
          <div className="flex items-center justify-between"><span className="text-sm text-stone">{t('currentStatus')}</span><StatusBadge status={existingApp.status} size="sm" /></div>
          <Button asChild variant="outline" className="w-full"><a href="/dashboard/applications">{t('viewInDashboard')}</a></Button>
        </div>
      ) : isClosed ? (
        <div className="space-y-3"><div className="rounded-lg border border-stone/20 bg-stone/10 p-3"><p className="text-sm text-stone">{t('applicationsClosed')}</p></div><Button disabled className="w-full bg-stone">{t('closed')}</Button></div>
      ) : (
        <>
          {hasHydrated && isAuthenticated && matchScore !== null && (
            <div className="mb-4 rounded-lg bg-sand p-4">
              <p className="mb-2 text-center text-xs text-stone">{tM('yourMatchScore')}</p>
              <div className="my-2 flex items-center justify-center"><MatchScoreRing score={matchScore} size="md" showLabel={false} /></div>
              <p className="text-center text-xs text-stone">{tM('matchScoreHint')}</p>
            </div>
          )}
          <Button size="lg" className="w-full gap-2 bg-clay text-primary-foreground hover:bg-clay/90" onClick={handleApply} disabled={!hasHydrated}>
            {hasHydrated && isAuthenticated ? t('applyCta') : <span className="flex items-center gap-2"><LogIn className="size-4" />{t('loginToApply')}</span>}
          </Button>
          <p className="mt-3 text-center text-xs text-stone">{t('applyNote')}</p>
          <p className="mt-2 text-center text-xs text-saffron">{t('applicationsCloseIn', { time: formatRelative(gathering.applicationsCloseAt, locale) })}</p>
        </>
      )}
    </section>
  );
}
