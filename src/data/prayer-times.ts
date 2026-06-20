import { prayerDaySchema, type PrayerDay } from './types';

/**
 * Mock prayer times for Kuwait City for the next 14 days.
 *
 * These are approximate but realistic reference times for Kuwait City
 * (Fajr ~04:30, Sunrise ~05:50, Dhuhr ~11:50, Asr ~15:20, Maghrib ~18:30,
 * Isha ~20:00). Times shift by ~1 minute earlier per day in this mock.
 *
 * In production this will be replaced by the Aladhan API (Phase 2).
 */

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Build 14 consecutive days starting from a fixed epoch so the mock is
 * deterministic (the homepage reads "today" by slicing on the current
 * calendar date, but the dataset itself is stable across renders).
 */
function buildDays(start: Date, count: number): PrayerDay[] {
  const days: PrayerDay[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    // Drift times ~1 min earlier per day for realism.
    const drift = (m: number, base: [number, number]) => {
      let mins = base[0] * 60 + base[1] - i;
      if (mins < 0) mins += 24 * 60;
      return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
    };
    const fajr = drift(i, [4, 32]);
    const sunrise = drift(i, [5, 52]);
    const dhuhr = drift(i, [11, 51]);
    const asr = drift(i, [15, 21]);
    const maghrib = drift(i, [18, 31]);
    const isha = drift(i, [19, 59]);
    days.push({
      date: `${y}-${m}-${day}`,
      fajr,
      sunrise,
      dhuhr,
      asr,
      maghrib,
      isha,
    });
  }
  return days;
}

// Start from 2026-01-01 to keep the dataset deterministic. The homepage
// selects "today" by matching new Date() against the date string; if no
// match exists it falls back to the first entry (graceful for mock data).
export const prayerTimes: PrayerDay[] = buildDays(new Date('2026-01-01T00:00:00Z'), 14);

export function getPrayerTimeForDate(date: Date): PrayerDay | undefined {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const key = `${y}-${m}-${d}`;
  return prayerTimes.find((p) => p.date === key) ?? prayerTimes[0];
}

prayerTimes.forEach((d) => prayerDaySchema.parse(d));

export function checkPrayerConflict(start: Date, end: Date): { conflict: boolean; prayer?: string } {
  const day = getPrayerTimeForDate(start);
  if (!day) return { conflict: false };
  const prayers = [
    { name: 'fajr', time: day.fajr }, { name: 'dhuhr', time: day.dhuhr },
    { name: 'asr', time: day.asr }, { name: 'maghrib', time: day.maghrib }, { name: 'isha', time: day.isha },
  ];
  for (const p of prayers) {
    const [h, m] = p.time.split(':').map(Number);
    const prayerTime = new Date(start); prayerTime.setHours(h, m, 0, 0);
    const prayerEnd = new Date(prayerTime.getTime() + 30 * 60 * 1000);
    if (start <= prayerEnd && end >= prayerTime) return { conflict: true, prayer: p.name };
  }
  return { conflict: false };
}
