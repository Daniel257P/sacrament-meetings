import { Suspense } from "react";
import NavLinks, { NavLinksList } from "@/components/NavLinks";
import type { NavItem } from "@/lib/types";

const sectionLinks: NavItem[] = [
  { href: "/meetings", label: "All meetings" },
  { href: "/meetings/current", label: "This Sunday" },
];

export default function MeetingsLayout({ children }: LayoutProps<"/meetings">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="no-print border-b border-border pb-3">
        <Suspense
          fallback={<NavLinksList links={sectionLinks} label="Meetings" variant="section" activeHref={null} />}
        >
          <NavLinks links={sectionLinks} label="Meetings" variant="section" />
        </Suspense>
      </div>
      {children}
    </div>
  );
}
