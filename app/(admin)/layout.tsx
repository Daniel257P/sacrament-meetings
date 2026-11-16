// Layout for leader-facing pages (create and edit meetings).
// Authentication will be added here in Week 05.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-md bg-surface px-4 py-2 text-sm font-medium text-muted">
        Leader tools
      </p>
      {children}
    </div>
  );
}
