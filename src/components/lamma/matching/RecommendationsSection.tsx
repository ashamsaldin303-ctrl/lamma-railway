'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { useApplicationsStore } from '@/lib/applications-store';
import { recommendGatheringsForUser } from '@/lib/matching/engine';
import { GatheringCard } from '@/components/lamma/GatheringCard';
import { MatchScoreRing } from './MatchScoreRing';
import { Container } from '@/components/lamma/Container';
import { Sparkles } from 'lucide-react';
import { localized } from '@/lib/use-localized';

export function RecommendationsSection() {
  const t = useTranslations('matching');
  const locale = useLocale() as 'ar' | 'en';
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const { getByUser } = useApplicationsStore();
  if (!hasHydrated || !isAuthenticated || !user) return null;
  const applied = getByUser(user.id).map((a) => a.gatheringSlug);
  const recs = recommendGatheringsForUser(user, { limit: 3, excludeApplied: applied });
  if (recs.length === 0) return null;
  return (
    <section className="bg-paper py-16 sm:py-20">
      <Container>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="size-5 text-clay" />
          <span className="text-xs font-medium uppercase tracking-wider text-clay">{t('forYou')}</span>
        </div>
        <h2 className="mb-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{t('recommendedTitle', { name: localized(user.nameLocalized, locale).split(' ')[0] })}</h2>
        <p className="mb-8 max-w-2xl text-stone">{t('recommendedSubtitle')}</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recs.map(({ gathering, score }) => (
            <div key={gathering.slug} className="relative">
              <GatheringCard gathering={gathering} />
              <div className="absolute -top-3 -end-3 rounded-full bg-paper p-1 shadow-md"><MatchScoreRing score={score} size="sm" showLabel={false} /></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
