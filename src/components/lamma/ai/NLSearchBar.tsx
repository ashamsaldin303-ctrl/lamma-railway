'use client';

import { useState } from 'react';
import { Search, Sparkles, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface Props {
  onFiltersApplied: (filters: {
    topics: string[];
    formats: string[];
    priceRange: 'free' | 'paid' | 'all';
    keywords: string[];
  }) => void;
}

/** Natural language search bar — sends query to AI API, applies returned filters. */
export function NLSearchBar({ onFiltersApplied }: Props) {
  const t = useTranslations('ai');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (data.success) {
        onFiltersApplied(data.filters);
        setActive(true);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setQuery('');
    setActive(false);
    onFiltersApplied({ topics: [], formats: [], priceRange: 'all', keywords: [] });
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute top-1/2 size-4 -translate-y-1/2 text-clay start-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('nlSearchPlaceholder')}
            className="border-clay/30 bg-paper ps-9 pe-9"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {active && (
            <button
              onClick={clear}
              className="absolute top-1/2 -translate-y-1/2 text-stone hover:text-error end-3"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-clay text-paper hover:bg-clay/90"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        </Button>
      </div>
      <p className="mt-1.5 flex items-center gap-1 text-xs text-stone">
        <Sparkles className="size-3" />
        {t('nlSearchHint')}
      </p>
    </div>
  );
}
