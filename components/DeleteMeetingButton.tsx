'use client';

import { deleteMeeting } from '@/lib/actions';

interface DeleteMeetingButtonProps {
  id: number;
  /** Human-readable date, used in the confirmation and the accessible name. */
  label: string;
}

/** A small form that submits to the deleteMeeting Server Action with the meeting id. */
export default function DeleteMeetingButton({ id, label }: DeleteMeetingButtonProps) {
  const deleteMeetingWithId = deleteMeeting.bind(null, id);

  return (
    <form
      action={deleteMeetingWithId}
      onSubmit={(event) => {
        // Ask before deleting; cancelling stops the Server Action from running.
        if (!window.confirm(`Delete the meeting on ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label={`Delete meeting on ${label}`}
        className="rounded-md border border-red-700 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 dark:border-red-400 dark:text-red-400"
      >
        Delete
      </button>
    </form>
  );
}
