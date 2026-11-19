import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { getMeetingById } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Edit Meeting",
};

type Params = PageProps<"/meetings/[id]/edit">["params"];

// Loads the meeting inside <Suspense> so the heading shows immediately.
async function EditMeetingContent({ params }: { params: Params }) {
  const { id } = await params;

  // A non-numeric id can never match a meeting.
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));
  if (meeting === null || meeting === undefined) {
    notFound();
  }

  // The form's action is wired to updateMeeting.bind(null, meeting.id).
  return <MeetingForm meeting={meeting} />;
}

export default function EditMeetingPage({ params }: PageProps<"/meetings/[id]/edit">) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl font-bold">Edit Meeting</h1>
      <Suspense fallback={<p role="status">Loading meeting…</p>}>
        <EditMeetingContent params={params} />
      </Suspense>
    </div>
  );
}
