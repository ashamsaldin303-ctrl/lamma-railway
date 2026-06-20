import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { summarizeLetter } from '@/lib/ai/services/summarize-letter';

const BodySchema = z.object({
  letterSlug: z.string(),
  content: z.string().min(50),
  title: z.string(),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, title, locale } = BodySchema.parse(body);
    const summary = await summarizeLetter(content, title, locale);
    return NextResponse.json({ success: true, summary });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
