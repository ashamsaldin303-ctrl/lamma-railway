'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from './Container';
import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { AccountDropdown } from '@/components/lamma/auth/AccountDropdown';
import { LoginDialog } from '@/components/lamma/auth/LoginDialog';
import { NotificationBell } from '@/components/lamma/auth/NotificationBell';
import { useAuthStore } from '@/lib/auth-store';
import { isUserHost } from '@/lib/host-helpers';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { mainNav } from '@/data/navigation';
import { Menu } from 'lucide-react';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    const handler = () => setLoginOpen(true);
    window.addEventListener('lamma:show-login', handler);
    return () => window.removeEventListener('lamma:show-login', handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-paper/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {mainNav.map((item) => (
              <Link key={item.labelKey} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-secondary hover:text-ink">
                {t(item.labelKey.replace('nav.', '') as 'gatherings')}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            {hasHydrated && isAuthenticated && user && isUserHost(user.id) && <NotificationBell />}
            <AccountDropdown />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden" aria-label={t('openMenu')}><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="right" className="w-[18rem] bg-paper">
                <SheetHeader><SheetTitle className="text-start font-display text-xl text-ink">لَمَّة</SheetTitle></SheetHeader>
                <nav className="mt-6 flex flex-col gap-1 px-4" aria-label="Mobile primary">
                  {mainNav.map((item) => (<Link key={item.labelKey} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-secondary hover:text-ink">{t(item.labelKey.replace('nav.', '') as 'gatherings')}</Link>))}
                  <div className="my-3 h-px bg-border" />
                  <Link href="/dashboard/concierge" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base font-medium text-clay transition-colors hover:bg-secondary">{tAuth('dashboard')}</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
