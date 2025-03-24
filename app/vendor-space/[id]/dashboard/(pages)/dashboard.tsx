'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { EllipsisVertical, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DashboardPage() {
  const [statusOpen, setStatusOpen] = useState(true);
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center justify-end gap-12">
        <div className="text-orange-500 font-semibold text-lg">
          Mon 5 Aug, 4:11 PM
        </div>
        <div className="relative">
          <Select defaultValue="monthly">
            <SelectTrigger className="border-blue-800 text-blue-800 rounded-md w-[110px] text-sm">
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Switch
            checked={statusOpen}
            onCheckedChange={setStatusOpen}
            showStatus
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <EllipsisVertical className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">90</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Bookings
              </CardTitle>
              <EllipsisVertical className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">90</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Overall rating
              </CardTitle>
              <EllipsisVertical className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold">4.2</div>
                <Star className="ml-2 h-6 w-6 text-orange-500 fill-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Revenue Chart
              </CardTitle>
              <div className="relative">
                <select
                  aria-label="Revenue Chart Timeframe"
                  className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-1 pr-8 text-sm focus:outline-none"
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <div className="flex h-full items-end gap-2">
                  {[
                    { month: 'Jan', value: 6.5 },
                    { month: 'Feb', value: 4.5 },
                    { month: 'Mar', value: 8.0 },
                    { month: 'Apr', value: 5.5 },
                    { month: 'May', value: 9.0 },
                    { month: 'Jun', value: 7.0 },
                    { month: 'Jul', value: 5.0 },
                    { month: 'Aug', value: 8.5 },
                    { month: 'Sep', value: 9.5 },
                    { month: 'Oct', value: 6.0 },
                    { month: 'Nov', value: 7.5 },
                    { month: 'Dec', value: 6.5 },
                  ].map((data, i) => (
                    <div
                      key={data.month}
                      className="flex flex-1 flex-col items-center"
                    >
                      <div
                        className={`w-10 rounded-sm ${data.value > 8.0 ? 'bg-orange-400' : 'bg-gray-200'} transition-all duration-300 hover:bg-orange-300`}
                        style={{ height: `${data.value}rem` }}
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        {data.month}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">
                Lab Activity
              </CardTitle>
              <Button variant="link" className="text-xs text-blue-600 -mr-4">
                Show all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                        <Image
                          src="/assetlist.png"
                          alt="Event"
                          className="object-cover aspect-square"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="text-sm">
                        You have a new booking request
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">4 hrs ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 w-1/2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Upcoming</CardTitle>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm">30 Jun, 2024 Onwards</div>
                      <EllipsisVertical className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                        <Image
                          src="/assetlist.png"
                          alt="Event"
                          className="object-cover aspect-square"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Idea to MVP Business incubation
                        </div>
                        <div className="text-xs text-gray-500">
                          IIM Lucknow Incubation Centre
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Events in Progress
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">25 Jun - 28 Jun, 2024</div>
                      <EllipsisVertical className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                        <Image
                          src="/assetlist.png"
                          alt="Event"
                          className="object-cover aspect-square"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          3D Printing Workshop
                        </div>
                        <div className="text-xs text-gray-500">
                          SOA FAB LAB, Bhubaneswar
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
