'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/lib/auth-store';
import { localized } from '@/lib/use-localized';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { LogOut, LayoutDashboard, LogIn, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { demoUsers } from '@/data/demo-users';

export function AccountDropdown() {
  const t = useTranslations('auth');
  const tNav = useTranslations('nav');
  const locale = useLocale() as 'ar' | 'en';
  const router = useRouter();
  const { user, isAuthenticated, logout, loginAs, hasHydrated } = useAuthStore();
  if (!hasHydrated || !isAuthenticated || !user) {
    return <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => window.dispatchEvent(new CustomEvent('lamma:show-login'))}><LogIn className="size-4" /><span className="hidden sm:inline">{t('login')}</span></Button>;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Avatar className="size-6"><AvatarImage src={user.avatarUrl} alt="" /><AvatarFallback>{localized(user.nameLocalized, locale).charAt(0)}</AvatarFallback></Avatar>
          <span className="hidden max-w-[8rem] truncate sm:inline">{localized(user.nameLocalized, locale).split(' ')[0]}</span>
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel><div className="flex flex-col"><span className="font-medium">{localized(user.nameLocalized, locale)}</span><span className="text-xs text-stone">{user.email}</span><span className="mt-1 text-xs text-clay">{t(`tiers.${user.membershipTier}` as 'NEWCOMER')}</span></div></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}><LayoutDashboard className="me-2 size-4" />{t('dashboard')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/matches')}><Sparkles className="me-2 size-4" />{tNav('matches')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/concierge')}><MessageSquare className="me-2 size-4" />{tNav('concierge')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-stone">{t('switchDemoUser')}</DropdownMenuLabel>
        {demoUsers.map((u) => <DropdownMenuItem key={u.id} onClick={() => loginAs(u.id)} disabled={u.id === user.id} className="text-xs">{t(`demoUsers.${u.id}` as 'user-noura')}</DropdownMenuItem>)}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { logout(); router.push('/'); }} className="text-error"><LogOut className="me-2 size-4" />{t('logout')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
