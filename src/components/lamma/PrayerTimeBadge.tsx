'use client';

import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Prayer-awareness badge — Phase 0 placeholder UI.
 * Shows the next prayer the gathering observes (default: Isha).
 * Real prayer-time logic arrives in Phase 2.
 */
export function PrayerTimeBadge({
  className,
  prayerKey = 'isha',
  time,
}: {
  className?: string;
  prayerKey?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  time?: string;
}) {
  const t = useTranslations('prayer');
  const label = t(prayerKey);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-teal ring-1 ring-teal/20 backdrop-blur',
        className,
      )}
      title={t('awareNote')}
    >
      <Clock className="h-3.5 w-3.5" aria-hidden />
      <span className="tabular">
        {label}
        {time ? ` · ${time}` : ''}
      </span>
    </span>
  );
}
