import { PrismaClient } from '@prisma/client';

/**
 * Lamma database client.
 *
 * In production (Railway): connects to PostgreSQL via DATABASE_URL
 * In development: connects to SQLite via file:./db/custom.db
 *
 * The query log is disabled in production for performance and to
 * avoid leaking SQL into Railway logs (which can expose data).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
