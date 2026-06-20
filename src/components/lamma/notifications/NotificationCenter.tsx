'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useNotificationsStore } from '@/lib/notifications-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, BellOff, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { requestNotificationPermission, showBrowserNotification } from '@/lib/notifications-browser';
import { localized } from '@/lib/use-localized';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const t = useTranslations('notifications');
  const locale = useLocale() as 'ar' | 'en';
  const { notifications, unreadCount, markAllRead, markRead } = useNotificationsStore();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const checkPermission = () => {
      if ('Notification' in window) setPermissionGranted(Notification.permission === 'granted');
    };
    checkPermission();
    const interval = setInterval(checkPermission, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEnableBrowser = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    if (granted) showBrowserNotification(t('enabled'), t('enabledBody'));
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="mb-1 font-display text-3xl font-semibold text-ink">{t('title')}</h1><p className="text-stone">{t('subtitle', { count: unreadCount() })}</p></div>
        {unreadCount() > 0 && <Button variant="outline" onClick={markAllRead}><CheckCheck className="me-2 size-4" />{t('markAllRead')}</Button>}
      </div>

      {!permissionGranted && (
        <Card className="mb-6 border-saffron/30 bg-sand/50 p-4">
          <div className="flex items-start gap-3"><Settings className="mt-0.5 size-5 shrink-0 text-saffron" /><div className="flex-1"><p className="mb-1 font-medium text-ink">{t('enableBrowserTitle')}</p><p className="mb-3 text-sm text-stone">{t('enableBrowserSubtitle')}</p><Button size="sm" onClick={handleEnableBrowser} className="bg-clay text-paper hover:bg-clay/90">{t('enableBrowser')}</Button></div></div>
        </Card>
      )}

      <div className="mb-4 inline-flex h-9 items-center rounded-lg bg-sand p-1">
        {(['all', 'unread'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('rounded-md px-3 py-1 text-sm transition-all', filter === f ? 'bg-paper text-ink shadow-sm' : 'text-stone')}>
            {t(`filters.${f}`)}
            {f === 'unread' && unreadCount() > 0 && <span className="ms-1.5 rounded-full bg-clay px-1.5 py-0.5 text-xs text-paper tabular">{unreadCount()}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center"><BellOff className="mx-auto mb-3 size-12 text-stone/30" /><p className="text-stone">{t('empty')}</p></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => (
            <Card key={notif.id} className={cn('cursor-pointer p-4 transition-shadow hover:shadow-md', !notif.isRead && 'border-s-4 border-clay')} onClick={() => markRead(notif.id)}>
              <div className="flex items-start gap-3">
                <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', notif.type === 'new_application' ? 'bg-clay/10' : notif.type === 'system' ? 'bg-stone/10' : 'bg-teal/10')}>
                  <Bell className={cn('size-5', notif.type === 'new_application' ? 'text-clay' : notif.type === 'system' ? 'text-stone' : 'text-teal')} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2"><p className="font-medium text-ink">{localized(notif.title, locale)}</p><span className="shrink-0 text-xs text-stone">{formatRelative(notif.createdAt, locale)}</span></div>
                  <p className="mt-1 text-sm text-stone">{localized(notif.body, locale)}</p>
                </div>
                {!notif.isRead && <span className="mt-2 size-2 shrink-0 rounded-full bg-clay" />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
