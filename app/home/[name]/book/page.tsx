'use client';

import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Event, Machine, Makerspace } from '@/lib/api';
import {
  fetchEventsByMakerspace,
  fetchMachinesByMakerspace,
  fetchMakerspaceByName,
} from '@/lib/api';
import { formatPrice } from '@/lib/utils';
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
  Speaker,
  Star,
  ThumbsUp,
  Tv,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LabSpacePage({ params }: { params: { name: string } }) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [makerspace, setMakerspace] = useState<Makerspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<{
    machineId?: string;
    eventId?: string;
  }>({});
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [machineDate, setMachineDate] = useState<Date | undefined>(new Date());
  const urlSearchParams = useSearchParams();

  const [machineQuantities, setMachineQuantities] = useState<number[]>([]);
  const [eventQuantities, setEventQuantities] = useState<number[]>([]);

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
  ];

  useEffect(() => {
    setSearchParams({
      machineId: urlSearchParams.get('machineId') ?? undefined,
      eventId: urlSearchParams.get('eventId') ?? undefined,
    });
  }, [urlSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedName = decodeURIComponent(params.name);
        const [makerspaceData, machinesData, eventsData] = await Promise.all([
          fetchMakerspaceByName(decodedName),
          fetchMachinesByMakerspace(decodedName),
          fetchEventsByMakerspace(decodedName),
        ]);

        setMakerspace(makerspaceData);
        setMachines(machinesData || []);
        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.name]);

  const initializeQuantities = (items: any[], selectedId?: string) => {
    return items.map((item) => (selectedId === item.id ? 1 : 0));
  };

  useEffect(() => {
    setMachineQuantities(
      initializeQuantities(machines, searchParams.machineId)
    );
    setEventQuantities(initializeQuantities(events, searchParams.eventId));
  }, [machines, events, searchParams]);

  const handleMachineQuantityChange = (index: number, increment: boolean) => {
    setMachineQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      if (machines[index].id === searchParams.machineId) {
        newQuantities[index] = increment
          ? newQuantities[index] + 1
          : Math.max(1, newQuantities[index] - 1);
      } else {
        newQuantities[index] = increment
          ? newQuantities[index] + 1
          : Math.max(0, newQuantities[index] - 1);
      }
      return newQuantities;
    });
  };

  const handleEventQuantityChange = (index: number, increment: boolean) => {
    setEventQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      if (events[index].id === searchParams.eventId) {
        newQuantities[index] = increment
          ? newQuantities[index] + 1
          : Math.max(1, newQuantities[index] - 1);
      } else {
        newQuantities[index] = increment
          ? newQuantities[index] + 1
          : Math.max(0, newQuantities[index] - 1);
      }
      return newQuantities;
    });
  };

  const calculateMachineTotalPrice = () => {
    return machines.reduce((total, machine, index) => {
      return total + machine.price * (machineQuantities[index] || 0);
    }, 0);
  };

  const calculateEventsTotalPrice = () => {
    return events.reduce((total, event, index) => {
      return total + event.ticket.price * (eventQuantities[index] || 0);
    }, 0);
  };

  const amenityIcons: { [key: string]: any } = {
    WiFi: Wifi,
    Computers: Monitor,
    'TV Screen': Tv,
    Speaker: Speaker,
    'Medical Room': BellRing,
    'Fire Extinguishers': FireExtinguisher,
    'Emergency Exits': DoorOpen,
    'CCTV Camera': Camera,
    'Conference Rooms': Building2,
    'Meeting Room': Building2,
    'Water Cooler': Coffee,
    'Free parking': Car,
  };

  const renderAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity];
    return IconComponent ? (
      <IconComponent className="h-4 w-4 text-orange-500" />
    ) : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const makerspaceImages = makerspace?.imageLinks || [
    '/assetlist.png',
    '/assetlist.png',
    '/assetlist.png',
  ];

  return (
    <>
      <TopBar theme="light" />
      <div className="min-h-screen bg-white pt-14">
        <div className="mx-auto py-8 px-4 md:px-20">
          {makerspace && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 font-semibold">S</span>
                  </div>
                  <h1 className="text-xl font-semibold">{makerspace?.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1 p-2">
                    <Star className="h-4 w-4 text-orange-500" />
                    {makerspace?.rating}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end items-end gap-x-4">
                <div className="grid grid-cols-3 gap-4 mb-8 w-10/12">
                  <div className="col-span-2">
                    <div className="aspect-[4/3] bg-gray-100 rounded-2xl">
                      <Image
                        src={makerspaceImages[0]}
                        alt={makerspace.name}
                        width={1000}
                        height={300}
                        className="rounded-lg h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {makerspaceImages.slice(1, 3).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-[4/3] bg-gray-100 rounded-2xl"
                      >
                        <Image
                          src={image}
                          alt={`${makerspace.name} ${index + 2}`}
                          width={1000}
                          height={300}
                          className="rounded-lg h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 w-2/12 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <p className="text-sm text-gray-600">
                      {makerspace.address}, {makerspace.city},{' '}
                      {makerspace.state} {makerspace.zipcode}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock10 className="h-4 w-4 text-orange-500" />
                    <p className="text-sm text-gray-600">
                      {makerspace.timings.monday} <br />
                      (Mon - Sat)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Link2 className="h-4 w-4 text-orange-500 -rotate-45" />
                    <Link
                      href={makerspace.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      Visit Website
                    </Link>
                  </div>
                </div>
              </div>
              <Tabs
                defaultValue={searchParams.machineId ? 'machines' : 'events'}
                className="mb-8"
              >
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

                <TabsContent value="machines">
                  <ScrollArea className="w-full whitespace-nowrap my-4">
                    <div className="flex gap-2">
                      {machines
                        .map((machine) => machine.category)
                        .filter(
                          (category, index, self) =>
                            self.indexOf(category) === index
                        )
                        .map((category, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full px-4 py-1 text-sm"
                          >
                            {category}
                          </Badge>
                        ))}
                    </div>
                  </ScrollArea>
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
                              <h3 className="font-bold">
                                {machine.brand} {machine.model}
                              </h3>
                              <div className="flex gap-x-4 items-center justify-center">
                                <Button
                                  className="hover:bg-orange-500 bg-black text-white aspect-square"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleMachineQuantityChange(index, false)
                                  }
                                >
                                  -
                                </Button>
                                <span>{machineQuantities[index]}</span>
                                <Button
                                  className="hover:bg-orange-500 bg-black text-white"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleMachineQuantityChange(index, true)
                                  }
                                >
                                  +
                                </Button>
                                <p className="text-sm font-semibold">
                                  ₹ {machine.price}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 max-w-sm">
                              {machine.description}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 max-w-sm flex items-center gap-x-1">
                              {machine.rating && (
                                <>
                                  {machine.rating}
                                  <Star className="h-2.5 w-2.5 inline-block text-orange-500 fill-orange-500" />
                                  {' | '}
                                </>
                              )}
                              {machine.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                    <Card className="p-6 flex flex-col justify-between">
                      <div className="text-center mb-6">
                        <p className="text-2xl font-semibold mb-1">
                          ₹ {calculateMachineTotalPrice()}/hr
                        </p>
                      </div>

                      <Calendar
                        mode="single"
                        selected={machineDate}
                        onSelect={setMachineDate}
                      />

                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot, index) => (
                            <SelectItem key={index} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button className="w-full">
                        <Link
                          href={`/home/${encodeURIComponent(makerspace?.name)}/book/payment`}
                        >
                          Request to Book
                        </Link>
                      </Button>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="events">
                  <ScrollArea className="w-full whitespace-nowrap my-4">
                    <div className="flex gap-2">
                      {events.map(({ id, category }) => (
                        <Badge
                          key={id}
                          variant="outline"
                          className="rounded-full px-4 py-1 text-sm"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex justify-between gap-x-10 my-4">
                    <ScrollArea className="h-[32rem] w-2/3 my-4">
                      {events.map((event, index) => (
                        <div key={index} className="flex gap-4 my-4">
                          <Image
                            src={event.imageLinks?.[0] || '/placeholder-2.png'}
                            alt={event.name}
                            width={100}
                            height={100}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold">{event.name}</h3>
                              <div className="flex gap-x-4 items-center justify-center">
                                <Button
                                  className="hover:bg-orange-500 bg-black text-white aspect-square"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleEventQuantityChange(index, false)
                                  }
                                >
                                  -
                                </Button>
                                <span>{eventQuantities[index]}</span>
                                <Button
                                  className="hover:bg-orange-500 bg-black text-white"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleEventQuantityChange(index, true)
                                  }
                                >
                                  +
                                </Button>
                                <p className="text-sm font-semibold">
                                  {event.ticket.type === 'Free'
                                    ? 'Free'
                                    : formatPrice(event.ticket.price)}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 max-w-sm">
                              {event.description}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.location}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.date.start} | {event.time.start}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                    <Card className="p-6">
                      <div className="text-center mb-6">
                        <p className="text-2xl font-semibold mb-1">
                          ₹ {calculateEventsTotalPrice()}
                        </p>
                      </div>

                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        className="mb-6"
                      />

                      <Button className="w-full mt-auto">
                        <Link
                          href={`/home/${encodeURIComponent(makerspace?.name)}/book/payment`}
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
                  <h2 className="text-lg font-medium mb-4">
                    About {makerspace?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 ml-4">
                    {makerspace?.description}
                  </p>
                </div>

                <hr className="mb-4" />
                <div className="mb-4 ml-4">
                  <h2 className="text-lg font-medium mb-4">
                    What this space offers
                  </h2>
                  <div className="grid grid-cols-3 gap-y-4 ml-4">
                    {makerspace?.amenities.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {renderAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <hr className="mb-4" />
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4 ml-4 ">
                  <Star className="h-4 w-4" />
                  <h2 className="text-lg font-semibold">
                    {makerspace?.rating}
                  </h2>
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
                    <span className="text-sm text-gray-600">4.2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Lab Experience</span>
                    <span className="text-sm text-gray-600">4.7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Machine Quality</span>
                    <span className="text-sm text-gray-600">4.4</span>
                  </div>
                </div>
              </div>
              <hr className="mb-4" />
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Contact the Lab
                    </h2>
                    <h3 className="text-md font-medium mb-2 flex gap-x-1 items-center">
                      <MapPin className="h-4 w-4 inline-block text-orange-500" />
                      <span>Location</span>
                    </h3>
                    <p className="text-sm text-gray-600 ml-8">
                      {makerspace?.address}
                    </p>

                    <h3 className="text-md font-medium mt-4 mb-2 flex gap-x-1 items-center">
                      <Star className="h-4 w-4 inline-block text-orange-500" />
                      <span>How to reach us</span>
                    </h3>
                    <p className="text-sm text-gray-600 ml-8">
                      {makerspace?.howToReach.map((instruction, index) => (
                        <span key={index}>
                          {instruction}
                          {index < makerspace.howToReach.length - 1 && <br />}
                        </span>
                      ))}
                    </p>

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
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
