/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { Bell, ChevronDown, Search, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/footer';
import { Separator } from '@/components/ui/separator';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const sections = [
    { id: 1, title: 'Basic Details' },
    { id: 2, title: 'Rooms and Seats' },
    { id: 3, title: 'Lab Mentors' },
    { id: 4, title: 'Amenities' },
    { id: 5, title: 'How to reach your space' },
  ];

  const navItems = [
    'Dashboard',
    'Machines',
    'Events',
    'Memberships',
    'My Space',
    'Revenue',
    'Messages',
  ];

  const utilityItems = ['Help Desk', 'Settings', 'Log Out'];

  const activeIndex = navItems.indexOf('My Space');

  return (
    <div className="min-h-screen ">
      <main className="flex gap-x-8 items-start">
        <aside className="h-[80vh] mt-32 w-[25vh] bg-blue-500 w-1/6 ml-8 rounded-3xl mb-6 pt-4 pb-4 pl-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-x-4 pl-4 my-6">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="SQA FAB Lab" />
                <AvatarFallback>SQ</AvatarFallback>
              </Avatar>
              <h2 className="text-sm font-medium">SQA FAB Lab</h2>
            </div>
            <Separator />
          </div>

          <nav className="flex-1 space-y-0 py-4 relative">
            {navItems.map((item, index) => {
              const isActive = index === activeIndex;
              const isPrevious = index === activeIndex - 1;
              const isNext = index === activeIndex + 1;

              return (
                <div key={item} className="relative">
                  {isPrevious && (
                    <div className="absolute bottom-0 right-0 t-0 h-6 w-6 bg-gray-200">
                      <div className="absolute bottom-0 right-0 h-6 w-6 bg-blue-500 rounded-br-3xl" />
                    </div>
                  )}
                  {isNext && (
                    <div className="absolute top-0 right-0 h-6 w-6 bg-gray-200">
                      <div className="absolute top-0 right-0 h-6 w-6 bg-blue-500 rounded-tr-3xl" />
                    </div>
                  )}
                  <Link
                    href="#"
                    className={`block p-4 text-sm transition-colors relative ${
                      isActive
                        ? 'bg-gray-200 rounded-l-3xl text-blue-500'
                        : 'hover:bg-gray-200 rounded-l-3xl'
                    }`}
                  >
                    {item}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div>
            <Separator />
            <div className="space-y-0 pt-4">
              {utilityItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block py-2 px-4 text-sm rounded-l-3xl hover:bg-white/50 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
