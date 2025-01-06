'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Wifi,
  Monitor,
  Speaker,
  Tv,
  Projector,
  BellRing,
  FireExtinguisher,
  DoorOpen,
  Camera,
  Coffee,
  Car,
  Building2,
  Star,
  MapPin,
  Clock,
  ThumbsUp,
  MessageCircle,
  Clock10,
  Link2,
} from 'lucide-react';
import TopBar from '@/components/top-bar';
import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';
import Footer from '@/components/footer';
import Link from 'next/link';

export default function LabSpacePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const filters = [
    '3D Printer',
    'Laser',
    'Post Tools',
    'Wood CNC',
    'Laser Machine',
  ];

  const machines = [
    {
      name: '3D Printer Creality 333XP',
      description:
        'Max Build Size: 220 x 220 x 250 mm Print Speed: 30-60mm/s Nozzle: 0.4mm Material: PLA, ABS, PETG',
      price: '500/hr',
      image: '/assetlist.png',
    },
    {
      name: '3D Printer Creality 333XP',
      description:
        'Max Build Size: 220 x 220 x 250 mm Print Speed: 30-60mm/s Nozzle: 0.4mm Material: PLA, ABS, PETG',
      price: '500/hr',
      image: '/assetlist.png',
    },
    {
      name: '3D Printer Creality 333XP',
      description:
        'Max Build Size: 220 x 220 x 250 mm Print Speed: 30-60mm/s Nozzle: 0.4mm Material: PLA, ABS, PETG',
      price: '500/hr',
      image: '/assetlist.png',
    },
  ];

  const amenities = [
    { icon: Wifi, label: 'WiFi' },
    { icon: Monitor, label: 'Computers' },
    { icon: Tv, label: 'TV Screen 32"' },
    { icon: Projector, label: 'Projector' },
    { icon: Speaker, label: 'Speaker' },
    { icon: BellRing, label: 'Medical Room' },
    { icon: FireExtinguisher, label: 'Fire Extinguishers' },
    { icon: DoorOpen, label: 'Emergency Exits' },
    { icon: Camera, label: 'CCTV Camera' },
    { icon: Building2, label: 'Conference Rooms' },
    { icon: Building2, label: 'Meeting Room' },
    { icon: Coffee, label: 'Water Cooler' },
    { icon: Car, label: 'Free parking' },
  ];

  const facilitators = [
    {
      name: 'Mr. Suresh Nayak',
      role: 'Mentor',
      image: '/assetlist.png',
    },
    {
      name: 'Mr. Suresh Nayak',
      role: 'Lab Manager',
      image: '/assetlist.png',
    },
    {
      name: 'Mr. Suresh Nayak',
      role: 'Facilitator',
      image: '/assetlist.png',
    },
  ];

  const reviews = [
    {
      author: 'Pratham Raj',
      rating: 4.5,
      text: 'It was a pleasant experience working at the space. Everything was just great. Machine, staff, service, cleanliness all graded 5/5! Medical kit Single use items were very helpful.',
      image: '/assetlist.png',
    },
    {
      author: 'Sarit Moranth',
      rating: 4.5,
      text: 'It was a pleasant experience working at the space. Everything was just great. Machine, staff, service, cleanliness all graded 5/5! Medical kit Single use items were very helpful.',
      image: '/assetlist.png',
    },
    {
      author: 'Pratham Raj',
      rating: 4.5,
      text: 'It was a pleasant experience working at the space. Everything was just great. Machine, staff, service, cleanliness all graded 5/5! Medical kit Single use items were very helpful.',
      image: '/assetlist.png',
    },
    {
      author: 'Sarit Moranth',
      rating: 4.5,
      text: 'It was a pleasant experience working at the space. Everything was just great. Machine, staff, service, cleanliness all graded 5/5! Medical kit Single use items were very helpful.',
      image: '/assetlist.png',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopBar theme="light" />
      <Separator className="py-12" />
      <div className="mx-auto py-8 px-4 md:px-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-semibold">S</span>
            </div>
            <h1 className="text-xl font-semibold">SQA FAB Lab</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Star className="h-4 w-4" />
              4.5
            </Badge>
          </div>
        </div>

        <div className="flex justify-end items-end gap-x-4">
          <div className="grid grid-cols-3 gap-4 mb-8 w-10/12">
            <div className="col-span-2">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl">
                <Image
                  src="/assetlist.png"
                  alt="Machine"
                  width={1000}
                  height={300}
                  className="rounded-lg h-full"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl">
                <Image
                  src="/assetlist.png"
                  alt="Machine"
                  width={1000}
                  height={300}
                  className="rounded-lg h-full"
                />
              </div>
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl">
                <Image
                  src="/assetlist.png"
                  alt="Machine"
                  width={1000}
                  height={300}
                  className="rounded-lg h-full"
                />
              </div>
            </div>
          </div>

          <div className="mb-8 w-2/12 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">SQA University Campus 1</p>
                <p className="text-sm text-gray-600">Khandagiri, Bhubaneswar</p>
                <p className="text-sm text-gray-600">Odisha, 751030</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock10 className="h-4 w-4 text-orange-500" />
              <p className="text-sm text-gray-600">
                9:00 AM - 6:00 PM (Mon - Sat)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Link2 className="h-4 w-4 text-orange-500 -rotate-45" />
              <p className="text-sm text-gray-600">Visit Website</p>
            </div>
          </div>
        </div>
        <Tabs defaultValue="machines" className="mb-8">
          <TabsList className="border-b w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger
              value="machines"
              className="rounded-none border-b-2 px-20 py-4 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100"
            >
              Machines
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="rounded-none border-b-2 px-20 py-4 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100"
            >
              Events
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="w-full whitespace-nowrap mb-8">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant="outline"
                className="rounded-full px-4 py-1 text-sm"
              >
                {filter}
              </Badge>
            ))}
          </div>
        </ScrollArea>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-3">
            <div className="flex gap-x-4 items-start justify-between">
              <div className="max-w-4xl">
                <div className="space-y-6 mb-12">
                  {machines.map((machine, index) => (
                    <div key={index} className="flex gap-4 pr-20">
                      <Image
                        src="/assetlist.png"
                        alt="Machine"
                        width={100}
                        height={200}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{machine.name}</h3>
                          <p className="text-sm">Rs {machine.price}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {machine.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="mb-4" />
                <div className="mb-12 pl-4">
                  <h2 className="text-lg font-medium mb-4">
                    About SQA FAB Lab
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 ml-4">
                    We work together to build an impactful learning community
                    where students are given the opportunity to engage in new
                    experiences, develop their skills, and ignite curiosity. We
                    welcome the diverse community into a FAB lab inclusive of
                    culture and perspectives. We are committed to providing a
                    safe and inclusive environment and continue to foster this
                    community through access to peer support, training, diverse
                    entrepreneurship, networking opportunities, and resources to
                    turn ideas into reality.
                  </p>
                </div>
              </div>
              <div className="space-y-6 -mt-20">
                <Card className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-2xl font-semibold mb-1">Rs 500 / hr</p>
                    <p className="text-sm text-gray-600">June 2024</p>
                  </div>

                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="mb-6"
                  />

                  <div className="flex justify-between text-sm text-gray-600 mb-6 px-10">
                    <span>9:00 am</span>
                    <span>to</span>
                    <span>6:00 pm</span>
                  </div>

                  <Button className="w-full">
                    <Link href="/home/book/payment">Request to Book</Link>
                  </Button>
                </Card>
              </div>
            </div>

            <hr className="mb-4" />
            <div className="mb-12 ml-4">
              <h2 className="text-lg font-medium mb-4">
                What this space offers
              </h2>
              <div className="grid grid-cols-3 gap-y-4 ml-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <amenity.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="mb-4" />
            <div className="mb-12 ml-4">
              <h2 className="text-lg font-medium mb-4">Lab Facilitators</h2>
              <div className="flex gap-8 ml-4">
                {facilitators.map((facilitator, index) => (
                  <div
                    key={index}
                    className="text-center flex flex-col items-center justify-center"
                  >
                    <Avatar className="h-20 w-20 mb-2">
                      <AvatarImage src={facilitator.image} />
                      <AvatarFallback>SN</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-sm">{facilitator.name}</p>
                    <p className="text-sm text-gray-600">{facilitator.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="mb-4" />
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4 ml-4 ">
                <Star className="h-4 w-4" />
                <h2 className="text-lg font-semibold">4.5</h2>
                <span className="text-sm font-bold">Ratings and Reviews</span>
              </div>

              <div className="grid grid-cols-4 gap-4 my-8 ml-8">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Location</span>
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Value for money</span>
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">Lab Experience</span>
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">Machine Quality</span>
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
              </div>

              <div className="space-y-6 grid grid-cols-2 ml-10">
                {reviews.map((review, index) => (
                  <div key={index} className="flex gap-4 max-w-md items-start">
                    <Avatar>
                      <AvatarImage src={review.image} />
                      <AvatarFallback>PR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <p className="text-sm text-gray-600">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="mb-4" />
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Contact the Lab</h2>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-md font-medium mb-2 flex gap-x-1 items-center">
                    <MapPin className="h-4 w-4 inline-block" />
                    <span>Location</span>
                  </h3>
                  <p className="text-sm text-gray-600 ml-2">
                    SQA University Campus 1, Khandagiri,
                    <br />
                    Bhubaneswar, Odisha - 751030
                  </p>

                  <h3 className="text-md font-medium mt-4 mb-2 flex gap-x-1 items-center">
                    <Star className="h-4 w-4 inline-block" />
                    <span>How to reach us</span>
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1 ml-2">
                    <li>2km from Bhubaneswar airport</li>
                    <li>5km from Bhubaneswar Railway Station</li>
                    <li>1km from Khandagiri metro station</li>
                    <li>2km from Municipal metro station</li>
                  </ul>

                  <h3 className="text-md font-medium mt-4 mb-2 flex gap-x-1 items-center">
                    <MessageCircle className="h-4 w-4 inline-block" />
                    <span>Chat with Lab</span>
                  </h3>
                </div>
                <div className="flex flex-col gap-y-2 items-center">
                  <div className="bg-yellow-100 rounded-2xl py-1 px-4">
                    <Image
                      src="/world.svg"
                      alt="World Map"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                  <Button
                    variant="link"
                    className="text-lg"
                    onClick={() =>
                      window.open(
                        'https://maps.app.goo.gl/qjaRb4rr4dzq64NY7',
                        '_blank'
                      )
                    }
                  >
                    Find on Map →
                  </Button>{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
