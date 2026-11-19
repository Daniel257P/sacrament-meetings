export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading meetings…</span>
      <div className="h-8 w-56 animate-pulse rounded bg-surface" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-36 animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    </div>
  );
}
