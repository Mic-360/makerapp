'use client';

import Loading from '@/app/loading';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Event, Machine, Makerspace } from '@/lib/api';
import {
  fetchEventsByMakerspace,
  fetchMachinesByMakerspace,
  fetchMakerspaceByName,
} from '@/lib/api';
import { useBookingStore } from '@/lib/store';
import {
  BellRing,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleParking,
  Clock,
  Clock10,
  DoorOpen,
  FireExtinguisher,
  Link2,
  MapPin,
  MessageCircle,
  Minus,
  Monitor,
  Plus,
  Refrigerator,
  Speaker,
  Star,
  ThumbsUp,
  TvMinimal,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface Review {
  userName: string;
  userImage?: string;
  comment: string;
  rating: number;
  date: string;
}

const mockReviews: Review[] = [
  {
    userName: 'John Doe',
    userImage: '/assetlist.png',
    comment:
      'Great facilities and helpful staff at the lab space! Highly recommend. Would come again. worth the price. Great facilities and helpful staff at the lab space! Highly recommend. Would come again. worth the price.',
    rating: 4.5,
    date: '2024-01-15',
  },
  {
    userName: 'Jane Smith',
    userImage: '/assetlist.png',
    comment: 'Excellent equipment and workspace. Would definitely come back!',
    rating: 5,
    date: '2024-01-10',
  },
  {
    userName: 'Mike Johnson',
    userImage: '/assetlist.png',
    comment: 'Professional environment, worth the price. Will return!',
    rating: 4,
    date: '2024-01-05',
  },
];

export default function LabSpacePage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const bookingStore = useBookingStore();
  const urlSearchParams = useSearchParams();
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

  const [machineQuantities, setMachineQuantities] = useState<number[]>([]);
  const [eventQuantities, setEventQuantities] = useState<number[]>([]);
  const [selectedMachineCategory, setSelectedMachineCategory] = useState<
    string | null
  >(null);
  const [selectedEventCategory, setSelectedEventCategory] = useState<
    string | null
  >(null);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const timeSlots = ['10:00 am', '12:00 pm'];

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

  const initializeQuantities = (
    items: Machine[] | Event[],
    selectedId?: string
  ) => {
    return items.map((item) => (selectedId === item._id ? 1 : 0));
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

      newQuantities[index] = increment
        ? newQuantities[index] + 1
        : Math.max(0, newQuantities[index] - 1);
      return newQuantities;
    });
  };

  const handleEventQuantityChange = (index: number, increment: boolean) => {
    setEventQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];

      newQuantities[index] = increment
        ? newQuantities[index] + 1
        : Math.max(0, newQuantities[index] - 1);
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

  const handleRequestToBook = (type: 'machine' | 'event') => {
    if (!makerspace?.name) return;

    bookingStore.clearItems();

    if (type === 'machine') {
      machines.forEach((machine, index) => {
        if (machineQuantities[index] > 0) {
          bookingStore.addItem(
            {
              type: 'machine',
              id: machine._id,
              name: `${machine.brand} ${machine.model}`,
              price: machine.price,
              specifications: {
                Category: machine.category,
                Brand: machine.brand,
                Model: machine.model,
                Description: machine.description,
              },
              imageUrl: machine.imageLinks?.[0] || '/assetlist.png',
              location: machine.location,
              timeSlot: {
                start: machine.time.start,
                end: machine.time.end,
              },
              inCharge: machine.inCharge || [],
              makerSpace: machine.makerSpace,
            },
            machineQuantities[index]
          );
        }
      });
      if (machineDate) {
        bookingStore.setDate(machineDate);
      }
    } else {
      events.forEach((event, index) => {
        if (eventQuantities[index] > 0) {
          bookingStore.addItem(
            {
              type: 'event',
              id: event._id,
              name: event.name,
              price: event.ticket.price,
              specifications: {
                Category: event.category,
                Description: event.description,
                Agenda: event.agenda || '',
                Terms: event.terms || '',
                'Ticket Type': event.ticket.type,
                'Ticket Limit': event.ticketLimit.toString(),
              },
              imageUrl: event.imageLinks?.[0] || '/placeholder-2.png',
              location: event.location,
              timeSlot: {
                start: event.time.start,
                end: event.time.end,
              },
              date: {
                start: event.date.start,
                end: event.date.end,
              },
              experts: event.experts,
              makerSpace: event.makerSpace,
            },
            eventQuantities[index]
          );
        }
      });
      if (eventDate) {
        bookingStore.setDate(eventDate);
      }
    }

    router.push(`/home/${encodeURIComponent(makerspace.name)}/book/payment`);
  };

  const amenityIcons: { [key: string]: any } = {
    WiFi: Wifi,
    Computers: Monitor,
    'TV Screen': TvMinimal,
    Speaker: Speaker,
    'Medical Room': BellRing,
    'Fire Extinguishers': FireExtinguisher,
    'Emergency Exits': DoorOpen,
    'CCTV Camera': Camera,
    'Conference Rooms': Building2,
    'Meeting Room': Building2,
    'Water Cooler': Refrigerator,
    'Free parking': CircleParking,
  };

  const renderAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity];
    return IconComponent ? (
      <IconComponent className="h-4 w-4 text-orange-500" />
    ) : null;
  };

  const makerspaceImages = makerspace?.imageLinks || [
    '/assetlist.png',
    '/assetlist.png',
    '/assetlist.png',
  ];

  const renderAmenities = () => {
    return makerspace?.amenities.map((amenity, index) => (
      <div key={index} className="flex items-center gap-2">
        {renderAmenityIcon(amenity)}
        <span className="text-sm">{amenity}</span>
      </div>
    ));
  };

  const renderReviews = () => {
    return mockReviews.map((review, index) => (
      <div key={index} className="flex items-start gap-2 mb-4">
        <Image
          src={review.userImage || '/assetlist.png'}
          alt={review.userName}
          width={100}
          height={100}
          className="rounded-full object-cover h-20 w-20"
        />
        <div className="max-w-sm max-h-32 overflow-hidden">
          <h3 className="text-sm font-semibold">{review.userName}</h3>
          <div className="flex items-center gap-2">
            <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
            <span className="text-sm text-gray-600">{review.rating}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{review.date}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-ellipsis">
            {review.comment}
          </p>
        </div>
      </div>
    ));
  };

  const renderHowToReach = () => {
    if (!makerspace?.howToReach) return null;

    const transportModes = [
      {
        key: 'airport',
      },
      {
        key: 'railway',
      },
      {
        key: 'metro',
      },
      {
        key: 'bus',
      },
    ];

    return (
      <>
        {transportModes.map(({ key }) => {
          const value =
            makerspace?.howToReach &&
            makerspace.howToReach[key as keyof typeof makerspace.howToReach];
          if (!value) return null;

          return (
            <p
              key={key}
              className="text-sm text-gray-600 ml-8 flex items-center gap-2 mb-2"
            >
              <span>{value}</span>
            </p>
          );
        })}
      </>
    );
  };

  const filteredMachines = machines.filter(
    (machine) =>
      !selectedMachineCategory || machine.category === selectedMachineCategory
  );

  const filteredEvents = events.filter(
    (event) =>
      !selectedEventCategory || event.category === selectedEventCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <TopBar theme="light" />
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto">
          {makerspace && (
            <>
              <div className="flex items-center mt-6">
                <Image
                  src={`/assetlist.png`}
                  alt={makerspace.name}
                  width={300}
                  height={300}
                  className="h-10 w-10 mr-2 rounded-full object-cover"
                />
                <h1 className="text-xl font-semibold">{makerspace?.name}</h1>
              </div>

              <div className="flex justify-end items-end gap-x-4">
                <div className="mb-8 w-10/12">
                  <div className="flex items-center justify-end mb-1">
                    <div className="flex items-center">
                      <span className="text-md font-medium mr-1">
                        {makerspace?.rating}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= Math.floor(makerspace?.rating || 0) ? 'text-orange-500 fill-orange-500' : star === Math.ceil(makerspace?.rating || 0) ? 'text-orange-500 half-fill' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
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
                    <div className="space-y-2 col-span-1">
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
                </div>
                <div className="mb-8 w-full md:w-2/12 space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-10 w-10 text-orange-500" />
                    <p className="text-sm text-gray-600">
                      <span className="text-black font-semibold">
                        {makerspace.address}
                      </span>
                      , {makerspace.city}, {makerspace.state}{' '}
                      {makerspace.zipcode}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock10 className="h-5 w-5 text-orange-500" />
                    <p className="text-sm text-gray-600">
                      {makerspace.timings.monday} <br />
                      (Mon - Sat)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Link2 className="h-5 w-5 text-orange-500 -rotate-45" />
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
                <TabsList className="border-b w-full max-w-screen-md justify-start h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="machines"
                    className="rounded-none data-[state=active]:text-black data-[state=active]:font-semibold border-b-2 px-20 py-3 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100 w-1/2"
                  >
                    Machines
                  </TabsTrigger>
                  <TabsTrigger
                    value="events"
                    className="rounded-none data-[state=active]:text-black data-[state=active]:font-semibold border-b-2 px-20 py-3 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100 w-1/2"
                  >
                    Events
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="machines">
                  <div className="flex justify-between gap-x-10 my-4">
                    <div className="w-full">
                      <ScrollArea className="whitespace-nowrap my-4">
                        <div className="flex gap-2">
                          <Badge
                            key="all"
                            variant={
                              selectedMachineCategory === null
                                ? 'default'
                                : 'outline'
                            }
                            className="rounded-md px-6 py-2 text-sm cursor-pointer"
                            onClick={() => setSelectedMachineCategory(null)}
                          >
                            All
                          </Badge>
                          {machines
                            .map((machine) => machine.category)
                            .filter(
                              (category, index, self) =>
                                self.indexOf(category) === index
                            )
                            .map((category, index) => (
                              <Badge
                                key={index}
                                variant={
                                  selectedMachineCategory === category
                                    ? 'default'
                                    : 'outline'
                                }
                                className="rounded-md px-6 py-2 text-sm cursor-pointer"
                                onClick={() =>
                                  setSelectedMachineCategory(category)
                                }
                              >
                                {category}
                              </Badge>
                            ))}
                        </div>
                      </ScrollArea>
                      <Separator />
                      <ScrollArea className="flex-1 h-[32rem] w-full my-4">
                        {filteredMachines.map((machine, index) => (
                          <div
                            key={index}
                            className="flex gap-2 pb-4 mb-4 border-b"
                          >
                            <Image
                              src={machine?.imageLinks?.[0] || '/assetlist.png'}
                              alt={`${machine.brand} ${machine.model}`}
                              width={100}
                              height={100}
                              className="rounded-md object-cover aspect-square"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-sm">
                                  {machine.brand} {machine.model}
                                </h3>
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 rounded-md bg-orange-500 text-white border-orange-500"
                                      onClick={() =>
                                        handleMachineQuantityChange(
                                          index,
                                          false
                                        )
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-md text-gray-900 font-semibold">
                                      {machineQuantities[index]}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 rounded-md bg-orange-500 text-white border-orange-500"
                                      onClick={() =>
                                        handleMachineQuantityChange(index, true)
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <span className="text-gray-400 text-sm">
                                    Hours
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 max-w-md">
                                {machine.description}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Star className="h-3 w-3 text-orange-500 fill-orange-500 mr-1" />
                                <span>{machine.rating}</span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 rounded-md"
                                >
                                  {machine.category}
                                </Badge>
                                <span className="text-lg font-semibold mr-4">
                                  ₹{machine.price}/hr
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                    <div className="w-3/6">
                      <Card className="px-10 py-4 flex flex-col justify-center items-center">
                        <div className="text-center mb-4 border-b pb-4 w-full">
                          <p className="text-lg font-semibold">
                            ₹ {calculateMachineTotalPrice()}/hr
                          </p>
                          <p className="text-xs text-gray-500">
                            Gross Total(excluding tax)
                          </p>
                        </div>

                        {/* Calender  */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center my-3">
                            <h3 className="text-sm font-semibold uppercase">
                              Select dates
                            </h3>
                            <div className="text-sm font-medium flex items-center">
                              <Button
                                variant="ghost"
                                className="hover:bg-transparent"
                              >
                                <ChevronLeft />
                              </Button>
                              <span>June 2024</span>
                              <Button
                                variant="ghost"
                                className="hover:bg-transparent"
                              >
                                <ChevronRight />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-7 text-center text-xs mb-2">
                            {days.map((day, i) => (
                              <div key={i} className="py-1">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {Array.from({ length: 35 }, (_, i) => {
                              const day = i + 1;
                              const isSelected = day === 4;
                              return (
                                <div
                                  key={i}
                                  className={`py-1 rounded-full cursor-pointer ${
                                    isSelected
                                      ? 'bg-orange-500 text-white'
                                      : day < 4
                                        ? 'text-gray-300'
                                        : ''
                                  }`}
                                >
                                  {day <= 30 ? day : ''}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mb-4 border-y p-4 w-full">
                          <h3 className="text-sm font-semibold mb-2">
                            Select Timing
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {timeSlots.map((slot, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                className={`text-xs py-1 bg-orange-300 text-black`}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="px-8 py-2 rounded-full bg-black hover:bg-gray-800 font-semibold text-white my-3"
                          onClick={() => handleRequestToBook('machine')}
                        >
                          Request to Book
                        </Button>
                        <span className="text-gray-400 text-xs mb-4">
                          You won't be charged yet
                        </span>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="events">
                  <div className="flex justify-between gap-x-10 my-4">
                    <div className="w-full">
                      <ScrollArea className="whitespace-nowrap my-4">
                        <div className="flex gap-2">
                          <Badge
                            key="all"
                            variant={
                              selectedEventCategory === null
                                ? 'default'
                                : 'outline'
                            }
                            className="rounded-md px-6 py-2 text-sm cursor-pointer"
                            onClick={() => setSelectedEventCategory(null)}
                          >
                            All
                          </Badge>
                          {events
                            .map((event) => event.category)
                            .filter(
                              (category, index, self) =>
                                self.indexOf(category) === index
                            )
                            .map((category, index) => (
                              <Badge
                                key={index}
                                variant={
                                  selectedEventCategory === category
                                    ? 'default'
                                    : 'outline'
                                }
                                className="rounded-md px-6 py-2 text-sm cursor-pointer"
                                onClick={() =>
                                  setSelectedEventCategory(category)
                                }
                              >
                                {category}
                              </Badge>
                            ))}
                        </div>
                      </ScrollArea>
                      <Separator />
                      <ScrollArea className="flex-1 h-[32rem] w-full my-4">
                        {filteredEvents.map((event, index) => (
                          <div
                            key={index}
                            className="flex gap-2 pb-4 mb-4 border-b"
                          >
                            <Image
                              src={event?.imageLinks?.[0] || '/assetlist.png'}
                              alt={event.name}
                              width={100}
                              height={100}
                              className="rounded-md object-cover aspect-square"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-sm">
                                  {event.name}
                                </h3>
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 rounded-md bg-orange-500 text-white border-orange-500"
                                      onClick={() =>
                                        handleEventQuantityChange(index, false)
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-md text-gray-900 font-semibold">
                                      {eventQuantities[index]}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 rounded-md bg-orange-500 text-white border-orange-500"
                                      onClick={() => {
                                        if (
                                          eventQuantities[index] <
                                          event.ticketLimit
                                        ) {
                                          handleEventQuantityChange(
                                            index,
                                            true
                                          );
                                        }
                                      }}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <span className="text-gray-400 text-sm">
                                    Hours
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 max-w-md">
                                {event.description}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Star className="h-3 w-3 text-orange-500 fill-orange-500 mr-1" />
                                <span>{event.rating}</span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 rounded-md"
                                >
                                  {event.category}
                                </Badge>
                                <span className="text-lg font-semibold mr-4">
                                  ₹{event.ticket.price}/hr
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                    <div className="w-3/6">
                      <Card className="px-10 py-4 flex flex-col justify-center items-center">
                        <div className="text-center mb-4 border-b pb-4 w-full">
                          <p className="text-lg font-semibold">
                            ₹ {calculateEventsTotalPrice()}/hr
                          </p>
                          <p className="text-xs text-gray-500">
                            Gross Total(excluding tax)
                          </p>
                        </div>

                        {/* Calender  */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center my-3">
                            <h3 className="text-sm font-semibold uppercase">
                              Select dates
                            </h3>
                            <div className="text-sm font-medium flex items-center">
                              <Button
                                variant="ghost"
                                className="hover:bg-transparent"
                              >
                                <ChevronLeft />
                              </Button>
                              <span>June 2024</span>
                              <Button
                                variant="ghost"
                                className="hover:bg-transparent"
                              >
                                <ChevronRight />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-7 text-center text-xs mb-2">
                            {days.map((day, i) => (
                              <div key={i} className="py-1">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {Array.from({ length: 35 }, (_, i) => {
                              const day = i + 1;
                              const isSelected = day === 4;
                              return (
                                <div
                                  key={i}
                                  className={`py-1 rounded-full cursor-pointer ${
                                    isSelected
                                      ? 'bg-orange-500 text-white'
                                      : day < 4
                                        ? 'text-gray-300'
                                        : ''
                                  }`}
                                >
                                  {day <= 30 ? day : ''}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mb-4 border-y p-4 w-full">
                          <h3 className="text-sm font-semibold mb-2">
                            Select Timing
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {timeSlots.map((slot, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                className={`text-xs py-1 bg-orange-300 text-black`}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="px-8 py-2 rounded-full bg-black hover:bg-gray-800 font-semibold text-white my-3"
                          onClick={() => handleRequestToBook('event')}
                        >
                          Request to Book
                        </Button>
                        <span className="text-gray-400 text-xs mb-4">
                          You won't be charged yet
                        </span>
                      </Card>
                    </div>
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
                    {renderAmenities()}
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
                <div className="grid grid-cols-3 gap-y-4 ml-4 p-4">
                  {renderReviews()}
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
                    {renderHowToReach()}

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
                        window.open(`${makerspace?.googleMapLink}`, '_blank')
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
    </Suspense>
  );
}
