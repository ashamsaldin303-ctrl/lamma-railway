import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateReviewInsight } from '@/lib/ai/services/review-insight';
import { demoUsers } from '@/data/demo-users';
import { gatheringsBySlug } from '@/data/gatherings';

const BodySchema = z.object({
  applicantId: z.string(),
  gatheringSlug: z.string(),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicantId, gatheringSlug, locale } = BodySchema.parse(body);
    const applicant = demoUsers.find((u) => u.id === applicantId);
    const gathering = gatheringsBySlug[gatheringSlug];
    if (!applicant || !gathering) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    const insight = await generateReviewInsight({ applicant, gathering, locale });
    return NextResponse.json({ success: true, insight });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
