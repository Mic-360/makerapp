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
import type { Machine } from '@/lib/api';
import { sortOptions } from '@/lib/constants';
import { useCategoryStore, useCityDataStore } from '@/lib/store';
import { ArrowUpDown, SlidersHorizontal, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function Machine() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { machines } = useCityDataStore();
  const { selectedCategory } = useCategoryStore();
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter machines based on selected category
  const filteredMachines = useMemo(() => {
    if (!selectedCategory) return machines;
    return machines.filter((machine) =>
      machine.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [machines, selectedCategory]);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <section>
        {/* <div className="flex items-center justify-end gap-x-2 pb-4 p-1">
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
        </div> */}
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
            {filteredMachines.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No machines found</h3>
                <p className="text-gray-500">
                  Try changing your filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                {filteredMachines.map((machine: Machine) => (
                  <div
                    key={machine._id}
                    className="border rounded-xl overflow-hidden hover:shadow-xl shadow-inner h-fit bg-white"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={machine.imageLinks?.[0] || '/assetlist.png'}
                        alt={`${machine.brand} ${machine.model}`}
                        fill
                        className="object-cover"
                      />
                      {machine.status === 'inactive' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            Currently Unavailable
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between w-full mb-2">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {machine.brand}, {machine.model}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {machine.makerSpace}
                          </p>
                        </div>
                        {machine.rating && (
                          <div className="flex items-start justify-center gap-x-1.5">
                            <span className="text-gray-600 font-semibold text-md">
                              {machine.rating}
                            </span>
                            <Star className="w-4 h-4 mt-[3px] text-orange-400 fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <p className="text-xs text-gray-600 mt-1">
                            {machine.category}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleDescription(machine._id)}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                          >
                            {expandedDescriptions[machine._id]
                              ? 'Show Less'
                              : 'Show More'}
                          </button>
                          {expandedDescriptions[machine._id] && (
                            <div className="mt-2 space-y-2">
                              <p className="text-sm text-gray-600">
                                {machine.description}
                              </p>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/home/${encodeURIComponent(machine.makerSpace)}/book?machineId=${machine._id}`}
                        >
                          <Button
                            variant="default"
                            className="rounded-lg px-6 hover:bg-emerald-600"
                            disabled={machine.status === 'inactive'}
                          >
                            <span className="text-xs">
                              {machine.status === 'inactive'
                                ? 'UNAVAILABLE'
                                : 'BOOK NOW'}
                            </span>
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
              Discover a Wide Range of Advanced Machines
            </h2>
            <p className="text-gray-600 mb-4 max-w-56">
              Find the Perfect Tool to Bring Your Ideas to Life
            </p>
          </article>
          <Button variant="link" className="text-lg -ml-4">
            View More →
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
            Find Machines Near You →
          </Button>
        </div>
      </section>
    </main>
  );
}
