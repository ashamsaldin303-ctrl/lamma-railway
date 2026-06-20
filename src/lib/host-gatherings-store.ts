'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { localizedStringSchema, gatheringFormatSchema, gatheringStatusSchema } from '@/data/types';

const hostGatheringQuestionSchema = z.object({ ar: z.string().min(1), en: z.string().min(1) });

export const hostGatheringSchema = z.object({
  id: z.string(), slug: z.string(), hostHandle: z.string(),
  title: localizedStringSchema, description: localizedStringSchema,
  coverImageUrl: z.string(), galleryUrls: z.array(z.string()).default([]),
  startDate: z.string(), endDate: z.string(), isPrayerAware: z.boolean().default(true),
  venueName: localizedStringSchema, venueAddress: localizedStringSchema,
  venueLat: z.number().default(29.3759), venueLng: z.number().default(47.9774),
  venueNotes: localizedStringSchema.default({ ar: '', en: '' }),
  isLocationRevealed: z.boolean().default(true),
  format: gatheringFormatSchema,
  capacityMin: z.number().int().positive().default(5), capacityMax: z.number().int().positive().default(20),
  priceKwd: z.number().min(0).default(0), isFree: z.boolean().default(true),
  applicationQuestions: z.array(hostGatheringQuestionSchema).default([]),
  status: gatheringStatusSchema.default('DRAFT'),
  applicationsOpenAt: z.string(), applicationsCloseAt: z.string(),
  topicSlug: z.string(), approvedAttendeesCount: z.number().int().nonnegative().default(0),
  pendingCount: z.number().int().nonnegative().default(0), waitlistedCount: z.number().int().nonnegative().default(0),
  whoShouldAttend: z.array(localizedStringSchema).default([]), whatToExpect: z.array(localizedStringSchema).default([]),
  approvedAttendees: z.array(z.object({ id: z.string(), name: z.string(), avatarUrl: z.string() })).default([]),
  createdAt: z.string(),
});
export type HostGathering = z.infer<typeof hostGatheringSchema>;
/** Input type — fields with schema defaults become optional. */
export type HostGatheringInput = Omit<z.input<typeof hostGatheringSchema>, 'id' | 'createdAt' | 'status'>;

interface State { gatherings: HostGathering[]; hasHydrated: boolean; setHasHydrated: (v: boolean) => void; create: (data: HostGatheringInput) => HostGathering; }

export const useHostGatheringsStore = create<State>()(
  persist(
    (set) => ({
      gatherings: [], hasHydrated: false, setHasHydrated: (v) => set({ hasHydrated: v }),
      create: (data) => {
        const newG = hostGatheringSchema.parse({ ...data, id: `host-g-${Date.now()}`, status: 'DRAFT', createdAt: new Date().toISOString() });
        set((s) => ({ gatherings: [...s.gatherings, newG] }));
        return newG;
      },
    }),
    { name: 'lamma-host-gatherings', onRehydrateStorage: () => (s) => { s?.setHasHydrated(true); } },
  ),
);
