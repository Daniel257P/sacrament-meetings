'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

const linkClass =
  'rounded-md border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Same rule as the page: anything invalid (abc, -2, 0) means page 1.
  const currentPage = Math.max(1, Math.floor(Number(searchParams.get('page'))) || 1);

  // Builds a URL for a page while keeping the other params (like ?query=).
  function createPageURL(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  // No results means no pages to show.
  if (totalPages < 1) return null;

  return (
    <nav aria-label="Pagination" className="no-print flex items-center justify-center gap-3">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)} className={linkClass}>
          <span aria-hidden="true">← </span>Previous
        </Link>
      )}
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link href={createPageURL(currentPage + 1)} className={linkClass}>
          Next<span aria-hidden="true"> →</span>
        </Link>
      )}
    </nav>
  );
}
