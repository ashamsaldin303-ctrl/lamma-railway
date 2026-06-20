import { NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/llm-client';

export async function GET() {
  try {
    const result = await generateText('قل: "أهلاً"', {
      maxTokens: 20,
      cacheKey: 'ai-health-check',
    });
    return NextResponse.json({
      status: 'ok',
      llm: 'connected',
      response: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'degraded', llm: 'unavailable', error: String(error) },
      { status: 503 },
    );
  }
}
