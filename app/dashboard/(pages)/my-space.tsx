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
      <Header />
      <div className="space-y-4">
        
      </div>
      <Separator className="mt-4" />
      <BasicDetailsContent />
      <Separator className="mt-4" />
      <ProfessionalDetailsContent />
      <Separator className="mt-4" />
      <SocialMediaContent />
     
    </div>
  );
}

function Header(){
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return(
    <div className="flex justify-between items-center  bg-gray-100 relative">
    <div className="flex items-center space-x-4 p-4">
      <Image
        src="/path/to/profile-pic.jpg"
        alt="Profile Picture"
        width={50}
        height={50}
        className="rounded-full"
      />
      <div>
        <div className="text-lg font-semibold">John Doe</div>
        <div className="text-sm text-gray-500">Software Engineer</div>
        <div className="flex items-center">
          <span className="text-yellow-500">★★★★☆</span>
          <span className="ml-2 text-sm text-gray-500">(4.5)</span>
        </div>
      </div>
    </div>
    <div className="absolute text-red-500 text-sm top-0 right-0">
    {formattedDate}, {formattedTime}
    </div>
  </div>
  )
}
const Card = ({ title, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-blue-800">{title}</h2>
      {children}
    </div>
  );
};

const DetailRow = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-600 font-small">{label}</span>
      <span className="text-sm text-gray-800 font-medium text-xl">{value}</span>
    </div>
  );
};


function BasicDetailsContent() {
  return (
    <Card title="1. Basic Details">
    <div className="grid grid-rows-3 grid-cols-3 grid-flow-col gap-6">
    <DetailRow label="Full Name" value="John Doe" />
    <DetailRow label="Display Name" value="John" />
    <DetailRow label="Country/Region" value="🇮🇳 India" />
    <DetailRow label="State" value="Odisha" />
    <DetailRow label="Gender" value="Male" />
    <div></div>
    <div>
    <div className="grid place-content-between text-red-500 text-sm top-0 right-0">
    <div></div>
    <div> edit</div>
    </div>

    </div>
    </div>
  </Card>
  );
}
function ProfessionalDetailsContent() {
  return (
    <Card title="2. Professional Details">
    <div className="grid grid-rows-2 grid-cols-3 grid-flow-col gap-6">
    <DetailRow label="University/Company Name" value="Software Engineer" />
    <DetailRow label="Your Role" value="4 years" />
    <DetailRow label="Industry" value="React, Node.js, TypeScript" />
    <DetailRow label="Skills" value="SQA Labs" />
    <DetailRow label="Website Link" value="Software Engineer" />
    </div>
  </Card>
  );
}
function SocialMediaContent() {
  return (
    <Card title="3. Social Media Links">
    <div className="grid grid-rows-2 grid-cols-3 grid-flow-col gap-6">
    <DetailRow label="LinkedIn" value="https://www.linkedin.com/in/johndoe" />
    <DetailRow label="GitHub" value="github/johndoe" />
    <DetailRow label="Twitter" value="@johndoe" />
    <DetailRow label="Facebook" value="johndoe" />
    <DetailRow label="Instagram" value="johndoe" />
    </div>

  </Card>
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
