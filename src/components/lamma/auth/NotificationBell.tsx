'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useNotificationsStore } from '@/lib/notifications-store';
import { localized } from '@/lib/use-localized';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, CheckCheck } from 'lucide-react';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const t = useTranslations('notifications');
  const locale = useLocale() as 'ar' | 'en';
  const { notifications, markAllRead, markRead, unreadCount, hasHydrated } = useNotificationsStore();
  const unread = hasHydrated ? unreadCount() : 0;
  const recent = notifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={t('title')}>
          <Bell className="size-4" />
          {unread > 0 && <span className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-clay text-[10px] font-bold text-paper tabular">{unread > 9 ? '9+' : unread}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2"><span className="text-sm font-medium">{t('title')}</span>{unread > 0 && <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-clay hover:underline"><CheckCheck className="size-3" />{t('markAllRead')}</button>}</div>
        <DropdownMenuSeparator />
        {recent.length === 0 ? <DropdownMenuItem disabled className="py-6 text-center text-sm text-stone">{t('empty')}</DropdownMenuItem> : recent.map((n) => (
          <DropdownMenuItem key={n.id} onClick={() => markRead(n.id)} className={cn('flex flex-col items-start gap-1 py-3', !n.isRead && 'bg-clay/5')}>
            <div className="flex w-full items-start justify-between gap-2"><span className={cn('text-sm font-medium', !n.isRead ? 'text-ink' : 'text-stone')}>{localized(n.title, locale)}</span>{!n.isRead && <span className="mt-1 size-2 shrink-0 rounded-full bg-clay" />}</div>
            <span className="text-xs text-stone">{localized(n.body, locale)}</span>
            <span className="text-[10px] text-stone/70">{formatRelative(n.createdAt, locale)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
