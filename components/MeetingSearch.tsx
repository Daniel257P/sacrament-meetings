'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // push (not replace) adds a history entry per search, so the browser's
  // Back button returns to the previous search. The debounce keeps it from
  // adding one entry per keystroke.
  const { push } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // always reset to page 1 on a new search
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="no-print flex flex-col gap-1">
      <label htmlFor="meeting-search" className="text-sm font-medium">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        placeholder="Search by speaker, leader, or meeting type..."
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        aria-label="Search meetings"
        className="w-full rounded-md border border-border bg-background px-3 py-2 sm:max-w-md"
      />
    </div>
  );
}
