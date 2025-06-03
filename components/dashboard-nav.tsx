'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Extended NavItem interface to include badge properties
interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  variant?: 'new' | 'updated' | 'beta';
}

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.disabled ? '/' : item.href}
                    className={cn(
                      'group flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      'hover:bg-accent hover:text-accent-foreground',
                      path === item.href 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:text-foreground',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <Icon className={cn(
                        'mr-3 size-5 flex-shrink-0 transition-transform group-hover:scale-110',
                        path === item.href ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )} />

                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <div>
                          <span className="truncate">{item.title}</span>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    
                    {(isMobileNav || !isMinimized) && (
                      <>
                        {item.badge && (
                          <Badge variant={item.badgeVariant || 'default'} className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.variant === 'new' && (
                          <Badge variant="default" className="ml-auto text-xs bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-sm">
                            NEW
                          </Badge>
                        )}
                        {item.variant === 'updated' && (
                          <Badge variant="default" className="ml-auto text-xs bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-sm">
                            UPDATED
                          </Badge>
                        )}
                        {item.variant === 'beta' && (
                          <Badge variant="default" className="ml-auto text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm">
                            BETA
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={cn(!isMinimized ? 'hidden' : 'inline-block', 'z-50')}
                >
                  <div className="flex flex-col gap-1">
                    <span>{item.title}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
