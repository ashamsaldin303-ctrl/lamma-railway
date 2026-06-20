'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GatheringCard } from '../GatheringCard';
import { LetterCard } from '../LetterCard';
import type { Gathering, Letter } from '@/data/types';
import { cn } from '@/lib/utils';

export function TopicTabs({
  upcoming,
  past,
  topicLetters,
}: {
  upcoming: Gathering[];
  past: Gathering[];
  topicLetters: Letter[];
}) {
  const t = useTranslations('topics');
  const [tab, setTab] = useState<'upcoming' | 'past' | 'letters'>('upcoming');

  const renderGatherings = (list: Gathering[]) => {
    if (list.length === 0) return <div className="rounded-2xl border border-dashed border-border bg-paper/50 px-6 py-12 text-center text-sm text-ink/70">{t('noGatherings')}</div>;
    return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((g) => <GatheringCard key={g.slug} gathering={g} />)}</div>;
  };

  const renderLetters = (list: Letter[]) => {
    if (list.length === 0) return <div className="rounded-2xl border border-dashed border-border bg-paper/50 px-6 py-12 text-center text-sm text-ink/70">{t('noLetters')}</div>;
    return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{list.map((x) => <LetterCard key={x.slug} letter={x} />)}</div>;
  };

  const tabs: Array<{ key: 'upcoming' | 'past' | 'letters'; label: string; count: number }> = [
    { key: 'upcoming', label: t('upcoming'), count: upcoming.length },
    { key: 'past', label: t('past'), count: past.length },
    { key: 'letters', label: t('letters'), count: topicLetters.length },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 inline-flex h-10 items-center justify-center rounded-lg bg-sand p-1">
        {tabs.map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)} className={cn('inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm transition-all', tab === tb.key ? 'bg-paper font-medium text-ink shadow-sm' : 'text-stone')}>
            {tb.label} ({tb.count})
          </button>
        ))}
      </div>
      {tab === 'upcoming' && renderGatherings(upcoming)}
      {tab === 'past' && renderGatherings(past)}
      {tab === 'letters' && renderLetters(topicLetters)}
    </div>
  );
}
