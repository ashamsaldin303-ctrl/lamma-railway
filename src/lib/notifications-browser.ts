'use client';
import { useEffect } from 'react';
import { useNotificationsStore } from './notifications-store';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function showBrowserNotification(title: string, body: string, icon?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: icon || '/icons/icon.svg', badge: '/icons/icon.svg', tag: 'lamma-notification' });
  } catch { /* silent */ }
}

export function useAutoNotifications() {
  const { notifications } = useNotificationsStore();
  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];
    if (!latest.isRead && 'Notification' in window && Notification.permission === 'granted') {
      showBrowserNotification(latest.title.ar, latest.body.ar);
    }
  }, [notifications]);
}
