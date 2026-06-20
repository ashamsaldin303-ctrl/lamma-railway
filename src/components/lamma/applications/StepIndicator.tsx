'use client';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function StepIndicator({ current, total = 4, namespace = 'application_form' }: { current: number; total?: number; namespace?: string }) {
  const t = useTranslations(namespace);
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const isComplete = n < current;
        const isActive = n === current;
        return (
          <li key={n} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <span className={cn('flex size-9 items-center justify-center rounded-full border-2 text-sm font-medium tabular transition-all', isComplete && 'border-clay bg-clay text-primary-foreground', isActive && 'border-clay bg-clay/10 text-clay', !isComplete && !isActive && 'border-border bg-paper text-stone')}>
                {isComplete ? <Check className="size-4" /> : n}
              </span>
              <span className={cn('hidden text-xs font-medium sm:block', isActive ? 'text-clay' : isComplete ? 'text-ink' : 'text-stone')}>
                {t(`steps.${n}` as '1')}
              </span>
            </div>
            {n < total && <span className={cn('h-0.5 flex-1 rounded-full transition-colors', n < current ? 'bg-clay' : 'bg-border')} />}
          </li>
        );
      })}
    </ol>
  );
}
