import Link from 'next/link';
import { MEETING_TYPE_LABELS, formatMeetingDate, isSacramentMeeting } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const speakerCount = meeting.speakers.filter((s) => s.type === 'speaker').length;
  const sacrament = isSacramentMeeting(meeting.meetingType);

  return (
    <article className="relative rounded-lg border border-border bg-background p-5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-primary hover:shadow-md">
      <p
        className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          sacrament ? 'bg-primary/10 text-primary' : 'bg-accent/15 text-accent-strong'
        }`}
      >
        {MEETING_TYPE_LABELS[meeting.meetingType]}
      </p>
      <h2 className="font-serif text-lg font-semibold">
        {/* The ::after overlay makes the whole card clickable with a single link. */}
        <Link
          href={`/meetings/${meeting.id}`}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {formatMeetingDate(meeting.date)}
        </Link>
      </h2>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted">Conducting</dt>
        <dd>{meeting.conducting}</dd>
        <dt className="text-muted">Program</dt>
        <dd>
          {meeting.meetingType === 'testimony'
            ? 'Testimonies'
            : `${speakerCount} speaker${speakerCount === 1 ? '' : 's'}`}
        </dd>
      </dl>
    </article>
  );
}
