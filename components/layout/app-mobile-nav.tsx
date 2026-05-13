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
        className={cn(
          'relative w-72 overflow-hidden border-r border-white/10 p-0 text-white',
          'bg-[linear-gradient(180deg,hsl(224_60%_14%)_0%,hsl(232_55%_20%)_50%,hsl(248_45%_22%)_100%)]'
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl"
        />

        <div className="relative z-10 flex h-14 items-center gap-2 border-b border-white/10 px-4">
          <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-white p-0.5 ring-1 ring-white/30">
            <Image
              src="/logo.jpg"
              alt="UHIL Academy logo"
              width={24}
              height={24}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-sm font-semibold text-white">UHIL Academy</span>
        </div>
        <nav className="relative z-10 space-y-5 overflow-y-auto px-2 py-4">
          {sections.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-2 text-2xs font-semibold uppercase tracking-wider text-white/50">
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
                          ? 'bg-white/15 text-white ring-1 ring-white/15'
                          : 'text-white/70 hover:bg-white/[0.07] hover:text-white'
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
          <div className="border-t border-white/10 pt-3">
            <Link
              href={HOME_BY_ROLE[role]}
              onClick={() => setOpen(false)}
              className="block px-2 text-xs text-white/60 hover:text-white"
            >
              Back to home
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
