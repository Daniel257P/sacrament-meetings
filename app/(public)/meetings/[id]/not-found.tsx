import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-serif text-3xl font-bold">Meeting not found</h1>
      <p className="text-muted">We couldn&apos;t find a meeting with that ID.</p>
      <Link href="/meetings" className="self-start underline underline-offset-4">
        View all meetings
      </Link>
    </div>
  );
}
