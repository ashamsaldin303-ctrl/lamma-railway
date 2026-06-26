import { NextResponse } from 'next/server';

/**
 * GET /api/v1/health
 * Ultra-lightweight liveness check for Railway healthcheck.
 *
 * IMPORTANT: This endpoint MUST NOT do any database queries or heavy work.
 * It only checks if the Next.js server process is alive and responding.
 * If this endpoint is slow, Railway will kill the container.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'lamma',
  });
}
