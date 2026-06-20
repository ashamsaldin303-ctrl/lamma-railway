'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/lib/auth-store';
import { useApplicationsStore, type ApplicationStatus } from '@/lib/applications-store';
import { gatheringsBySlug } from '@/data/gatherings';
import { StatusBadge } from '@/components/lamma/applications/StatusBadge';
import { Container } from '@/components/lamma/Container';
import { Button } from '@/components/ui/button';
import { localized } from '@/lib/use-localized';
import { formatRelative } from '@/lib/format';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

const FILTERS: Array<{ key: 'all' | ApplicationStatus; labelKey: string }> = [
  { key: 'all', labelKey: 'all' },
  { key: 'PENDING', labelKey: 'pending' },
  { key: 'APPROVED', labelKey: 'approved' },
  { key: 'WAITLISTED', labelKey: 'waitlisted' },
  { key: 'REJECTED', labelKey: 'rejected' },
];

export function ApplicationsList() {
  const t = useTranslations('dashboard');
  const tCard = useTranslations('application.card');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ar' | 'en';
  const { user, hasHydrated } = useAuthStore();
  const { getByUser } = useApplicationsStore();
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');

  const apps = useMemo(() => {
    if (!user) return [];
    const list = getByUser(user.id);
    const sorted = [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (filter === 'all') return sorted;
    return sorted.filter((a) => a.status === filter);
  }, [user, getByUser, filter]);

  const Sep = locale === 'ar' ? ChevronLeft : ChevronRight;

  if (!hasHydrated) {
    return (
      <Container className="py-8">
        <div className="size-8 animate-spin rounded-full border-2 border-clay border-t-transparent" />
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone">
        <Link href="/" className="hover:text-clay">
          {locale === 'ar' ? 'الرئيسية' : 'Home'}
        </Link>
        <Sep className="size-3" />
        <Link href="/dashboard" className="hover:text-clay">
          {t('breadcrumbs')}
        </Link>
        <Sep className="size-3" />
        <span className="text-ink">{t('applicationsTitle')}</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t('applicationsTitle')}</h1>
        <p className="mt-2 text-sm text-ink/70 sm:text-base">{t('applicationsSubtitle')}</p>
      </header>

      {/* Filter tabs (native buttons) */}
      <div className="mb-6 inline-flex h-10 flex-wrap items-center justify-center gap-1 rounded-lg bg-sand p-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm transition-all',
              filter === f.key ? 'bg-paper font-medium text-ink shadow-sm' : 'text-stone hover:text-ink',
            )}
          >
            {t(`statusFilter.${f.labelKey}` as 'statusFilter.all')}
          </button>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-paper/50 px-6 py-16 text-center">
          <Inbox className="mx-auto mb-3 size-8 text-stone" />
          <p className="text-sm text-stone">{t('applicationsEmpty')}</p>
          <Button asChild className="mt-4 bg-clay text-primary-foreground hover:bg-clay/90">
            <Link href="/gatherings">{t('applicationsBrowseCta')}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => {
            const g = gatheringsBySlug[app.gatheringSlug];
            const name = (() => {
              try {
                const parsed = JSON.parse(app.userName) as { ar?: string; en?: string };
                if (parsed && (parsed.ar || parsed.en)) return parsed[locale] ?? parsed.ar ?? parsed.en ?? app.userName;
              } catch {
                /* not JSON */
              }
              return app.userName;
            })();
            const gTitle = (() => {
              if (!g) return app.gatheringSlug;
              return g.title[locale];
            })();
            return (
              <Link
                key={app.id}
                href="/dashboard/applications"
                className="flex items-center gap-4 rounded-xl bg-card p-4 ring-1 ring-border/60 transition-all hover:shadow-[var(--shadow-soft)]"
              >
                {g && (
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image src={g.coverImageUrl} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-ink">{gTitle}</p>
                  <p className="mt-0.5 text-xs text-stone">
                    {tCard('appliedOn')} {formatRelative(app.createdAt, locale)}
                  </p>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}
