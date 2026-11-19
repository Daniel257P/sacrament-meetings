import Link from "next/link";

export default function EditMeetingNotFound() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-serif text-2xl font-bold">Meeting not found</h2>
      <p className="text-muted">
        We couldn&apos;t find a meeting with that ID, so there is nothing to edit.
      </p>
      <Link href="/meetings" className="self-start underline underline-offset-4">
        Back to all meetings
      </Link>
    </div>
  );
}
