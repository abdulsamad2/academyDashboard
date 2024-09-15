import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { navItems } from '@/constants/data';

import Link from 'next/link';
import { UserNav } from './user-nav';

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 font-extrabold"
          >
            UHIL Academy
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
        <MobileSidebar menuItems={navItems} />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
