import type { Locale } from '@/i18n/routing';

/**
 * Format an ISO date string in the user's locale.
 * Uses ar-KW for Arabic (Kuwaiti month names) and en-GB for English.
 */
export function formatDateTime(iso: string, locale: Locale): string {
  const intlLocale = locale === 'ar' ? 'ar-KW' : 'en-GB';
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** Date only — used for application deadlines. */
export function formatDate(iso: string, locale: Locale): string {
  const intlLocale = locale === 'ar' ? 'ar-KW' : 'en-GB';
  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

/** Format a KWD price with 3-decimal precision. */
export function formatKwd(amount: number, locale: Locale): string {
  const intlLocale = locale === 'ar' ? 'ar-KW' : 'en-GB';
  return new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

/**
 * Format an ISO date string as a relative "time ago" label.
 * Returns values like "منذ ٣ أيام" / "3 days ago".
 */
export function formatRelative(iso: string, locale: Locale): string {
  const intlLocale = locale === 'ar' ? 'ar-KW' : 'en-GB';
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' });
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = then - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const absSec = Math.abs(diffSec);
  if (absSec < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour');
  if (Math.abs(diffDay) < 7) return rtf.format(diffDay, 'day');
  if (Math.abs(diffWeek) < 4) return rtf.format(diffWeek, 'week');
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
  return rtf.format(diffYear, 'year');
}

export function formatDateRange(startIso: string, endIso: string, locale: Locale): string {
  const intlLocale = locale === 'ar' ? 'ar-KW' : 'en-GB';
  const start = new Date(startIso); const end = new Date(endIso);
  const sameDay = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate();
  const df = new Intl.DateTimeFormat(intlLocale, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  const tf = new Intl.DateTimeFormat(intlLocale, { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return `${df.format(start)} · ${tf.format(start)} – ${tf.format(end)}`;
  return `${df.format(start)} → ${df.format(end)}`;
}
