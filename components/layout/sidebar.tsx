'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

type SidebarProps = {
  className?: string;
};

// Organize items into categories
const categorizedItems = {
  main: navItems.filter(item => ['Dashboard', 'Inquiries'].includes(item.title)),
  users: navItems.filter(item => ['Tutors', 'Tutor Report', 'Tutor Approvals', 'Students', 'Parents', 'Users', 'Profile'].includes(item.title)),
  academics: navItems.filter(item => ['Lessons', 'Classes', 'Subjects', 'Books'].includes(item.title)),
  finance: navItems.filter(item => ['Invoices', 'Generate Invoice', 'Deposits', 'Generate Deposit', 'Payouts'].includes(item.title))
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  
  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none border-r pt-20 md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      
      <div className="space-y-6 px-3 py-2">
        {/* Main section */}
        <div className="space-y-1">
          {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main</h2>}
          <DashboardNav items={categorizedItems.main} />
        </div>
        
        {/* Users section */}
        <div className="space-y-1">
          {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Users</h2>}
          <DashboardNav items={categorizedItems.users} />
        </div>
        
        {/* Academics section */}
        <div className="space-y-1">
          {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Academics</h2>}
          <DashboardNav items={categorizedItems.academics} />
        </div>
        
        {/* Finance section */}
        <div className="space-y-1">
          {!isMinimized && <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Finance</h2>}
          <DashboardNav items={categorizedItems.finance} />
        </div>
      </div>
    </nav>
  );
}
