'use client';

import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@radix-ui/react-separator';
import {
  BellRing,
  Building2,
  Camera,
  Car,
  Clock,
  Clock10,
  Coffee,
  DoorOpen,
  FireExtinguisher,
  Link2,
  MapPin,
  MessageCircle,
  Monitor,
  Projector,
  Speaker,
  Star,
  ThumbsUp,
  Tv,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LabSpacePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showMore, setShowMore] = useState(false);

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
      name: 'Laser Cutter X500',
      description:
        'Cutting Area: 500 x 300 mm Laser Power: 50W Material: Acrylic, Wood, Leather',
      price: '700/hr',
      image: '/assetlist.png',
    },
    {
      name: 'Laser Cutter X500',
      description:
        'Cutting Area: 500 x 300 mm Laser Power: 50W Material: Acrylic, Wood, Leather',
      price: '700/hr',
      image: '/assetlist.png',
    },
    {
      name: 'CNC Router 4040-XE',
      description:
        'Working Area: 400 x 400 x 100 mm Spindle Speed: 8000-24000 RPM Material: Wood, Plastic, Soft Metals',
      price: '800/hr',
      image: '/assetlist.png',
    },
    {
      name: 'Vinyl Cutter VC-200',
      description:
        'Cutting Width: 200 mm Cutting Speed: 10-800 mm/s Material: Vinyl, Paper, Cardboard',
      price: '300/hr',
      image: '/assetlist.png',
    },
    {
      name: 'Vinyl Cutter VC-200',
      description:
        'Cutting Width: 200 mm Cutting Speed: 10-800 mm/s Material: Vinyl, Paper, Cardboard',
      price: '300/hr',
      image: '/assetlist.png',
    },
    {
      name: 'UV Printer UP-300',
      description:
        'Print Area: 300 x 200 mm Print Speed: 50mm/s Material: Plastic, Metal, Glass',
      price: '900/hr',
      image: '/assetlist.png',
    },
  ];

  const [quantities, setQuantities] = useState<number[]>([
    1,
    ...new Array(machines.length - 1).fill(0),
  ]);

  const events = [
    {
      price: '500',
      name: 'Design Seminar',
      location: 'Green Tech Center, Berlin, Germany',
      date: '2023-08-20',
      time: '10:00 - 12:00',
      categories: ['Seminar', 'Sustainability'],
      image: '/assetlist.png',
      description:
        'Explore sustainable design practices and their impact on product development and manufacturing.',
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
  ];

  const handleQuantityChange = (index: number, increment: boolean) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = increment
        ? newQuantities[index] + 1
        : index === 0
          ? Math.max(1, newQuantities[index] - 1)
          : Math.max(0, newQuantities[index] - 1);
      return newQuantities;
    });
  };

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
            <Badge variant="secondary" className="gap-1 p-2">
              <Star className="h-4 w-4 text-orange-500" />
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
                <p className="text-sm text-gray-600">SQA University Campus</p>
                <p className="text-sm text-gray-600">Khandagiri, Bhubaneswar</p>
                <p className="text-sm text-gray-600">Odisha, 751030</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock10 className="h-4 w-4 text-orange-500" />
              <p className="text-sm text-gray-600">
                9:00 AM - 6:00 PM <br />
                (Mon - Sat)
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
              className="rounded-none data-[state=active]:text-black data-[state=active]:font-semibold border-b-2 px-20 py-3 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100"
            >
              Machines
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="rounded-none data-[state=active]:text-black data-[state=active]:font-semibold border-b-2 px-20 py-3 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100"
            >
              Events
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="w-full whitespace-nowrap my-4">
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

          <TabsContent value="machines">
            <div className="flex justify-between gap-x-10 my-4">
              <ScrollArea className="h-[32rem] w-full my-4">
                {machines.map((machine, index) => (
                  <div key={index} className="flex gap-4 my-4">
                    <Image
                      src="/assetlist.png"
                      alt="Machine"
                      width={100}
                      height={200}
                      className="rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{machine.name}</h3>
                        <div className="flex gap-x-4 items-center justify-center">
                          <Button
                            className="hover:bg-orange-500 bg-black text-white aspect-square"
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, false)}
                          >
                            -
                          </Button>
                          <span>{quantities[index]}</span>
                          <Button
                            className="hover:bg-orange-500 bg-black text-white"
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, true)}
                          >
                            +
                          </Button>
                          <p className="text-sm font-semibold">
                            Rs {machine.price}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 max-w-sm">
                        {machine.description}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <Card className="p-6">
                <div className="text-center mb-6">
                  <p className="text-2xl font-semibold mb-1">
                    Rs {500 * quantities.reduce((a, b) => a + b, 0)} / hr
                  </p>
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
                  <Link
                    href={`/home/${encodeURIComponent(machines[0].makerspaceName)}/book/payment`}
                  >
                    Request to Book
                  </Link>
                </Button>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="events">
            <div className="flex justify-between gap-x-10 my-4">
              <ScrollArea className="h-[32rem] w-2/3 my-4">
                {events.map((event, index) => (
                  <div key={index} className="flex gap-4 my-4">
                    <Image
                      src={event.image}
                      alt={event.name}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{event.name}</h3>
                        <p className="text-sm font-semibold">
                          Rs {event.price}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.location}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.date} | {event.time}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {event.categories.map((category, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <Card className="p-6">
                <div className="text-center mb-6">
                  <p className="text-2xl font-semibold mb-1">
                    Rs {500 * quantities.reduce((a, b) => a + b, 0)} / hr
                  </p>
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
                  <Link
                    href={`/home/${encodeURIComponent(machines[0].makerspaceName)}/book/payment`}
                  >
                    Request to Book
                  </Link>
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="max-w-3xl">
          <hr className="mb-4" />
          <div className="mb-4 ml-4">
            <h2 className="text-lg font-medium mb-4">About SQA FAB Lab</h2>
            <p className="text-sm text-gray-600 mb-4 ml-4">
              We work together to build an impactful learning community where
              students are given the opportunity to engage in new experiences,
              develop their skills, and ignite curiosity. We welcome the diverse
              community into a FAB lab inclusive of culture and perspectives. We
              are committed to providing a safe and inclusive environment and
              continue to foster this community through access to peer support,
              training, diverse entrepreneurship, networking opportunities, and
              resources to turn ideas into reality.
            </p>
          </div>

          <hr className="mb-4" />
          <div className="mb-4 ml-4">
            <h2 className="text-lg font-medium mb-4">What this space offers</h2>
            <div className="grid grid-cols-3 gap-y-4 ml-4">
              {amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <amenity.icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{amenity.label}</span>
                </div>
              ))}
              {amenities.length > 4 && (
                <div className="col-span-3">
                  <Button
                    variant="link"
                    className="text-sm text-blue-600 -ml-4"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? 'Show Less' : 'Show More'}
                  </Button>
                </div>
              )}
              {showMore &&
                amenities.slice(4).map((amenity, index) => (
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
        </div>
        <hr className="mb-4" />
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4 ml-4 ">
            <Star className="h-4 w-4" />
            <h2 className="text-lg font-semibold">4.5</h2>
            <span className="text-sm font-bold">Ratings and Reviews</span>
          </div>

          <div className="grid grid-cols-4 gap-4 my-8 ml-8">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Location</span>
              <span className="text-sm text-gray-600">4.5</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Value for money</span>
              <span className="text-sm text-gray-600">4.5</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Lab Experience</span>
              <span className="text-sm text-gray-600">4.5</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Machine Quality</span>
              <span className="text-sm text-gray-600">4.5</span>
            </div>
          </div>
        </div>
        <hr className="mb-4" />
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact the Lab</h2>
              <h3 className="text-md font-medium mb-2 flex gap-x-1 items-center">
                <MapPin className="h-4 w-4 inline-block text-orange-500" />
                <span>Location</span>
              </h3>
              <p className="text-sm text-gray-600 ml-8">
                SQA University Campus 1, Khandagiri,
                <br />
                Bhubaneswar, Odisha - 751030
              </p>

              <h3 className="text-md font-medium mt-4 mb-2 flex gap-x-1 items-center">
                <Star className="h-4 w-4 inline-block text-orange-500" />
                <span>How to reach us</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-8">
                <li>2km from Bhubaneswar airport</li>
                <li>5km from Bhubaneswar Railway Station</li>
                <li>1km from Khandagiri metro station</li>
                <li>2km from Municipal metro station</li>
              </ul>

              <h3 className="text-md font-medium mt-4 mb-2 flex gap-x-1 items-center">
                <MessageCircle className="h-4 w-4 inline-block text-orange-500" />
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
      <Footer />
    </div>
  );
}
