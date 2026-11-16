import { NextResponse, type NextRequest } from 'next/server';
import { getAllMeetings, getMeetingsByDate } from '@/lib/meetings-db';
import type { ApiError, SacramentMeeting } from '@/lib/types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// True for a real calendar date in 'YYYY-MM-DD' format (rejects e.g. 2026-13-45).
function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

// GET /api/meetings           -> all meetings
// GET /api/meetings?date=...  -> meetings on that date ('YYYY-MM-DD')
export async function GET(
  request: NextRequest,
): Promise<NextResponse<SacramentMeeting[] | ApiError>> {
  const date = request.nextUrl.searchParams.get('date');

  if (date !== null && !isValidIsoDate(date)) {
    return NextResponse.json(
      { error: 'The date query parameter must use the YYYY-MM-DD format.' },
      { status: 400 },
    );
  }

  const meetings = date ? await getMeetingsByDate(date) : await getAllMeetings();
  return NextResponse.json(meetings);
}
