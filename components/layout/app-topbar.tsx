'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <UserNav />
      </div>
    </header>
  );
}
