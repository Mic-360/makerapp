'use client';

import * as React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/footer';
import { Separator } from '@/components/ui/separator';
import DashboardPage from './(pages)/dashboard';
import MachinesPage from './(pages)/machines';
import EventsPage from './(pages)/events';
import MembershipsPage from './(pages)/membership';
import MySpacePage from './(pages)/my-space';
import RevenuePage from './(pages)/revenue';
import MessagesPage from './(pages)/messages';

export default function Page() {
  const [activePage, setActivePage] = React.useState('My Space');

  const navItems = [
    '',
    'Dashboard',
    'Machines',
    'Events',
    'Memberships',
    'My Space',
    'Revenue',
    'Messages',
    '',
  ];

  const utilityItems = ['Help Desk', 'Settings', 'Log Out'];

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Machines':
        return <MachinesPage />;
      case 'Events':
        return <EventsPage />;
      case 'Memberships':
        return <MembershipsPage />;
      case 'My Space':
        return <MySpacePage />;
      case 'Revenue':
        return <RevenuePage />;
      case 'Messages':
        return <MessagesPage />;
      default:
        return <MySpacePage />;
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-10 p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Karkhana Logo"
            width={170}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex items-center gap-x-4">
          <Bell className="h-4 w-4" />
          <Avatar>
            <AvatarImage src="https://randomuser.me/api/portraits" />
            <AvatarFallback>
              <Search className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex gap-x-8 items-start">
        <aside className="h-[80vh] bg-gray-300 w-52 ml-8 rounded-3xl mb-6 pt-4 pb-4 pl-8 flex flex-col justify-between">
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

          <nav className="flex-1 space-y-0 -my-4 relative">
            {navItems.map((item, index) => {
              const isActive = item === activePage;
              const isPrevious = index === navItems.indexOf(activePage) - 1;
              const isNext = index === navItems.indexOf(activePage) + 1;
              const isDisabled = index === 0 || index === navItems.length - 1;

              return (
                <div key={item} className="relative">
                  {isPrevious && (
                    <div className="absolute bottom-0 right-0 t-0 h-6 w-6 bg-white">
                      <div className="absolute bottom-0 right-0 h-6 w-6 bg-gray-300 rounded-br-3xl" />
                    </div>
                  )}
                  {isNext && (
                    <div className="absolute top-0 right-0 h-6 w-6 bg-white">
                      <div className="absolute top-0 right-0 h-6 w-6 bg-gray-300 rounded-tr-3xl" />
                    </div>
                  )}
                  <p
                    onClick={() => !isDisabled && setActivePage(item)}
                    className={`block p-4 text-sm transition-colors relative ${
                      isActive
                        ? 'bg-white rounded-l-3xl'
                        : isDisabled
                          ? ''
                          : 'hover:bg-white/50 rounded-l-3xl'
                    } ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {item}
                  </p>
                </div>
              );
            })}
          </nav>

          <div>
            <Separator />
            <div className="space-y-0 pt-4">
              {utilityItems.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block py-2 px-4 text-sm rounded-l-3xl hover:bg-white/50 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="w-4/5 mt-4 max-w-6xl mx-auto">
          <header className="mb-2 flex items-center justify-between">
            <div className="flex w-full max-w-md items-center rounded-xl border bg-white px-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                className="border-0 bg-transparent"
                placeholder="Search for more"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>

              <Select defaultValue="monthly">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center pt-6 flex-col">
                <Switch className="bg-white border border-white h-8 w-16" />
                <p>
                  <span className="text-xs text-gray-600 font-semibold">
                    Status:{' '}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">
                    Open
                  </span>
                </p>
              </div>
            </div>
          </header>

          <div className="h-[70vh] overflow-y-scroll">{renderPage()}</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
