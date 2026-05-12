'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronsLeft } from 'lucide-react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  HOME_BY_ROLE,
  NAV_BY_ROLE,
  type NavLink,
  type NavRole
} from './nav-config';

interface AppSidebarProps {
  role: NavRole;
}

function isActive(currentPath: string, href: string) {
  if (href === currentPath) return true;
  // /dashboard should not light up when visiting /dashboard/foo? — let exact-match parent stay active too
  if (currentPath.startsWith(href + '/')) return true;
  return false;
}

function NavItem({
  item,
  active,
  collapsed
}: {
  item: NavLink;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon ? Icons[item.icon] : Icons.arrowRight;
  const content = (
    <Link
      href={item.disabled ? '#' : item.href}
      aria-disabled={item.disabled}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium outline-none transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground',
        item.disabled && 'pointer-events-none opacity-50',
        collapsed && 'justify-center px-0'
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-primary"
        />
      )}
      <Icon
        className={cn(
          'h-4 w-4 shrink-0',
          active ? 'text-primary' : 'text-sidebar-foreground/70'
        )}
      />
      {!collapsed && <span className="truncate">{item.title}</span>}
      {!collapsed && item.badge ? (
        <span className="ml-auto rounded bg-sidebar-muted px-1.5 py-0.5 text-2xs font-medium text-sidebar-foreground">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );

  if (!collapsed) return content;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname() ?? '';
  const { isMinimized, toggle } = useSidebar();
  const sections = NAV_BY_ROLE[role] ?? [];

  return (
    <aside
      data-collapsed={isMinimized}
      className={cn(
        'hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out md:flex',
        isMinimized ? 'w-[68px]' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        <Link
          href={HOME_BY_ROLE[role]}
          className="flex items-center gap-2 overflow-hidden text-sidebar-accent-foreground"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-0.5 ring-1 ring-sidebar-border">
            <Image
              src="/logo.jpg"
              alt="UHIL Academy logo"
              width={24}
              height={24}
              className="h-full w-full object-contain"
            />
          </span>
          {!isMinimized && (
            <span className="truncate text-sm font-semibold">UHIL Academy</span>
          )}
        </Link>
        {!isMinimized && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground"
            onClick={toggle}
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="flex flex-col gap-5">
            {sections.map((section) => (
              <div key={section.label} className="space-y-1">
                {!isMinimized && (
                  <p className="px-2 text-2xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      active={isActive(pathname, item.href)}
                      collapsed={isMinimized}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </TooltipProvider>

      {isMinimized && (
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-full text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground"
            onClick={toggle}
            aria-label="Expand sidebar"
          >
            <ChevronsLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      )}
    </aside>
  );
}
