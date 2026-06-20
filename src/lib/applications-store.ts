'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { seedApplications } from '@/data/seed-applications';
import { getUserHost, getHostGatherings } from '@/lib/host-helpers';

export const applicationStatusSchema = z.enum(['PENDING','APPROVED','REJECTED','WAITLISTED','ATTENDED','NO_SHOW','CANCELLED']);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

export const applicationSchema = z.object({
  id: z.string(), gatheringSlug: z.string(), gatheringTitle: z.string(), userId: z.string(), userEmail: z.string(), userName: z.string(),
  motivation: z.string().min(50), background: z.string().optional(), customAnswers: z.record(z.string(), z.string()).default({}),
  dietaryRestrictions: z.string().optional(), accessibilityNeeds: z.string().optional(),
  matchScore: z.number().min(0).max(100).optional(), status: applicationStatusSchema.default('PENDING'),
  reviewedAt: z.string().optional(), reviewedBy: z.string().optional(),
  statusHistory: z.array(z.object({ status: z.string(), timestamp: z.string(), note: z.string().optional() })).default([]),
  createdAt: z.string(), updatedAt: z.string(),
});
export type Application = z.infer<typeof applicationSchema>;
export type ApplicationInput = Omit<Application, 'id'|'createdAt'|'updatedAt'|'status'|'statusHistory'|'matchScore'>;

interface State {
  applications: Application[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  submit: (app: ApplicationInput) => Application;
  cancel: (id: string) => void;
  getByUser: (userId: string) => Application[];
  getByGathering: (slug: string) => Application[];
  getByHost: (userId: string) => Application[];
  getById: (id: string) => Application | undefined;
  hasApplied: (userId: string, slug: string) => boolean;
  updateStatus: (id: string, status: ApplicationStatus, reviewerId?: string) => void;
}

export const useApplicationsStore = create<State>()(
  persist(
    (set, get) => ({
      applications: [...seedApplications], hasHydrated: false, setHasHydrated: (v) => set({ hasHydrated: v }),
      submit: (app) => {
        const now = new Date().toISOString();
        const newApp: Application = { ...app, id: `app-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, status: 'PENDING', matchScore: 75, statusHistory: [{ status: 'PENDING', timestamp: now, note: 'received' }], createdAt: now, updatedAt: now };
        set((s) => ({ applications: [...s.applications, newApp] }));
        return newApp;
      },
      cancel: (id) => { const now = new Date().toISOString(); set((s) => ({ applications: s.applications.map((a) => a.id === id ? { ...a, status: 'CANCELLED' as ApplicationStatus, updatedAt: now, statusHistory: [...a.statusHistory, { status: 'CANCELLED', timestamp: now }] } : a) })); },
      getByUser: (userId) => get().applications.filter((a) => a.userId === userId && a.status !== 'CANCELLED'),
      getByGathering: (slug) => get().applications.filter((a) => a.gatheringSlug === slug && a.status !== 'CANCELLED'),
      getByHost: (userId) => { const host = getUserHost(userId); if (!host) return []; const slugs = getHostGatherings(host.handle).map((g) => g.slug); return get().applications.filter((a) => slugs.includes(a.gatheringSlug) && a.status !== 'CANCELLED'); },
      getById: (id) => get().applications.find((a) => a.id === id),
      hasApplied: (userId, slug) => get().applications.some((a) => a.userId === userId && a.gatheringSlug === slug && a.status !== 'CANCELLED'),
      updateStatus: (id, status, reviewerId) => { const now = new Date().toISOString(); set((s) => ({ applications: s.applications.map((a) => a.id === id ? { ...a, status, reviewedAt: now, reviewedBy: reviewerId, updatedAt: now, statusHistory: [...a.statusHistory, { status, timestamp: now }] } : a) })); },
    }),
    { name: 'lamma-applications', onRehydrateStorage: () => (s) => { s?.setHasHydrated(true); } },
  ),
);
