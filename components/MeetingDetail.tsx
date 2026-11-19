import type { ReactNode } from 'react';
import PrintButton from './PrintButton';
import { MEETING_TYPE_LABELS, WARD_NAME, formatMeetingDate, isSacramentMeeting } from '@/lib/format';
import type { Hymn, SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

interface ProgramItemProps {
  label: string;
  children: ReactNode;
}

function ProgramItem({ label, children }: ProgramItemProps) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-dotted border-border py-2 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="font-medium">{label}</dt>
      <dd className="text-muted sm:text-right">{children}</dd>
    </div>
  );
}

function formatHymn(hymn: Hymn): string {
  return `#${hymn.number} — ${hymn.title}`;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const sacrament = isSacramentMeeting(meeting.meetingType);
  const announcements = meeting.announcements ?? [];

  return (
    <article className="program mx-auto max-w-2xl rounded-lg border border-border bg-background p-6 shadow-sm sm:p-8">
      <header className="mb-6 text-center">
        <p className="text-sm uppercase tracking-widest text-muted">{WARD_NAME}</p>
        <h1 className="mt-1 font-serif text-3xl font-bold">
          {MEETING_TYPE_LABELS[meeting.meetingType]}
        </h1>
        <p className="mt-1 text-lg">
          <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
        </p>
        {!sacrament && (
          <p className="mt-3 rounded-md bg-accent/15 px-3 py-2 text-sm text-accent-strong">
            This is a non-sacrament meeting. There is no ward sacrament meeting this Sunday.
          </p>
        )}
      </header>

      <section aria-labelledby="leaders-heading" className="mb-6">
        <h2 id="leaders-heading" className="sr-only">Leaders</h2>
        <dl>
          <ProgramItem label="Presiding">{meeting.presiding}</ProgramItem>
          <ProgramItem label="Conducting">{meeting.conducting}</ProgramItem>
        </dl>
      </section>

      {announcements.length > 0 && (
        <section aria-labelledby="announcements-heading" className="mb-6">
          <h2 id="announcements-heading" className="mb-2 font-serif text-xl font-semibold">
            Announcements
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            {announcements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="program-heading">
        <h2 id="program-heading" className="mb-2 font-serif text-xl font-semibold">
          Program
        </h2>
        <dl>
          <ProgramItem label="Opening Hymn">{formatHymn(meeting.openingHymn)}</ProgramItem>
          <ProgramItem label="Invocation">{meeting.openingPrayer}</ProgramItem>

          <ProgramItem label="Ward Business">
            {meeting.wardBusiness.length > 0 ? (
              <ul>
                {meeting.wardBusiness.map((item) => (
                  <li key={item.description}>{item.description}</li>
                ))}
              </ul>
            ) : (
              'None'
            )}
          </ProgramItem>
          <ProgramItem label="Stake Business">{meeting.stakeBusiness ? 'Yes' : 'No'}</ProgramItem>

          {meeting.sacramentHymn && (
            <>
              <ProgramItem label="Sacrament Hymn">{formatHymn(meeting.sacramentHymn)}</ProgramItem>
              <ProgramItem label="Administration of the Sacrament">Aaronic Priesthood</ProgramItem>
            </>
          )}

          {meeting.meetingType === 'testimony' && meeting.speakers.length === 0 ? (
            <ProgramItem label="Testimonies">Bearing of testimonies</ProgramItem>
          ) : (
            meeting.speakers.map((item) => (
              <ProgramItem
                key={`${item.type}-${item.name}`}
                label={item.type === 'speaker' ? 'Speaker' : 'Musical Number'}
              >
                {item.name}
                {item.topic && <span className="block text-sm italic">{item.topic}</span>}
              </ProgramItem>
            ))
          )}

          <ProgramItem label="Closing Hymn">{formatHymn(meeting.closingHymn)}</ProgramItem>
          <ProgramItem label="Benediction">{meeting.closingPrayer}</ProgramItem>
        </dl>
      </section>

      <div className="mt-8 flex justify-center">
        <PrintButton />
      </div>
    </article>
  );
}
