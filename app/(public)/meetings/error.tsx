'use client'; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

interface MeetingsErrorProps {
  error: unknown;
  reset: () => void;
}

export default function MeetingsError({ error, reset }: MeetingsErrorProps) {
  useEffect(() => {
    // Log the error so it shows up in the browser console.
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
      <h2 className="font-serif text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted">
        We couldn&apos;t load or update the meetings right now. Please try again in a moment.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try Again
        </button>
        <Link href="/meetings" className="underline underline-offset-4">
          Back to all meetings
        </Link>
      </div>
    </div>
  );
}
