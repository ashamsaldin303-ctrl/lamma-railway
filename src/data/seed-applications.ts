import { gatherings } from './gatherings';
import { demoUsers } from './demo-users';
import type { Application } from '@/lib/applications-store';
import { computeMatchScore } from '@/lib/matching/engine';

const khaledGatherings = gatherings.filter((g) => g.hostHandle === '@khaled_artist');
const applicants = demoUsers.filter((u) => u.id !== 'user-khaled');

const motivationsAr = [
  'أبحث عن تجربة فنية أصيلة بعيداً عن الورش التجارية.',
  'كهاوي رسم منذ سنوات، أريد تطوير مهاراتي في بيئة حميمية.',
  'أرسم بالأكريليك وأريد تجربة الزيت.',
  'مبتدئة تماماً في الفن، أبحث عن ورشة لا أشعر فيها بالضغط.',
  'مصمّمة جرافيك أريد كسر القالب الرقمي والعودة للّون اليدوي.',
];

const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED'] as const;

function seeded(n: number, max: number): number { return Math.floor((n * 9301 + 49297) % 233280) % max; }

export const seedApplications: Application[] = khaledGatherings.flatMap((gathering, gi) => {
  const count = 4 + (gi % 3);
  return Array.from({ length: count }, (_, i) => {
    const attendee = applicants[(i + gi) % applicants.length];
    const status = i === 0 ? 'PENDING' : statuses[seeded(i + gi, 4)];
    const matchScore = computeMatchScore(attendee, gathering);
    const createdAt = new Date(Date.now() - (i + 1) * 86400000 * (1 + (gi % 3))).toISOString();
    const reviewedAt = status !== 'PENDING' ? new Date(Date.now() - 86400000).toISOString() : undefined;
    return {
      id: `seed-app-${gathering.slug}-${i + 1}`, gatheringSlug: gathering.slug,
      gatheringTitle: JSON.stringify(gathering.title), userId: attendee.id, userEmail: attendee.email,
      userName: JSON.stringify(attendee.nameLocalized), motivation: motivationsAr[i % 5],
      customAnswers: {}, matchScore, status: status as Application['status'],
      reviewedAt, reviewedBy: status !== 'PENDING' ? 'user-khaled' : undefined,
      statusHistory: [{ status: 'PENDING', timestamp: createdAt, note: 'received' }, ...(status !== 'PENDING' ? [{ status, timestamp: reviewedAt! }] : [])],
      createdAt, updatedAt: reviewedAt ?? createdAt,
    } satisfies Application;
  });
});
