import { Suspense } from 'react';
import Link from 'next/link';
import { io } from 'next/cache';
import NavLinks, { NavLinksList } from './NavLinks';
import { WARD_NAME, formatToday } from '@/lib/format';
import type { NavItem } from '@/lib/types';

const mainLinks: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings' },
];

// The date changes every day, so it is rendered per request (await io())
// instead of being frozen into the prerendered page at build time.
async function CurrentDate() {
  await io();
  const now = new Date();
  return <time dateTime={now.toISOString()}>{formatToday(now)}</time>;
}

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
          >
            {WARD_NAME}
          </Link>
          <p className="text-sm text-primary-foreground/85">
            <Suspense fallback={<span>&nbsp;</span>}>
              <CurrentDate />
            </Suspense>
          </p>
        </div>
        {/* usePathname suspends on dynamic routes like /meetings/[id], so the
            un-highlighted list is shown until the path is known. */}
        <Suspense fallback={<NavLinksList links={mainLinks} label="Main" activeHref={null} />}>
          <NavLinks links={mainLinks} label="Main" />
        </Suspense>
      </div>
    </header>
  );
}
