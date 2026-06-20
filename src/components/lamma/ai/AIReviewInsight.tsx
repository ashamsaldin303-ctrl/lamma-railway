'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  applicantId: string;
  gatheringSlug: string;
  locale: 'ar' | 'en';
}

/** AI insight card shown in the host's application review. */
export function AIReviewInsight({ applicantId, gatheringSlug, locale }: Props) {
  const t = useTranslations('ai');
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchInsight() {
      try {
        const res = await fetch('/api/v1/ai/review-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicantId, gatheringSlug, locale }),
        });
        const data = await res.json();
        if (!cancelled) setInsight(data.insight || null);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInsight();
    return () => {
      cancelled = true;
    };
  }, [applicantId, gatheringSlug, locale]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 text-xs text-stone">
        <Loader2 className="size-3 animate-spin" />
        {t('analyzingApplicant')}
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="flex items-start gap-2 rounded-r-lg border-s-2 border-clay bg-clay/5 p-3">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-clay" />
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-clay">{t('aiInsight')}</p>
        <p className="text-sm leading-relaxed text-ink/80">{insight}</p>
      </div>
    </div>
  );
}
