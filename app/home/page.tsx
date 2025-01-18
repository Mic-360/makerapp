'use client';

import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import Makerspace from './makerspace';
import Machine from './machine';
import Event from './events';
import { useRouter } from 'next/navigation';
import CategoryScroll from '@/components/category-scroll';

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [activeSegment, setActiveSegment] = useState('makerspaces');
  const router = useRouter();

  return (
    <div>
      <div className="min-h-screen min-w-screen bg-white relative">
        <TopBar theme="dark" />

        <div className="relative h-[400px] sm:h-[500px] flex flex-col items-center justify-end text-center">
          <Image
            src="/placeholder-top.png"
            alt="Background"
            fill
            priority
            className="z-0"
          />
          <div className="relative z-10 max-w-3xl mb-8">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-white">
              Find the Perfect Machine for Every Job, Every Time
            </h1>
            <p className="text-sm sm:text-base text-gray-200 mb-8  mx-auto max-w-sm">
              Book Your Machine Online - Ready for Your Next Big Project When
              You Arrive.
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="lg"
                  className="mt-14 bg-transparent border text-white hover:text-black hover:bg-white rounded-full"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>SELECT A DATE</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-transparent border-none shadow-2xl space-y-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-xl border bg-white"
                />
                <Button
                  className="w-full rounded-b-xl bg-green-500"
                  onClick={() => router.push('/home/book')}
                >
                  Book Machine
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/40 dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/40 dark:from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 dark:from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 dark:from-background"></div>
        </div>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
          <h2 className="font-semibold text-2xl capitalize">
            Explore {activeSegment}
          </h2>
          <CategoryScroll />
        </section>
        {activeSegment === 'makerspaces' && <Makerspace />}
        {activeSegment === 'machines' && <Machine />}
        {activeSegment === 'events' && <Event />}
        <div className="sticky bottom-5 left-1/2 transform -translate-x-1/2 mb-10 inline-flex rounded-full bg-gray-800 p-1 shadow-lg shadow-slate-500">
          <Button
            variant="ghost"
            className={`rounded-l-full p-6 text-sm font-medium transition-colors ${
              activeSegment === 'makerspaces'
                ? 'bg-white text-black shadow'
                : 'text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveSegment('makerspaces')}
          >
            Find Makerspaces
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none p-6 text-sm font-medium transition-colors ${
              activeSegment === 'machine'
                ? 'bg-white text-black shadow'
                : 'text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveSegment('machines')}
          >
            Book a Machine
          </Button>
          <Button
            variant="ghost"
            className={`rounded-r-full p-6 text-sm font-medium transition-colors ${
              activeSegment === 'events'
                ? 'bg-white text-black shadow'
                : 'text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveSegment('events')}
          >
            Explore Events
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
