'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { HOME_BY_ROLE, NAV_BY_ROLE, type NavRole } from './nav-config';

export function AppMobileNav({ role }: { role: NavRole }) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);
  const sections = NAV_BY_ROLE[role] ?? [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-white p-0.5 ring-1 ring-sidebar-border">
            <Image
              src="/logo.jpg"
              alt="UHIL Academy logo"
              width={24}
              height={24}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-sm font-semibold text-sidebar-accent-foreground">
            UHIL Academy
          </span>
        </div>
        <nav className="space-y-5 overflow-y-auto px-2 py-4">
          {sections.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-2 text-2xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon ? Icons[item.icon] : Icons.arrowRight;
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="border-t border-sidebar-border pt-3">
            <Link
              href={HOME_BY_ROLE[role]}
              onClick={() => setOpen(false)}
              className="block px-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-accent-foreground"
            >
              Back to home
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
