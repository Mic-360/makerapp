"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Menu, Plus } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function RevenuePage() {
  const [statusOpen, setStatusOpen] = useState(true);

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center justify-end gap-4">
        <div className="text-orange-500 font-medium">Mon 5 Aug, 4:11 PM</div>
        <div className="relative">
          <select
            aria-label="Select Timeframe"
            className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-1.5 pr-8 text-sm focus:outline-none"
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
        <div className="flex flex-col items-center gap-1">
          <Switch checked={statusOpen} onCheckedChange={setStatusOpen} />
          <span
            className={`text-xs ${statusOpen ? 'text-green-500' : 'text-red-500'} font-medium`}
          >
            Status: {statusOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
      <div className='flex justify-between gap-4'>
        <div className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">₹10000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  From Machines
                </CardTitle>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">₹6000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Profit</CardTitle>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">₹8000</div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Transaction History
                </CardTitle>
                <button className="text-xs text-blue-600">Show all</button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="flex-1">
                        <div className="font-medium">Ranbir Singh</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          3D Printing Workshop
                        </div>
                        <div className="text-xs text-gray-500">
                          SOA FAB LAB Bhubaneswar
                        </div>
                        <div className="text-xs text-gray-500">
                          25 Jun - 28 Jun, 2024
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="text-xs text-gray-500">
                          Transaction Id: KFRS34DCXR#8
                        </div>
                      </div>
                      <div className="flex-1 text-right font-medium">
                        ₹ 1000
                      </div>
                      <Button variant="ghost" size="icon">
                        <Plus className="h-4 w-4 text-green-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-center">
                      <Image
                        src="/visa.svg"
                        alt="visa"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Add Visa or Mastercard
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-center">
                      <Image
                        src="/phonepe.svg"
                        alt="Phonepe"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Add PhonePe or GPay
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-center">
                      <Image
                        src="/upi.svg"
                        alt="UPI"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Add UPI or QR
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-center">
                      <Image
                        src="/paytm.svg"
                        alt="Paytm"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Add PayTM UPI or QR
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Revenue Report
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-2 border-b pb-2">
                <div className="font-semibold">Total Revenue</div>
                <p>₹10000</p>
              </div>
              <div className="flex flex-col gap-2 border-b pb-2">
                <div className="font-semibold">Total Registration</div>
                <p>₹20000</p>
              </div>
              <div className="flex items-center justify-between pb-2">
                <div className="font-semibold text-sm">
                  Highest Revenue Generating Event
                </div>
                <EllipsisVertical className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-sm">25 Jun - 28 Jun, 2024</div>
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
              <Separator />
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">
                  Highest Revenue Generating Machine
                </div>
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
                    3D Printer Creality 333XP
                  </div>
                  <div className="text-xs text-gray-500">
                    SOA FAB LAB, Bhubaneswar
                  </div>
                </div>
              </div>
              <Separator />
              <div className="mt-auto h-44 bg-gray-200 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="font-medium">TBD</div>
                  <div className="text-xs text-gray-500">
                    Graphs or anything analytics
                    <br />
                    churn rates, etc
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
