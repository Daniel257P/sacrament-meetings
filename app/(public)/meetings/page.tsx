import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Meetings",
};

type SearchParams = PageProps<"/meetings">["searchParams"];

export default function MeetingsPage({ searchParams }: PageProps<"/meetings">) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl font-bold">Meetings</h1>

      {/* MeetingSearch reads the URL (useSearchParams), so it needs a Suspense
          boundary. It sits outside the list's boundary so the input keeps focus
          while results reload. */}
      <Suspense fallback={<div className="h-16" />}>
        <MeetingSearch />
      </Suspense>

      <Suspense fallback={<p role="status">Loading meetings…</p>}>
        <MeetingList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function MeetingList({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  // Never below 1, so a URL like ?page=-2 can't produce a negative OFFSET.
  const currentPage = Math.max(1, Math.floor(Number(params.page)) || 1);

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {meetings.length === 0 ? (
        <p className="rounded-md bg-surface p-4">
          {currentPage > totalPages && totalPages > 0 ? (
            <>
              There are only {totalPages} page{totalPages === 1 ? "" : "s"} of results.{" "}
              <Link href={query ? `/meetings?query=${encodeURIComponent(query)}&page=1` : "/meetings"} className="underline underline-offset-4">
                Go to page 1
              </Link>
            </>
          ) : query ? (
            `No meetings match "${query}".`
          ) : (
            "No meetings have been planned yet."
          )}
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

      <Pagination totalPages={totalPages} />
    </div>
  );
}
