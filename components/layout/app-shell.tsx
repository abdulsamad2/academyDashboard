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
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar role={role} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
