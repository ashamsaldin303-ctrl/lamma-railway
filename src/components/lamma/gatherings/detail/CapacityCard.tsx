'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { type Gathering } from '@/data/types';
import { Users, Clock, ListPlus } from 'lucide-react';

export function CapacityCard({ gathering, className }: { gathering: Gathering; className?: string }) {
  const t = useTranslations('gatherings');
  const approved = gathering.approvedAttendeesCount;
  const pending = gathering.pendingCount ?? 0;
  const waitlisted = gathering.waitlistedCount ?? 0;
  const approvedAttendees = gathering.approvedAttendees ?? [];
  const capacity = gathering.capacityMax;
  const fillPct = capacity > 0 ? Math.min(100, Math.round((approved / capacity) * 100)) : 0;
  const isFull = approved >= capacity;

  return (
    <section className={'rounded-2xl bg-card p-6 ring-1 ring-border/60 ' + (className ?? '')}>
      <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink"><Users className="size-4 text-clay" />{t('capacity')}</h3>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-sm"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />{t('approved')}</span><span className="tabular">{approved} / {capacity}</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-sand"><div className="h-full bg-success transition-all duration-500" style={{ width: `${fillPct}%` }} /></div>
        </div>
        {pending > 0 && (
          <div>
            <div className="mb-1 flex justify-between text-sm"><span className="flex items-center gap-1.5"><Clock className="size-3 text-saffron" />{t('pending')}</span><span className="tabular text-saffron">{pending}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-sand"><div className="h-full bg-saffron/60" style={{ width: `${Math.min(100, (pending / capacity) * 100)}%` }} /></div>
          </div>
        )}
        {waitlisted > 0 && (
          <div className="flex justify-between text-sm"><span className="flex items-center gap-1.5"><ListPlus className="size-3 text-stone" />{t('waitlisted')}</span><span className="tabular text-stone">{waitlisted}</span></div>
        )}
        {isFull && <p className="mt-2 text-xs text-saffron">{t('fullyBooked' as never) as string || 'مكتمل'}</p>}
      </div>
      {approvedAttendees.length > 0 && (
        <div className="mt-5 border-t border-stone/10 pt-4">
          <div className="flex flex-wrap gap-2">
            {approvedAttendees.slice(0, 8).map((a) => (
              <div key={a.id} className="relative size-9 overflow-hidden rounded-full bg-secondary ring-2 ring-paper" title={a.name}>
                <Image src={a.avatarUrl} alt={a.name} fill sizes="36px" className="object-cover" />
              </div>
            ))}
            {approved > 8 && <div className="flex size-9 items-center justify-center rounded-full bg-sand text-xs font-medium text-stone ring-2 ring-paper tabular">+{approved - 8}</div>}
          </div>
        </div>
      )}
    </section>
  );
}
