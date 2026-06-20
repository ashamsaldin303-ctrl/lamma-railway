'use client';
import { useState, useMemo } from 'react';
import { gatherings } from '@/data/gatherings';
import { GatheringCard } from '@/components/lamma/GatheringCard';
import { NLSearchBar } from '@/components/lamma/ai/NLSearchBar';

export function GatheringsClient() {
  const [filters, setFilters] = useState<{ topics: string[]; formats: string[]; priceRange: string; keywords: string[] }>({ topics: [], formats: [], priceRange: 'all', keywords: [] });

  const filtered = useMemo(() => {
    return gatherings.filter((g) => {
      if (filters.topics.length && !filters.topics.includes(g.topicSlug)) return false;
      if (filters.formats.length && !filters.formats.includes(g.format)) return false;
      if (filters.priceRange === 'free' && !g.isFree) return false;
      if (filters.priceRange === 'paid' && g.isFree) return false;
      if (filters.keywords.length) {
        const hay = [g.title.ar, g.title.en, g.description.ar, g.description.en].join(' ').toLowerCase();
        if (!filters.keywords.some((k) => hay.includes(k.toLowerCase()))) return false;
      }
      return g.status !== 'CANCELLED';
    });
  }, [filters]);

  return (
    <div>
      <div className="mb-6"><NLSearchBar onFiltersApplied={setFilters} /></div>
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-paper/50 px-6 py-12 text-center text-sm text-stone">لا توجد لمات</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((g) => <GatheringCard key={g.slug} gathering={g} />)}</div>
      )}
    </div>
  );
}
