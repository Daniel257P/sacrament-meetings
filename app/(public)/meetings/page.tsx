import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";
import { fetchMeetings } from "@/lib/api";
import { formatMeetingDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Meetings",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type SearchParams = PageProps<"/meetings">["searchParams"];

export default function MeetingsPage({ searchParams }: PageProps<"/meetings">) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl font-bold">Meetings</h1>
      {/* The heading shows instantly; the filter and list stream in. */}
      <Suspense fallback={<p role="status">Loading meetings…</p>}>
        <MeetingList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function MeetingList({ searchParams }: { searchParams: SearchParams }) {
  const { date } = await searchParams;
  const selectedDate = typeof date === "string" && ISO_DATE.test(date) ? date : undefined;

  // Data comes from our own API route: GET /api/meetings[?date=YYYY-MM-DD]
  const meetings = await fetchMeetings(selectedDate);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end">
        {/* A plain GET form updates ?date= in the URL, so it works without JavaScript. */}
        <form method="get" className="no-print flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="date" className="text-sm font-medium">
              Filter by date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={selectedDate}
              className="rounded-md border border-border bg-background px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Apply
          </button>
          {selectedDate && (
            <Link href="/meetings" className="px-2 py-2 underline underline-offset-4">
              Clear filter
            </Link>
          )}
        </form>
      </div>

      {meetings.length === 0 ? (
        <p className="rounded-md bg-surface p-4">
          {selectedDate
            ? `No meeting is scheduled for ${formatMeetingDate(selectedDate)}.`
            : "No meetings have been planned yet."}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard meeting={meeting} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
