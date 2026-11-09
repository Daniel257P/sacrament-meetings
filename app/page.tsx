import Image from "next/image";
import Link from "next/link";
import { WARD_NAME } from "@/lib/format";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Image
        src="/images/chapel.jpg"
        alt="Brick meetinghouse with a white steeple, surrounded by autumn trees"
        width={1907}
        height={1080}
        priority
        className="h-auto w-full rounded-lg border border-border"
      />

      <section className="flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight">
          Sacrament Meeting Planner
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Welcome to the {WARD_NAME} planner. Leaders can review each
          Sunday&apos;s agenda, from announcements and hymns to speakers and
          ward business, and print programs for the current or past weeks.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/meetings/current"
            className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            This Sunday&apos;s program
          </Link>
          <Link
            href="/meetings"
            className="rounded-md border border-border px-5 py-3 font-semibold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Browse all meetings
          </Link>
        </div>
      </section>
    </div>
  );
}
