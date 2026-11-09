import { headers } from 'next/headers';
import type { SacramentMeeting } from './types';

// Server Components need an absolute URL to call our own API routes.
// We build it from the incoming request so it works on localhost and on
// any Vercel preview/production URL without extra configuration.
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000')
    .split(',')[0]
    .trim();
  const protocol =
    h.get('x-forwarded-proto')?.split(',')[0].trim() ??
    (host.startsWith('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}

/** Fetches GET /api/meetings, optionally filtered by a 'YYYY-MM-DD' date. */
export async function fetchMeetings(date?: string): Promise<SacramentMeeting[]> {
  const url = new URL('/api/meetings', await getBaseUrl());
  if (date) url.searchParams.set('date', date);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url.pathname} failed with status ${res.status}`);
  }
  return (await res.json()) as SacramentMeeting[];
}

/** Fetches GET /api/meetings/[id]. Returns null for a 400 or 404 response. */
export async function fetchMeeting(id: string): Promise<SacramentMeeting | null> {
  const url = new URL(`/api/meetings/${encodeURIComponent(id)}`, await getBaseUrl());

  const res = await fetch(url);
  if (res.status === 400 || res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GET ${url.pathname} failed with status ${res.status}`);
  }
  return (await res.json()) as SacramentMeeting;
}
