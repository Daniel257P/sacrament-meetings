import Link from 'next/link';
import DeleteMeetingButton from './DeleteMeetingButton';
import { MEETING_TYPE_LABELS, formatMeetingDate, isSacramentMeeting } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const speakerCount = meeting.speakers.filter((s) => s.type === 'speaker').length;
  const sacrament = isSacramentMeeting(meeting.meetingType);
  const dateLabel = formatMeetingDate(meeting.date);

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
          {dateLabel}
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
      {/* relative z-10 lifts these controls above the card's clickable overlay. */}
      <div className="no-print relative z-10 mt-4 flex items-center gap-2">
        <Link
          href={`/meetings/${meeting.id}/edit`}
          aria-label={`Edit meeting on ${dateLabel}`}
          className="rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Edit
        </Link>
        <DeleteMeetingButton id={meeting.id} label={dateLabel} />
      </div>
    </article>
  );
}
