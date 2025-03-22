"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowUp, ImageIcon, Mic } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MessagesPage() {
  const [statusOpen, setStatusOpen] = useState(false);
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
      <div className="flex justify-between gap-4">
        <div className="flex-1 bg-white rounded-lg border overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src="/assetlist.png"
                  alt="Event"
                  width={40}
                  height={40}
                  className="object-cover aspect-square"
                />
              </div>
              <div>
                <div className="font-medium">Simran Aroa</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="text-center text-xs text-gray-500 my-2">
              We analyze messages for safety, support, product enhancement or
              other purposes. <span className="text-blue-600">Learn more</span>
            </div>

            <div className="text-center text-xs text-gray-500 my-2">
              To protect your payment, always communicate and pay through the
              Karkhana website or app.
            </div>

            <div className="flex justify-end mb-4">
              <div className="text-xs text-gray-500 mb-1">
                Simran Arora, 5:45 PM
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <div className="bg-gray-800 text-white rounded-lg p-3 max-w-[80%]">
                Hi. My booking is for a 3-D Printer on 25th August? What all
                materials are available?
              </div>
            </div>

            <div className="flex mb-4">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                <Image
                  src="/assetlist.png"
                  alt="Event"
                  width={40}
                  height={40}
                  className="object-cover aspect-square"
                />
              </div>
              <div className="bg-gray-800 text-white rounded-lg p-3 max-w-[80%]">
                How long will it take for 4x4x4 cm print?
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <div className="bg-green-500 text-white rounded-lg p-3 max-w-[80%]">
                Yes, your booking is confirmed. We have PLA 2 cm wire. It will
                approximately take 2 hrs to print the entire design.
              </div>
            </div>

            <div className="flex justify-end items-center mb-4">
              <div className="text-xs text-gray-500">Read by Simran</div>
            </div>

            <div className="flex justify-end mb-4">
              <div className="text-xs text-gray-500 mb-1">
                Simran Arora, 5:45 PM
              </div>
            </div>

            <div className="flex mb-4">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                <Image
                  src="/assetlist.png"
                  alt="Event"
                  width={40}
                  height={40}
                  className="object-cover aspect-square"
                />
              </div>
              <div className="bg-gray-800 text-white rounded-lg p-3 max-w-[80%]">
                Okay, thank you for the information.
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message here"
                className="flex-1"
              />
              <Button className="p-2 rounded-full hover:bg-gray-100">
                <ImageIcon className="h-5 w-5 text-gray-500" />
              </Button>
              <Button className="p-2 rounded-full hover:bg-gray-100">
                <Mic className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-80 ml-4 rounded-lg border border-blue-300 overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-blue-100 flex items-center justify-between">
            <div className="font-medium">All Messages</div>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-blue-200">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-blue-200">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-3 border-b hover:bg-blue-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src="/assetlist.png"
                    alt="Event"
                    width={40}
                    height={40}
                    className="object-cover aspect-square"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">Simran Aroa</div>
                    <div className="text-xs text-gray-500">25 Aug</div>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    Okay, thank you for the information.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-b hover:bg-blue-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src="/assetlist.png"
                    alt="Event"
                    width={40}
                    height={40}
                    className="object-cover aspect-square"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">Karkhana Support</div>
                    <div className="text-xs text-gray-500">25 Aug</div>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    Okay, thank you for the information.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
