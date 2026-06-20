'use client';
import { cn } from '@/lib/utils';

export function MatchScoreRing({ score, size = 'md', showLabel = true, label }: { score: number; size?: 'sm'|'md'|'lg'; showLabel?: boolean; label?: string }) {
  const dims = { sm: { box: 48, stroke: 4, font: 'text-xs' }, md: { box: 80, stroke: 6, font: 'text-base' }, lg: { box: 120, stroke: 8, font: 'text-2xl' } };
  const { box, stroke, font } = dims[size];
  const r = (box - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? '#4A7C59' : score >= 65 ? '#E8A93C' : '#8B8478';
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} className="-rotate-90">
          <circle cx={box/2} cy={box/2} r={r} fill="none" stroke="#F4EDE0" strokeWidth={stroke} />
          <circle cx={box/2} cy={box/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-display font-semibold tabular', font)} style={{ color }}>{score}</span>
        </div>
      </div>
      {showLabel && label && <span className="text-xs text-stone">{label}</span>}
    </div>
  );
}
