import type { MeetingType } from './types';

export const WARD_NAME = 'Serenada Ward';

// The ward's local time zone. Servers (like Vercel) run in UTC, so we always
// compute "today" in the ward's zone to avoid being off by a day at night.
export const WARD_TIME_ZONE = 'America/Denver';

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  testimony: 'Fast & Testimony',
  regular: 'Sacrament Meeting',
  stake: 'Stake Conference',
  general: 'General Conference',
};

/** Stake and general conference Sundays replace the ward sacrament meeting. */
export function isSacramentMeeting(type: MeetingType): boolean {
  return type === 'testimony' || type === 'regular';
}

/** Today's date in the ward's time zone, as 'YYYY-MM-DD'. */
export function todayInWard(now: Date = new Date()): string {
  // Read the year/month/day parts individually so the result is always
  // YYYY-MM-DD, no matter which locale's display format is used.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WARD_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** The most recent Sunday (today, if today is Sunday), as 'YYYY-MM-DD'. */
export function mostRecentSunday(now: Date = new Date()): string {
  const [year, month, day] = todayInWard(now).split('-').map(Number);
  const sunday = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = sunday.getUTCDay(); // 0 = Sunday
  sunday.setUTCDate(sunday.getUTCDate() - dayOfWeek); // roll back to Sunday
  return sunday.toISOString().slice(0, 10);
}

/** Formats an ISO 'YYYY-MM-DD' string, e.g. "Sunday, November 8, 2026". */
export function formatMeetingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  // Treat the date as UTC midnight and format in UTC so it never shifts a day.
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Formats the current moment as a full date in the ward's time zone. */
export function formatToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: WARD_TIME_ZONE,
    dateStyle: 'full',
  }).format(now);
}
