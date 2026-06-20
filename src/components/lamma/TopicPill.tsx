'use client';

import { useLocale } from 'next-intl';
import type { Topic } from '@/data/types';
import { cn } from '@/lib/utils';

/**
 * Colored pill representing an editorial topic.
 * The fill is a translucent tint of the topic color; the text uses the
 * full-strength color so it stays readable on the sand background.
 */
export function TopicPill({
  topic,
  className,
  size = 'sm',
}: {
  topic: Topic;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const locale = useLocale() as 'ar' | 'en';
  const name = topic.name[locale] ?? topic.name.ar;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
      style={{
        backgroundColor: `${topic.color}14`,
        color: topic.color,
        boxShadow: `inset 0 0 0 1px ${topic.color}33`,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: topic.color }}
      />
      {name}
    </span>
  );
}
