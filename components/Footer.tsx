import { WARD_NAME } from '@/lib/format';

export default function Footer() {
  return (
    <footer className="no-print border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted">
        <p>{WARD_NAME} · Sacrament Meeting Planner</p>
        <p>Built with Next.js for WDD 430.</p>
      </div>
    </footer>
  );
}
