'use client';
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const t = useTranslations('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const checkDismissed = () => {
      if (localStorage.getItem('lamma-install-dismissed') === 'true') setDismissed(true);
    };
    checkDismissed();
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') setDeferredPrompt(null);
  };
  const handleDismiss = () => { setDismissed(true); localStorage.setItem('lamma-install-dismissed', 'true'); };

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:end-4 sm:max-w-sm">
      <div className="flex items-center gap-3 rounded-lg border border-clay/20 bg-paper p-4 shadow-lg">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-clay/10"><Download className="size-5 text-clay" /></div>
        <div className="min-w-0 flex-1"><p className="text-sm font-medium text-ink">{t('installTitle')}</p><p className="text-xs text-stone">{t('installSubtitle')}</p></div>
        <Button size="sm" onClick={handleInstall} className="bg-clay text-paper hover:bg-clay/90">{t('install')}</Button>
        <button onClick={handleDismiss} className="text-stone hover:text-ink" aria-label={t('dismiss')}><X className="size-4" /></button>
      </div>
    </div>
  );
}
