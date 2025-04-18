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
import Wishlist from './(pages)/wishlist';
import BookingComponent from './(pages)/bookings';
import {
  Settings,
  User,
  HelpCircle,
  Globe,
  CreditCard,
  LayoutDashboard,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export default function Page() {
  const [activePage, setActivePage] = React.useState('My Space');

  const navItems = [
    '',
    'Bookings',
    'Messages',
    'Wishlist',

    'Dashboard',
    'My Profile',
    '',
  ];

  const utilityItems = ['Help Desk', 'Settings', 'Log Out'];

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Bookings':
        return <BookingComponent />;
      case 'Events':
        return <EventsPage />;
      case 'Memberships':
        return <MembershipsPage />;
      case 'My Space':
        return <MySpacePage />;
      case 'Wishlist':
        return <Wishlist />;
      case 'Messages':
        return <MessagesPage />;
      default:
        return <MySpacePage />;
    }
  };

  const [openPopover, setOpenPopover] = React.useState<
    'notifications' | 'profile' | null
  >(null);

  const notifications = [
    {
      title: 'Simran Arora sent you a message.',
      time: '4 hrs ago',
    },
    {
      title: 'You have a new booking request',
      time: '4 hrs ago',
    },
  ];

  const menuItems = [
    { label: 'Bookings', icon: LayoutDashboard },
    { label: 'Messages', icon: LayoutDashboard },
    { label: 'Wishlist', icon: User },
    { label: 'Dashboard', icon: User },
    { label: 'My profile', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-12 p-6 mb-4">
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
          <Popover
            open={openPopover === 'notifications'}
            onOpenChange={(open) =>
              setOpenPopover(open ? 'notifications' : null)
            }
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl" align="end">
              <div className="p-4">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <Separator />
              <div className="space-y-2 p-2">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="h-2 w-2 mt-2 rounded-full bg-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover
            open={openPopover === 'profile'}
            onOpenChange={(open) => setOpenPopover(open ? 'profile' : null)}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Avatar>
                  <AvatarImage src="https://randomuser.me/api/portraits" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 rounded-2xl" align="end">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start gap-2 rounded-lg"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <main className="flex gap-x-8 items-start">
        <aside className="h-[80vh] text-white bg-bluekarkhana w-64 ml-8 rounded-3xl mb-6 pt-4 pb-4 pl-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-x-4 pl-4 my-6">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="SQA FAB Lab" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="items-start">
                <h2 className="text-sm font-medium">John Doe</h2>
                <div className="flex items-start">
                  <span className="text-yellow-500">★★★★☆</span>
                  <span className="ml-2 text-sm text-gray-500">(4.5)</span>
                </div>
              </div>
            </div>
            <Separator />
          </div>

          <nav className="flex-1 space-y-0 -my-4 max-w-full relative">
            {navItems.map((item, index) => {
              console.log(item, activePage);
              const isActive = item === activePage;
              const isPrevious = index === navItems.indexOf(activePage) - 1;
              const isNext = index === navItems.indexOf(activePage) + 1;
              const isDisabled = index === 0 || index === navItems.length - 1;

              return (
                <div key={item} className="relative">
                  {isPrevious && (
                    <div className="absolute bottom-0 right-0 t-0 h-6 w-6 bg-white">
                      <div className="absolute bottom-0 right-0 h-6 w-6 bg-bluekarkhana rounded-br-3xl" />
                    </div>
                  )}
                  {isNext && (
                    <div className="absolute top-0 right-0 h-6 w-6 bg-white">
                      <div className="absolute top-0 right-0 h-6 w-6 bg-bluekarkhana rounded-tr-3xl" />
                    </div>
                  )}
                  <p
                    onClick={() => !isDisabled && setActivePage(item)}
                    className={`block p-4 text-sm transition-colors relative ${
                      isActive
                        ? 'bg-white text-black rounded-l-3xl'
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

        <section className="w-4/5 mb-36 mt-4 max-w-6xl mx-auto my-auto">
          <div className="h-auto ">{renderPage()}</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
