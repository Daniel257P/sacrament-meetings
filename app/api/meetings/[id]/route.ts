import { NextResponse, type NextRequest } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';
import type { ApiError, SacramentMeeting } from '@/lib/types';

// GET /api/meetings/[id]
//   200 -> the meeting
//   400 -> id is not a positive whole number (e.g. /api/meetings/abc)
//   404 -> no meeting with that id
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<'/api/meetings/[id]'>,
): Promise<NextResponse<SacramentMeeting | ApiError>> {
  const { id } = await ctx.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: `Invalid meeting id "${id}". The id must be a number.` },
      { status: 400 },
    );
  }

  const meeting = getMeetingById(Number(id));
  if (!meeting) {
    return NextResponse.json(
      { error: `Meeting ${id} was not found.` },
      { status: 404 },
    );
  }

  return NextResponse.json(meeting);
}
