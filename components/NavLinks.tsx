'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/types';

interface NavLinksProps {
  links: NavItem[];
  label: string; // accessible name for the <nav>, e.g. "Main"
  variant?: 'header' | 'section';
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Renders the links. activeHref is null when the current path is not known yet. */
export function NavLinksList({
  links,
  label,
  variant = 'header',
  activeHref,
}: NavLinksProps & { activeHref: string | null }) {
  const base =
    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';
  const styles =
    variant === 'header'
      ? {
          idle: 'text-primary-foreground/90 hover:bg-white/10 focus-visible:outline-primary-foreground',
          active: 'bg-white/15 text-primary-foreground underline underline-offset-4',
        }
      : {
          idle: 'text-foreground hover:bg-surface focus-visible:outline-primary',
          active: 'bg-primary text-primary-foreground',
        };

  return (
    <nav aria-label={label} className="no-print">
      <ul className="flex flex-wrap gap-1">
        {links.map((link) => {
          const active = link.href === activeHref;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`${base} ${active ? styles.active : styles.idle}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Client component that highlights the link for the current route. */
export default function NavLinks(props: NavLinksProps) {
  const pathname = usePathname();
  // Pick the most specific matching link so "/meetings/current" wins over "/meetings".
  const activeHref =
    props.links
      .filter((link) => isActive(pathname, link.href))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;

  return <NavLinksList {...props} activeHref={activeHref} />;
}
