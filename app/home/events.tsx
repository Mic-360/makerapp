'use client';

import { Filters } from '@/components/filters';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { sortOptions } from '@/lib/constants';
import { useCityDataStore } from '@/lib/store';
import { ArrowUpDown, Calendar, SlidersHorizontal, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Event() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { events } = useCityDataStore();
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <section>
        <div className="flex items-center justify-end gap-x-2 pb-4 p-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-none shadow-none rounded-full hover:bg-gray-100"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 rounded-2xl">
              <div className="flex items-center pb-4">
                <ArrowUpDown className="h-5 w-5 mr-2" />
                <p className="font-medium">Sort By</p>
              </div>
              <Separator className="mb-2" />
              {sortOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-x-2 py-2">
                  <Checkbox
                    id={option.id}
                    value={option.id}
                    className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </PopoverContent>
          </Popover>
          {isFilterOpen ? (
            <></>
          ) : (
            <Button
              onClick={() => setIsFilterOpen(true)}
              variant="ghost"
              className="gap-2 rounded-full hover:bg-gray-100"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Button>
          )}
        </div>
        <div className="grid grid-cols-12 gap-4">
          {isFilterOpen && (
            <aside className="col-span-3">
              <Filters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            </aside>
          )}
          <div className={`${isFilterOpen ? 'col-span-9' : 'col-span-12'}`}>
            {events.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-gray-500">
                  Try changing your filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-xl overflow-hidden hover:shadow-xl shadow-inner h-fit"
                  >
                    <Image
                      src={event.imagelink || '/placeholder.svg'}
                      alt={event.name}
                      width={400}
                      height={600}
                      className="w-full object-cover rounded-xl"
                    />
                    <div className="p-4">
                      <div className="flex justify-between w-full">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {event.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {event.location}
                          </p>
                        </div>
                        <div className="flex items-start justify-center gap-x-1.5">
                          <span className="text-gray-600 font-semibold text-md">
                            {event.rating ? event.rating.toFixed(1) : '4.5'}
                          </span>
                          <Star className="w-4 h-4 mt-[3px] text-orange-400 fill-current" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2 mt-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {event.date.start} | {event.time.start}
                        </p>
                      </div>
                      <p className="text-sm my-2">{event.category}</p>
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleDescription(event.id)}
                          className="underline text-xs"
                        >
                          {expandedDescriptions[event.id]
                            ? 'Show Less'
                            : 'Show More'}
                        </button>
                        {expandedDescriptions[event.id] && (
                          <p className="text-sm mt-2">{event.description}</p>
                        )}
                      </div>
                      <div className="flex justify-end mt-4">
                        <Link
                          href={`/home/${encodeURIComponent(event.makerspacename)}/book?eventId=${event.id}`}
                        >
                          <Button
                            variant="default"
                            className="rounded-lg px-6 hover:bg-green-500 hover:text-black"
                          >
                            <span className="text-xs">REGISTER</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-8">
          <Button variant="link" className="text-lg">
            View More →
          </Button>
        </div>
      </section>

      <section className="my-16 flex flex-col md:flex-row justify-between gap-x-24">
        <div className="md:w-1/3 py-10 flex flex-col items-start justify-between">
          <article>
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Discover Exciting Events in the Maker Community
            </h2>
            <p className="text-gray-600 mb-4 max-w-56">
              Join workshops, seminars, and hackathons to enhance your skills
              and network
            </p>
          </article>
          <Button variant="link" className="text-lg">
            Explore All Events →
          </Button>
        </div>

        <div className="flex flex-col justify-center items-center md:w-1/2 gap-y-2">
          <div className="bg-yellow-100 rounded-2xl py-1 px-4">
            <Image
              src="/world.svg"
              alt="Machines Collage"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <Button
            variant="link"
            className="text-lg"
            onClick={() =>
              window.open('https://maps.app.goo.gl/qjaRb4rr4dzq64NY7', '_blank')
            }
          >
            Find Events Near You →
          </Button>
        </div>
      </section>
    </main>
  );
}
