import * as React from 'react';
import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import { type NavRole } from './nav-config';

interface AppShellProps {
  role: NavRole;
  children: React.ReactNode;
}

export function AppShell({ role, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar role={role} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppTopbar role={role} />
        {/* min-h-0 lets this flex child shrink so overflow-y-auto actually
            scrolls inside it instead of the page growing past the viewport */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="w-full p-4 lg:p-6">
            <div className="flex w-full flex-col gap-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
