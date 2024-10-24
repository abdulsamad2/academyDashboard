'use client';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MenuItems } from './NavItems';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';


const TutorSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-[.9rem] border-b dark:border-gray-700">
            <Link href="#" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="text-lg font-bold">Uhil Academy</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <nav className="space-y-1">
                {MenuItems.map((item, index) => {
                  const Icon = Icons[item.icon || 'arrowRight'];
                  return (
                    //@ts-ignore
                    <Link key={index} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left font-normal hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="border-t p-4 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 md:hidden z-50 bg-white dark:bg-gray-800 shadow-md rounded-full"
        onClick={toggleSidebar}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
};

export default TutorSidebar;