'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Mail } from 'lucide-react';

/**
 * Newsletter signup — Phase 0 UI only (no backend wiring yet).
 * TODO(Phase 3): POST to /api/v1/newsletter/subscribe.
 */
export function NewsletterSignup() {
  const t = useTranslations('sections');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section id="newsletter" className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-clay">
          {t('newsletter')}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {t('newsletterTitle')}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
          {t('newsletterDesc')}
        </p>

        {done ? (
          <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success">
            <Check className="h-4 w-4" />
            {t('newsletterSuccess')}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-stone start-3" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="bg-card ps-9"
                aria-label={t('newsletterPlaceholder')}
              />
            </div>
            <Button type="submit" className="bg-clay text-primary-foreground hover:bg-clay/90">
              {t('newsletterSubscribe')}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
