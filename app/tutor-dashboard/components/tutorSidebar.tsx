'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Home,
  CreditCard,
  Book,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Bell,
  X,
  Menu
} from 'lucide-react'; // Import necessary icons
import { MenuItems } from './NavItems';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { Prisma, PrismaClient } from '@prisma/client';

const TutorSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b p-2">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Parent" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">John Doe</h2>
                <p className="text-sm text-gray-500">Parent</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {MenuItems.map((item, index) => {
              const Icon = Icons[item.icon || 'arrowRight']; // Retrieve the icon from the Icons object
              return (
                <Link key={index} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Icon className="mr-2 h-4 w-4" /> {/* Render the icon */}
                    {item.label} {/* Render the label */}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
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

export default TutorSidebar;
