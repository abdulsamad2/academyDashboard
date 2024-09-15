'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  LogOut} from 'lucide-react'; // Import necessary icons
import { MenuItems } from './NavItems';
import { Icons } from '@/components/icons';
import Link from 'next/link';

const ParentSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out', // Dark mode background
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className=" p-2  dark:border-gray-700"> {/* Dark mode border */}
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Parent" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-black dark:text-white"> {/* Dark mode text */}
                  John Doe
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Parent</p> {/* Dark mode muted text */}
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {MenuItems.map((item, index) => {
              //@ts-ignore
              const Icon = Icons[item.icon || 'arrowRight']; // Retrieve the icon from the Icons object
              return (
                <Link key={index} //@ts-ignore
                 href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start dark:text-white dark:hover:bg-gray-800" // Dark mode text and hover background
                  >
                    <Icon className="mr-2 h-4 w-4" /> {/* Render the icon */}
                    {item.label} {/* Render the label */}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4 dark:border-gray-700"> {/* Dark mode border */}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 dark:text-red-400" // Dark mode logout button color
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ParentSidebar;


