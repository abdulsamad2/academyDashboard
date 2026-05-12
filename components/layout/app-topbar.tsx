'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';
import { AppMobileNav } from './app-mobile-nav';
import { type NavRole } from './nav-config';

interface AppTopbarProps {
  role: NavRole;
}

export function AppTopbar({ role }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <AppMobileNav role={role} />

      <div className="hidden flex-1 md:flex md:max-w-md">
        <button
          type="button"
          className="group inline-flex h-9 w-full items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open search"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search…</span>
          <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-2xs font-medium tracking-wide text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
