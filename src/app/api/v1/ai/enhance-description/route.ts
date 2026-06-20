import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { enhanceDescription } from '@/lib/ai/services/enhance-description';

const BodySchema = z.object({
  title: z.string(),
  topic: z.string(),
  format: z.string(),
  currentDescription: z.string(),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = BodySchema.parse(body);
    const result = await enhanceDescription(data);
    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
