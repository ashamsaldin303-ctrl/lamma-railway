import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { suggestApplicationQuestions } from '@/lib/ai/services/suggest-questions';

const BodySchema = z.object({
  title: z.string(),
  topic: z.string(),
  format: z.string(),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, topic, format, locale } = BodySchema.parse(body);
    const questions = await suggestApplicationQuestions({ title, topic, format }, locale);
    return NextResponse.json({ success: true, questions });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
