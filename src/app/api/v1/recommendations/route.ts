import { NextRequest, NextResponse } from 'next/server';
import { recommendGatheringsForUser } from '@/lib/matching/engine';
import { explainRecommendation } from '@/lib/matching/explain';
import { demoUsers } from '@/data/demo-users';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '3', 10);
  if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
  const user = demoUsers.find((u) => u.id === userId);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  const recommendations = recommendGatheringsForUser(user, { limit }).map(({ gathering, score }) => ({
    gathering: { slug: gathering.slug, title: gathering.title, topicSlug: gathering.topicSlug, startDate: gathering.startDate, coverImageUrl: gathering.coverImageUrl },
    score, reasons: explainRecommendation(user, gathering, score),
  }));
  return NextResponse.json({ success: true, recommendations });
}
