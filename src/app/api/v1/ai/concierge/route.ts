import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { askConcierge } from '@/lib/ai/services/concierge';
import { demoUsers } from '@/data/demo-users';

const BodySchema = z.object({
  question: z.string().min(3).max(500),
  userId: z.string().optional(),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, userId, locale } = BodySchema.parse(body);
    const user = userId ? demoUsers.find((u) => u.id === userId) ?? null : null;
    const answer = await askConcierge(question, { user, locale });
    return NextResponse.json({ success: true, answer, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
