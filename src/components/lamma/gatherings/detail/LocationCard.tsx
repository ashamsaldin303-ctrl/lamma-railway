'use client';
import { useLocale, useTranslations } from 'next-intl';
import { type Gathering } from '@/data/types';
import { MapPin, Navigation, Info, Lock } from 'lucide-react';

export function LocationCard({ gathering, className }: { gathering: Gathering; className?: string }) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations('gatherings');
  const px = 200 + ((gathering.venueLng - 47.5) / 1.0) * 120;
  const py = 150 - ((gathering.venueLat - 29.3) / 1.0) * 80;

  return (
    <section className={'overflow-hidden rounded-2xl bg-card ring-1 ring-border/60 ' + (className ?? '')}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {gathering.isLocationRevealed !== false ? (
          <svg viewBox="0 0 400 300" className="size-full" role="img" aria-label={t('mapPreview')}>
            <defs>
              <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#8B8478" strokeWidth="0.5" opacity="0.3" /></pattern>
              <radialGradient id="pinHalo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#B85C3E" stopOpacity="0.35" /><stop offset="100%" stopColor="#B85C3E" stopOpacity="0" /></radialGradient>
            </defs>
            <rect width="400" height="300" fill="#F4EDE0" /><rect width="400" height="300" fill="url(#mapGrid)" />
            <path d="M 50 150 Q 200 100, 350 200" stroke="#8B8478" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M 100 50 L 100 250" stroke="#8B8478" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M 250 30 L 250 270" stroke="#8B8478" strokeWidth="1" fill="none" opacity="0.4" />
            <rect x="120" y="80" width="40" height="50" fill="#8B8478" opacity="0.15" rx="2" /><rect x="180" y="170" width="50" height="40" fill="#8B8478" opacity="0.15" rx="2" /><rect x="270" y="60" width="35" height="45" fill="#8B8478" opacity="0.15" rx="2" />
            <g transform={`translate(${px}, ${py})`}>
              <circle r="28" fill="url(#pinHalo)" /><circle r="16" fill="#B85C3E" opacity="0.25" /><circle r="10" fill="#B85C3E" /><circle r="4" fill="#FBF8F2" />
            </g>
          </svg>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-sand"><MapPin className="mb-2 size-12 text-stone/40" /><p className="text-sm text-stone">{t('locationHidden')}</p></div>
        )}
        <div className="absolute bottom-2 end-2 rounded bg-paper/80 px-2 py-1 text-xs text-stone backdrop-blur">{t('mapPreview')}</div>
      </div>
      <div className="p-6">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink"><MapPin className="size-4 text-clay" />{gathering.venueName[locale]}</h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-stone"><Navigation className="mt-0.5 size-3.5 shrink-0" />{gathering.venueAddress[locale]}</p>
        <p className="mt-2 text-xs italic text-stone/80">{gathering.venueNotes[locale]}</p>
        {gathering.isLocationRevealed === false && <p className="mt-3 flex items-center gap-1.5 text-xs text-saffron"><Lock className="size-3.5" />{t('locationHidden')}</p>}
      </div>
    </section>
  );
}
