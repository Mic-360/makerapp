import * as React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function MySpacePage() {
  const sections = [
    { id: 1, title: 'Basic Details', content: <BasicDetailsContent /> },
    { id: 2, title: 'Rooms and Seats', content: <RoomsAndSeatsContent /> },
    { id: 3, title: 'Lab Mentors', content: <LabMentorsContent /> },
    { id: 4, title: 'Amenities', content: <AmenitiesContent /> },
    { id: 5, title: 'How to reach your space', content: <LocationContent /> },
  ];
  return (
    <div>
      <div className="space-y-4">
        {sections.map((section) => (
          <Collapsible key={section.id}>
            <CollapsibleTrigger className="flex w-full items-center justify-between border-t bg-white p-4">
              <span className="text-lg font-medium">
                {section.id}. {section.title}
              </span>
              <ChevronDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              {section.content}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <Separator className="mt-4" />
      <div className="my-8 flex justify-center">
        <Button variant="default" className="rounded-full px-10 py-6 text-md">
          Save and Preview
        </Button>
      </div>
    </div>
  );
}

function BasicDetailsContent() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="spaceName" className="pl-4 text-sm font-medium">
          Name of the space*
        </Label>
        <Input
          id="spaceName"
          placeholder="SQA FAB LAB"
          className="h-12 rounded-2xl border-black/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="spaceDescription" className="pl-4 text-sm font-medium">
          Space Description*
        </Label>
        <Textarea
          id="spaceDescription"
          className="min-h-[160px] rounded-2xl border-black/20 resize-none"
          maxLength={2000}
        />
        <p className="text-right text-sm text-gray-500 pr-4">0/2000 words</p>
      </div>
    </div>
  );
}

function RoomsAndSeatsContent() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-md font-semibold pl-4">
        Available Rooms and Seats
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="pl-4 text-sm">
            Category
          </Label>
          <Select>
            <SelectTrigger
              id="category"
              className="h-12 rounded-2xl border-black/20"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lab">Lab</SelectItem>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="roomName" className="pl-4 text-sm">
            Room Name/Number
          </Label>
          <Input id="roomName" className="h-12 rounded-2xl border-black/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seats" className="pl-4 text-sm">
            No. of Seats
          </Label>
          <Input
            id="seats"
            type="number"
            className="h-12 rounded-2xl border-black/20"
          />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-10 gap-2 text-sm font-medium rounded-2xl px-4 border-black/20"
      >
        <Plus className="h-4 w-4" /> Add More Rooms
      </Button>
    </div>
  );
}

function LabMentorsContent() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-md font-semibold pl-4">Lab Facilitators</div>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="pl-4 text-sm">
            Name
          </Label>
          <Input id="name" className="h-12 rounded-2xl border-black/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation" className="pl-4 text-sm">
            Select Designation
          </Label>
          <Select>
            <SelectTrigger
              id="designation"
              className="h-12 rounded-2xl border-black/20"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="mentor">Mentor</SelectItem>
              <SelectItem value="facilitator">Facilitator</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="pl-4 text-sm">
            Add LinkedIn Profile
          </Label>
          <Input
            id="linkedin"
            type="url"
            className="h-12 rounded-2xl border-black/20"
          />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-10 gap-2 text-sm font-medium px-4 rounded-2xl border-black/20"
      >
        <Plus className="h-4 w-4" /> Add More people
      </Button>
    </div>
  );
}

function AmenitiesContent() {
  const amenities = [
    ['WiFi', 'Medical Room', 'Washrooms'],
    ['Computers', 'Smoke Alarms', 'Conference Rooms'],
    ['TV Screen 32"', 'Fire Extinguishers', 'Meeting Room'],
    ['Projector', 'Emergency Exits', 'Water Cooler'],
    ['Speaker', 'CCTV Camera', 'Free parking'],
  ];

  return (
    <div className="p-6">
      <div className="text-md font-semibold mb-10">
        Select amenities available in your space
      </div>
      <div className="space-y-6 max-w-3xl">
        {amenities.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-6">
            {row.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-3">
                <Checkbox
                  id={amenity.toLowerCase().replace(/\s+/g, '-')}
                  className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={amenity.toLowerCase().replace(/\s+/g, '-')}
                  className="text-sm"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationContent() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="address" className="text-md font-semibold pl-4">
          Complete Address
        </Label>
        <Input
          id="address"
          className="h-12 rounded-2xl border-black/20"
          defaultValue="SQA University Campus 1, Khandagiri, Bhubaneswar, Odisha - 751030"
        />
      </div>
      <div className="space-y-6">
        {[
          'Nearest Airport',
          'Nearest Railway Station',
          'Nearest Metro',
          'Nearest Bus stop',
        ].map((label) => (
          <div key={label} className="space-y-2">
            <Label
              htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
              className="text-sm"
            >
              {label}
            </Label>
            <Input
              id={label.toLowerCase().replace(/\s+/g, '-')}
              className="h-12 rounded-2xl border-black/20"
            />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="text-md">Mark exact location on Map</div>
        <div className="bg-yellow-100 rounded-2xl py-1 px-4">
          <Image
            src="/world.svg"
            alt="World Map"
            width={400}
            height={200}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
