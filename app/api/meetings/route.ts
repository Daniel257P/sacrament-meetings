import { NextResponse, type NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import type { ApiError, SacramentMeeting } from '@/lib/types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/meetings           -> all meetings
// GET /api/meetings?date=...  -> meetings on that date ('YYYY-MM-DD')
export async function GET(
  request: NextRequest,
): Promise<NextResponse<SacramentMeeting[] | ApiError>> {
  const date = request.nextUrl.searchParams.get('date');

  if (date !== null && !ISO_DATE.test(date)) {
    return NextResponse.json(
      { error: 'The date query parameter must use the YYYY-MM-DD format.' },
      { status: 400 },
    );
  }

  return NextResponse.json(getMeetings(date));
}
