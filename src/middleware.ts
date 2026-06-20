import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * next-intl middleware. The matcher excludes:
 *  - /api/*            (API routes are locale-agnostic)
 *  - /_next/*, /_vercel/*
 *  - files with an extension (e.g. /images/foo.jpg, /favicon.ico)
 */
export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
