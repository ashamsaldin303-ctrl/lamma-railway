'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoUsers, type DemoUser } from '@/data/demo-users';

interface AuthState {
  user: DemoUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (email: string, password: string) => { success: boolean; error?: 'user-not-found' | 'wrong-password' };
  loginAs: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, isAuthenticated: false, hasHydrated: false, setHasHydrated: (v) => set({ hasHydrated: v }),
      login: (email, password) => {
        const user = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return { success: false, error: 'user-not-found' };
        if (password !== user.password) return { success: false, error: 'wrong-password' };
        set({ user, isAuthenticated: true });
        return { success: true };
      },
      loginAs: (userId) => { const user = demoUsers.find((u) => u.id === userId); if (user) set({ user, isAuthenticated: true }); },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'lamma-auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }), onRehydrateStorage: () => (s) => { s?.setHasHydrated(true); } },
  ),
);
