'use client';
import { useEffect, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';

export function RequireAuth({ children }: { children: ReactNode }) {
  const t = useTranslations('auth');
  const { isAuthenticated, hasHydrated } = useAuthStore();
  useEffect(() => { if (hasHydrated && !isAuthenticated) window.dispatchEvent(new CustomEvent('lamma:show-login')); }, [hasHydrated, isAuthenticated]);
  if (!hasHydrated) return <div className="flex min-h-[40vh] items-center justify-center"><div className="size-8 animate-spin rounded-full border-2 border-clay border-t-transparent" /></div>;
  if (!isAuthenticated) return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink">{t('loginTitle')}</h1>
        <p className="mb-6 text-stone">{t('loginSubtitle')}</p>
        <Button className="bg-clay text-primary-foreground hover:bg-clay/90" onClick={() => window.dispatchEvent(new CustomEvent('lamma:show-login'))}>{t('login')}</Button>
      </div>
    </div>
  );
  return <>{children}</>;
}
