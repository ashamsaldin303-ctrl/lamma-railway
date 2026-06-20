/**
 * Lamma — shared data types & Zod schemas for mock seed data.
 *
 * These types describe the editorial shape of the platform's content.
 * They are intentionally database-agnostic (the Prisma schema lives in
 * /prisma/schema.prisma and is adapted for SQLite). The mock data in
 * src/data/*.ts conforms to these types so that Phase 1+ can swap the
 * data source from static files to Prisma queries without changing
 * component APIs.
 */
import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Localized text                                                      */
/* ------------------------------------------------------------------ */

export const localizedStringSchema = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
});
export type LocalizedString = z.infer<typeof localizedStringSchema>;

/** Alias used by some modules. */
export const bilingualSchema = localizedStringSchema;
export type Bilingual = LocalizedString;

/* ------------------------------------------------------------------ */
/* Enums (validated as unions; stored as String in SQLite)            */
/* ------------------------------------------------------------------ */

export const gatheringFormatSchema = z.enum([
  'MEN_ONLY',
  'WOMEN_ONLY',
  'FAMILY',
  'MIXED',
]);
export type GatheringFormat = z.infer<typeof gatheringFormatSchema>;

export const gatheringStatusSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'APPLICATIONS_OPEN',
  'APPLICATIONS_CLOSED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);
export type GatheringStatus = z.infer<typeof gatheringStatusSchema>;

export const membershipTierSchema = z.enum([
  'NEWCOMER',
  'REGULAR',
  'CURATOR',
  'HOST',
]);
export type MembershipTier = z.infer<typeof membershipTierSchema>;

export const applicationStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'WAITLISTED',
  'CANCELLED',
]);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

/* ------------------------------------------------------------------ */
/* Topic                                                               */
/* ------------------------------------------------------------------ */

export const topicSchema = z.object({
  slug: z.string().min(1),
  name: localizedStringSchema,
  description: localizedStringSchema,
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  coverImageUrl: z.string().min(1),
});
export type Topic = z.infer<typeof topicSchema>;

/* ------------------------------------------------------------------ */
/* Host                                                                */
/* ------------------------------------------------------------------ */

export const hostSchema = z.object({
  handle: z.string().regex(/^@/),
  userId: z.string().optional(),
  displayName: localizedStringSchema,
  bio: localizedStringSchema,
  avatarUrl: z.string().min(1),
  coverUrl: z.string().min(1),
  isVerified: z.boolean(),
  verifiedAt: z.string().nullable(),
  specialties: z.array(localizedStringSchema),
  topicSlugs: z.array(z.string()),
  totalGatherings: z.number().int().nonnegative(),
  totalAttendees: z.number().int().nonnegative(),
  avgRating: z.number().min(0).max(5),
  responseTimeHours: z.number().int().nonnegative(),
  instagram: z.string().optional(),
});
export type Host = z.infer<typeof hostSchema>;

/* ------------------------------------------------------------------ */
/* Gathering                                                           */
/* ------------------------------------------------------------------ */

/** A reference to an approved attendee (used for capacity avatars). */
export const attendeeRefSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarUrl: z.string().min(1),
});
export type AttendeeRef = z.infer<typeof attendeeRefSchema>;

export const gatheringSchema = z.object({
  slug: z.string().min(1),
  title: localizedStringSchema,
  description: localizedStringSchema,
  coverImageUrl: z.string().min(1),
  galleryUrls: z.array(z.string()).min(1),
  startDate: z.string().min(1), // ISO
  endDate: z.string().min(1), // ISO
  isPrayerAware: z.boolean(),
  venueName: localizedStringSchema,
  venueAddress: localizedStringSchema,
  venueLat: z.number(),
  venueLng: z.number(),
  venueNotes: localizedStringSchema,
  format: gatheringFormatSchema,
  capacityMin: z.number().int().positive(),
  capacityMax: z.number().int().positive(),
  priceKwd: z.number().min(0), // KWD 3-decimal precision
  isFree: z.boolean(),
  applicationQuestions: z.array(localizedStringSchema),
  status: gatheringStatusSchema,
  applicationsOpenAt: z.string().min(1), // ISO
  applicationsCloseAt: z.string().min(1), // ISO
  topicSlug: z.string().min(1),
  hostHandle: z.string().regex(/^@/),
  approvedAttendeesCount: z.number().int().nonnegative(),
  // Optional fields shared with HostGathering. Static public gatherings
  // populate these to enrich the detail page; host-created gatherings
  // populate them via the host-gatherings store.
  isLocationRevealed: z.boolean().optional(),
  pendingCount: z.number().int().nonnegative().optional(),
  waitlistedCount: z.number().int().nonnegative().optional(),
  approvedAttendees: z.array(attendeeRefSchema).optional(),
  whoShouldAttend: z.array(localizedStringSchema).optional(),
  whatToExpect: z.array(localizedStringSchema).optional(),
});
export type Gathering = z.infer<typeof gatheringSchema>;

/* ------------------------------------------------------------------ */
/* Letter (editorial long-form)                                       */
/* ------------------------------------------------------------------ */

export const letterSchema = z.object({
  slug: z.string().min(1),
  title: localizedStringSchema,
  subtitle: localizedStringSchema,
  excerpt: localizedStringSchema,
  content: localizedStringSchema, // Markdown
  coverImageUrl: z.string().min(1),
  galleryUrls: z.array(z.string()).default([]),
  readTimeMinutes: z.number().int().positive(),
  publishedAt: z.string().min(1), // ISO
  topicSlug: z.string().min(1),
  authorHostHandle: z.string().regex(/^@/),
  gatheringSlug: z.string().nullable(),
});
export type Letter = z.infer<typeof letterSchema>;

/* ------------------------------------------------------------------ */
/* Prayer times                                                        */
/* ------------------------------------------------------------------ */

export const prayerDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fajr: z.string().regex(/^\d{2}:\d{2}$/),
  sunrise: z.string().regex(/^\d{2}:\d{2}$/),
  dhuhr: z.string().regex(/^\d{2}:\d{2}$/),
  asr: z.string().regex(/^\d{2}:\d{2}$/),
  maghrib: z.string().regex(/^\d{2}:\d{2}$/),
  isha: z.string().regex(/^\d{2}:\d{2}$/),
});
export type PrayerDay = z.infer<typeof prayerDaySchema>;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navLinkSchema = z.object({
  href: z.string().min(1),
  labelKey: z.string().min(1),
});
export type NavLink = z.infer<typeof navLinkSchema>;

export const footerColumnSchema = z.object({
  titleKey: z.string().min(1),
  links: z.array(navLinkSchema),
});
export type FooterColumn = z.infer<typeof footerColumnSchema>;
