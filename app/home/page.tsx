'use client';

import CategoryScroll from '@/components/category-scroll';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import {
  fetchEventsByMakerspaces,
  fetchMachinesByMakerspaces,
  fetchMakerspaces,
} from '@/lib/api';
import { useCityDataStore, useCityStore } from '@/lib/store';
import Image from 'next/image';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Event from './events';
import Machine from './machine';
import Loading from '../loading';

export default function Page() {
  const [activeSegment, setActiveSegment] = useState('machines');
  const { selectedCity } = useCityStore();
  const { setMachines, setEvents } = useCityDataStore();

  // Using useCallback to memoize the fetchData function
  const fetchData = useCallback(async () => {
    if (selectedCity === 'Location') {
      return;
    }

    try {
      const makerspaces = await fetchMakerspaces(selectedCity);

      if (activeSegment === 'machines') {
        const machines = await fetchMachinesByMakerspaces(makerspaces);
        setMachines(machines);
      } else {
        const events = await fetchEventsByMakerspaces(makerspaces);
        setEvents(events);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [selectedCity, activeSegment, setMachines, setEvents]);

  // Fetch data when component mounts or city/segment changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Suspense fallback={<Loading />}>
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
          <div className="relative z-10 max-w-3xl my-auto">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-white">
              Find the Perfect Machine for Every Job, Every Time
            </h1>
            <p className="text-sm sm:text-base text-gray-200 mb-8  mx-auto max-w-sm">
              Book Your Machine Online - Ready for Your Next Big Project When
              You Arrive.
            </p>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/40 dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/40 dark:from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 dark:from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 dark:from-background"></div>
        </div>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-6">
          <h2 className="font-semibold text-2xl capitalize">
            Explore {activeSegment}
          </h2>
          <CategoryScroll
            activeSegment={activeSegment as 'machines' | 'events'}
          />
        </section>
        {activeSegment === 'machines' && <Machine />}
        {activeSegment === 'events' && <Event />}
        <div className="sticky bottom-5 left-1/2 transform -translate-x-1/2 mb-10 inline-flex rounded-full bg-white text-gray-200 shadow-lg shadow-slate-500">
          <Button
            variant="ghost"
            className={`rounded-l-full p-6 text-sm font-medium transition-colors ${
              activeSegment === 'machines'
                ? 'bg-black text-white font-semibold'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSegment('machines')}
          >
            Book Machine
          </Button>
          <Button
            variant="ghost"
            className={`rounded-r-full p-6 text-sm font-medium transition-colors ${
              activeSegment === 'events'
                ? 'bg-black text-white font-semibold'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSegment('events')}
          >
            Explore Events
          </Button>
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}
