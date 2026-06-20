'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface Props {
  endpoint: string;
  payload: Record<string, unknown>;
  onResult: (result: string) => void;
  label: string;
  variant?: 'default' | 'outline';
  /**
   * Optional custom extractor — receives the parsed JSON response and
   * returns the string to pass to onResult, or undefined to signal
   * "no result". Defaults to `data.result`.
   *
   * Use this when the endpoint returns a different shape, e.g.
   * `data.questions` (an array of strings joined with `\n\n`).
   */
  extract?: (data: Record<string, unknown>) => string | undefined;
}

/** Generic AI action button — calls an AI API endpoint and passes the result to onResult. */
export function AIActionButton({ endpoint, payload, onResult, label, variant = 'outline', extract }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = useTranslations('ai');

  const handleClick = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as Record<string, unknown>;

      const result = extract ? extract(data) : (typeof data.result === 'string' ? data.result : undefined);
      if (data.success && result) {
        onResult(result);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="border-clay text-clay hover:bg-clay/10"
    >
      {loading ? (
        <Loader2 className="me-1.5 size-3.5 animate-spin" />
      ) : success ? (
        <Check className="me-1.5 size-3.5 text-success" />
      ) : (
        <Sparkles className="me-1.5 size-3.5" />
      )}
      {loading ? t('generating') : success ? t('done') : label}
    </Button>
  );
}
