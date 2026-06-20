import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseNaturalLanguageSearch } from '@/lib/ai/services/search';

const BodySchema = z.object({
  query: z.string().min(3).max(300),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, locale } = BodySchema.parse(body);
    const filters = await parseNaturalLanguageSearch(query, locale);
    return NextResponse.json({ success: true, filters });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
