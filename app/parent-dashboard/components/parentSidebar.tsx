'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';
import { ChevronLeft, School } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { MenuItems } from './NavItems';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

type SidebarProps = {
  className?: string;
};

// Group menu items by category
const organizeMenuItems = () => {
  const main = MenuItems.filter(item => ['Dashboard'].includes(item.title));
  const children = MenuItems.filter(item => ['My Children', 'Add Child'].includes(item.title));
  const academics = MenuItems.filter(item => ['Tutor Requests', 'Schedule', 'Learning Resources'].includes(item.title));
  const finances = MenuItems.filter(item => ['Invoices & Payments'].includes(item.title));
  const account = MenuItems.filter(item => ['My Profile'].includes(item.title));
  
  return { main, children, academics, finances, account };
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const { data: session } = useSession();
  const categorizedItems = organizeMenuItems();

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  
  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none border-r pt-16 md:block bg-background/80 backdrop-blur-sm transition-all duration-200`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-16 cursor-pointer rounded-full border bg-background p-1 text-foreground shadow-sm hover:bg-muted transition-all',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      
      <div className="flex flex-col h-full">
        {/* User profile at top */}
        
    
        {/* Navigation sections */}
        <div className="space-y-6 px-3 py-2 flex-1 overflow-y-auto scrollbar-hide">
          {/* Main section */}
          <div className="space-y-1">
            {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main</h2>}
            <DashboardNav items={categorizedItems.main as any} />
          </div>
          
          {/* Children section */}
          <div className="space-y-1">
            {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Children</h2>}
            <DashboardNav items={categorizedItems.children as any} />
          </div>
          
          {/* Academics section */}
          <div className="space-y-1">
            {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Education</h2>}
            <DashboardNav items={categorizedItems.academics as any} />
          </div>
          
          {/* Finances section */}
          <div className="space-y-1">
            {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Finance</h2>}
            <DashboardNav items={categorizedItems.finances as any} />
          </div>
          
          {/* Account section */}
          <div className="space-y-1">
            {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</h2>}
            <DashboardNav items={categorizedItems.account as any} />
          </div>
        </div>
        
        {/* Footer - App version */}
        {!isMinimized && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <School size={16} />
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-muted-foreground">Academy Dashboard v1.0.0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
