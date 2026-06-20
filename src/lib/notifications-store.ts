'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'new_application' | 'application_cancelled' | 'gathering_published' | 'system';
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  isRead: boolean;
  createdAt: string;
}

interface State {
  notifications: Notification[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  add: (n: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  unreadCount: () => number;
}

const seed: Notification[] = [
  { id: 'notif-seed-1', type: 'new_application', title: { ar: 'طلب جديد', en: 'New application' }, body: { ar: 'سارة قدّمت طلباً', en: 'Sara applied' }, isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'notif-seed-2', type: 'new_application', title: { ar: 'طلب جديد', en: 'New application' }, body: { ar: 'نورة قدّمت طلباً', en: 'Noura applied' }, isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export const useNotificationsStore = create<State>()(
  persist(
    (set, get) => ({
      notifications: seed, hasHydrated: false, setHasHydrated: (v) => set({ hasHydrated: v }),
      add: (n) => set((s) => ({ notifications: [{ ...n, id: `notif-${Date.now()}`, isRead: false, createdAt: new Date().toISOString() }, ...s.notifications] })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })) })),
      markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)) })),
      unreadCount: () => get().notifications.filter((n) => !n.isRead).length,
    }),
    { name: 'lamma-notifications', onRehydrateStorage: () => (s) => { s?.setHasHydrated(true); } },
  ),
);
