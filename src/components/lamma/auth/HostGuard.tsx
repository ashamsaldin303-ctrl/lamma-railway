'use client';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/lib/auth-store';
import { isUserHost } from '@/lib/host-helpers';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export function HostGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations('host');
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  if (!hasHydrated) return <div className="flex min-h-[60vh] items-center justify-center"><div className="size-8 animate-spin rounded-full border-2 border-clay border-t-transparent" /></div>;
  if (!isAuthenticated || !user || !isUserHost(user.id)) return (
    <div className="flex min-h-[60vh] items-center justify-center px-4"><div className="max-w-md text-center">
      <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-sand"><Lock className="size-8 text-clay" /></div>
      <h1 className="mb-3 font-display text-2xl font-semibold text-ink">{t('notHostTitle')}</h1><p className="mb-6 text-stone">{t('notHostDescription')}</p>
      <Button onClick={() => router.push('/dashboard')} className="bg-clay text-primary-foreground hover:bg-clay/90">{t('backToDashboard')}</Button><p className="mt-4 text-xs text-stone">{t('demoHint')}</p>
    </div></div>
  );
  return <>{children}</>;
}
