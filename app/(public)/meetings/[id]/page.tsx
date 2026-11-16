import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import { fetchMeeting } from "@/lib/api";

type Params = PageProps<"/meetings/[id]">["params"];

// Reads the id and fetches the meeting. It lives inside <Suspense> so the
// rest of the page (the back link) shows instantly while the data streams in.
async function MeetingContent({ params }: { params: Params }) {
  const { id } = await params;

  // Data comes from our own API route: GET /api/meetings/[id]
  const meeting = await fetchMeeting(id);
  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}

export default function MeetingPage({ params }: PageProps<"/meetings/[id]">) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/meetings"
        className="no-print self-start text-sm underline underline-offset-4"
      >
        ← Back to all meetings
      </Link>
      <Suspense fallback={<p role="status">Loading meeting program…</p>}>
        <MeetingContent params={params} />
      </Suspense>
    </div>
  );
}
