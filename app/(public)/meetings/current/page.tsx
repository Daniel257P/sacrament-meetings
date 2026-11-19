import { Suspense } from "react";
import { redirect } from "next/navigation";
import { io } from "next/cache";
import { fetchMeetings } from "@/lib/api";
import { mostRecentSunday } from "@/lib/format";

// Finds the most recent Sunday's meeting and redirects to it,
// or back to /meetings when nothing is scheduled for that Sunday.
async function RedirectToCurrentMeeting(): Promise<null> {
  // "Today" must be computed per request, not once at build time.
  await io();
  const sunday = mostRecentSunday();

  const [meeting] = await fetchMeetings(sunday);

  if (!meeting) {
    redirect("/meetings");
  }
  redirect(`/meetings/${meeting.id}`);
}

// /meetings/current
export default function CurrentMeetingPage() {
  return (
    <Suspense fallback={<p role="status">Finding this Sunday&apos;s meeting…</p>}>
      <RedirectToCurrentMeeting />
    </Suspense>
  );
}
