'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  letterSlug: string;
  content: string;
  title: string;
  locale: 'ar' | 'en';
}

export function LetterSummary({ letterSlug, content, title, locale }: Props) {
  const t = useTranslations('ai');
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSummary() {
      try {
        const res = await fetch('/api/v1/ai/summarize-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ letterSlug, content, title, locale }),
        });
        const data = await res.json();
        if (!cancelled) setSummary(data.summary || null);
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, [letterSlug, content, title, locale]);

  if (loading) {
    return (
      <div className="my-8 flex items-center gap-2 rounded-lg bg-sand p-4 text-sm text-stone">
        <Loader2 className="size-4 animate-spin" />
        {t('summarizing')}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="my-8 rounded-lg border-s-4 border-clay bg-sand/50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-clay" />
        <span className="text-xs font-medium uppercase tracking-wider text-clay">{t('aiSummary')}</span>
      </div>
      <p className="text-base italic leading-relaxed text-ink/80">{summary}</p>
    </div>
  );
}
