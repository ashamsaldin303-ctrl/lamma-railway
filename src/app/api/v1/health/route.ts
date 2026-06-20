import { NextResponse } from 'next/server';

/**
 * GET /api/v1/health
 * Lightweight liveness + readiness check.
 *
 * This endpoint is used by Railway's healthcheck (railway.json).
 * It MUST NOT crash even if the database is unreachable, because
 * Railway restarts the container if the healthcheck fails — which
 * would prevent debugging via logs.
 *
 * Strategy:
 * - Always return 200 if the process is alive
 * - Include db status as info, not as pass/fail
 * - Use dynamic import so a missing @prisma/client doesn't break this route
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  const dbUrl = process.env.DATABASE_URL ?? '';
  const isPostgres = dbUrl.startsWith('postgresql://');
  const isSqlite = dbUrl.startsWith('file:') || dbUrl === '';

  let dbStatus: 'connected' | 'error' | 'not-configured' = 'not-configured';
  let dbDetail = '';

  if (dbUrl) {
    try {
      const { db } = await import('@/lib/db');
      await db.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
      dbDetail = isPostgres ? 'postgresql' : 'sqlite';
    } catch (error) {
      dbStatus = 'error';
      dbDetail = error instanceof Error ? error.message.slice(0, 200) : String(error);
    }
  }

  return NextResponse.json({
    status: 'ok',
    timestamp,
    db: dbStatus,
    dbDetail,
    database: isPostgres ? 'postgresql' : isSqlite ? 'sqlite' : 'unknown',
    locale: 'ar,en',
    service: 'lamma',
    env: process.env.NODE_ENV ?? 'development',
    version: '1.0.0-railway',
  });
}
