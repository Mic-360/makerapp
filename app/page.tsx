'use client';

import TopBar from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { fetchEventsByLocation, fetchMachinesByLocation } from '@/lib/api';
import { cities } from '@/lib/constants';
import { useCityDataStore, useCityStore } from '@/lib/store';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { selectedCity, setSelectedCity } = useCityStore();
  const { setMachines, setEvents } = useCityDataStore();

  useEffect(() => {
    if (selectedCity !== 'Location') {
      router.push('/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCityConfirm = async () => {
    if (selectedCity === 'Location') return;

    try {
      const [machines, events] = await Promise.all([
        fetchMachinesByLocation(selectedCity),
        fetchEventsByLocation(selectedCity),
      ]);

      setMachines(machines);
      setEvents(events);
      router.push('/home');
    } catch (error) {
      console.error('Failed to fetch city data:', error);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-white mx-auto">
      <TopBar theme="light" />
      <div className="relative h-screen w-screen flex flex-col items-center justify-center text-center">
        <Image
          src="/backgroundpage.png"
          alt="Background"
          fill
          className="z-0 object-cover opacity-50"
        />
        <div className="relative bg-white mt-10 z-10 rounded-xl shadow-lg px-8 py-10 w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-10 ">Select your city</h2>
          <Button
            variant="ghost"
            className="absolute top-2 right-0 text-gray-500 hover:text-gray-700"
          >
            <Link href="/home">
              <X size={24} />
            </Link>
          </Button>
          <div className="grid grid-cols-3 gap-4 mb-12">
            {cities.map((city) => (
              <Button
                variant={selectedCity === city ? 'default' : 'outline'}
                key={city}
                className={`${
                  selectedCity === city ? 'text-white' : 'text-gray-300'
                } py-8 rounded-xl text-sm font-medium transition-colors hover:bg-black/80 hover:text-white`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleCityConfirm}
            className={
              selectedCity === 'Location'
                ? 'pointer-events-none bg-black text-white py-3 font-medium transition-colors px-16 rounded-full w-auto'
                : 'bg-emerald-500 text-black py-3 font-medium hover:bg-emerald-600 transition-colors px-16 rounded-full w-auto'
            }
          >
            Confirm
          </Button>
          <Button
            variant="link"
            className="w-full text-xs text-gray-500 mt-4 hover:text-gray-700 underline underline-offset-1"
            onClick={() => {
              setSelectedCity('Location');
              router.push('/home');
            }}
          >
            SKIP
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-white/40 dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-white/40 dark:from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 dark:from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/40 dark:from-background"></div>
    </div>
  );
}
