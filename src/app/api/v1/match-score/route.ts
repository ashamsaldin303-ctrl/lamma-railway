import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeMatchScore } from '@/lib/matching/engine';
import { demoUsers } from '@/data/demo-users';
import { gatheringsBySlug } from '@/data/gatherings';

const BodySchema = z.object({ userId: z.string(), gatheringSlug: z.string() });

export async function POST(req: NextRequest) {
  try {
    const { userId, gatheringSlug } = BodySchema.parse(await req.json());
    const user = demoUsers.find((u) => u.id === userId);
    const gathering = gatheringsBySlug[gatheringSlug];
    if (!user || !gathering) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const score = computeMatchScore(user, gathering);
    return NextResponse.json({ success: true, score, user: { id: user.id, name: user.nameLocalized }, gathering: { slug: gathering.slug, title: gathering.title } });
  } catch { return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 }); }
}
