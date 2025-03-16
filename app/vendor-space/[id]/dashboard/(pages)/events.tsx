'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  Edit,
  Filter,
  ImagePlus,
  Plus,
  PlusCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';

interface TicketType {
  type: string;
  price: string;
}

interface Expert {
  name: string;
  number: string;
}

interface Event {
  id: number;
  name: string;
  price: string;
  priceValue: string;
  category: string;
  timing: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  isOn: boolean;
  description?: string;
  agenda?: string;
  terms?: string;
  location?: string;
  ticketTypes?: TicketType[];
  totalTickets?: string;
  experts?: Expert[];
}

export default function EventsPage() {
  const [statusOpen, setStatusOpen] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: '3D Printing workshop',
      price: '₹ 500/hr',
      priceValue: '500',
      category: '3D Printer',
      timing: '10 AM - 3 AM',
      startDate: '25 Jun',
      endDate: '28 Jun, 2024',
      startTime: '10:00 a.m.',
      endTime: '12:00 p.m.',
      status: 'OFF',
      isOn: false,
      description: 'Learn 3D printing basics and techniques',
      agenda: 'Introduction to 3D printing, hands-on practice',
      terms: 'No refunds, participants must follow safety guidelines',
      location: 'Room 101, Main Building',
      ticketTypes: [
        { type: 'Standard', price: '500' },
        { type: 'Premium', price: '1000' },
      ],
      totalTickets: '50',
      experts: [
        { name: 'John Doe', number: '9876543210' },
        { name: 'Jane Smith', number: '8765432109' },
      ],
    },
  ]);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<string>('manage');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showEventTypeDropdown, setShowEventTypeDropdown] =
    useState<boolean>(false);

  const eventCategories = [
    'Workshops',
    'Webinar',
    'Meet Ups',
    'Boot Camp',
    'Seminar',
    'Training',
    'Competition',
    'Conference',
  ];

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Extract ticket types and prices
    const ticketTypes: TicketType[] = [];
    for (let i = 1; i <= 4; i++) {
      const type = formData.get(`ticketType${i}`)?.toString();
      const price = formData.get(`price${i}`)?.toString();
      if (type && price) {
        ticketTypes.push({ type, price });
      }
    }

    // Extract experts
    const experts: Expert[] = [];
    for (let i = 1; i <= 2; i++) {
      const name = formData.get(`expertName${i}`)?.toString();
      const number = formData.get(`expertNumber${i}`)?.toString();
      if (name && number) {
        experts.push({ name, number });
      }
    }

    const startDate = formData.get('startDate')?.toString() || '';
    const endDate = formData.get('endDate')?.toString() || '';
    const startTime = formData.get('startTime')?.toString() || '';
    const endTime = formData.get('endTime')?.toString() || '';

    const newEvent: Event = {
      id: events.length + 1,
      name: formData.get('name')?.toString() || '',
      price: ticketTypes.length > 0 ? `₹ ${ticketTypes[0].price}` : '₹ 0',
      priceValue: ticketTypes.length > 0 ? ticketTypes[0].price : '0',
      category: formData.get('category')?.toString() || '',
      timing: `${startDate} - ${endDate}`,
      startDate,
      endDate,
      startTime,
      endTime,
      status: 'OFF',
      isOn: false,
      description: formData.get('about')?.toString(),
      agenda: formData.get('agenda')?.toString(),
      terms: formData.get('terms')?.toString(),
      location: formData.get('location')?.toString(),
      ticketTypes,
      totalTickets: formData.get('totalTickets')?.toString(),
      experts,
    };

    setEvents([...events, newEvent]);
    setAddDialogOpen(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleEditEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentEvent) return;

    const formData = new FormData(e.currentTarget);

    // Extract ticket types and prices
    const ticketTypes: TicketType[] = [];
    for (let i = 1; i <= 4; i++) {
      const type = formData.get(`ticketType${i}`)?.toString();
      const price = formData.get(`price${i}`)?.toString();
      if (type && price) {
        ticketTypes.push({ type, price });
      }
    }

    // Extract experts
    const experts: Expert[] = [];
    for (let i = 1; i <= 2; i++) {
      const name = formData.get(`expertName${i}`)?.toString();
      const number = formData.get(`expertNumber${i}`)?.toString();
      if (name && number) {
        experts.push({ name, number });
      }
    }

    const startDate = formData.get('startDate')?.toString() || '';
    const endDate = formData.get('endDate')?.toString() || '';

    const updatedEvents = events.map((event) => {
      if (event.id === currentEvent.id) {
        return {
          ...event,
          name: formData.get('name')?.toString() || '',
          price: ticketTypes.length > 0 ? `₹ ${ticketTypes[0].price}` : '₹ 0',
          priceValue: ticketTypes.length > 0 ? ticketTypes[0].price : '0',
          category: formData.get('category')?.toString() || '',
          timing: `${startDate} - ${endDate}`,
          startDate,
          endDate,
          startTime: formData.get('startTime')?.toString() || '',
          endTime: formData.get('endTime')?.toString() || '',
          description: formData.get('about')?.toString(),
          agenda: formData.get('agenda')?.toString(),
          terms: formData.get('terms')?.toString(),
          location: formData.get('location')?.toString(),
          ticketTypes,
          totalTickets: formData.get('totalTickets')?.toString(),
          experts,
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setEditDialogOpen(false);
  };

  const openEditDialog = (event: Event) => {
    setCurrentEvent(event);
    setEditDialogOpen(true);
  };

  const toggleEventStatus = (id: number) => {
    setEvents(
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              isOn: !event.isOn,
              status: !event.isOn ? 'ON' : 'OFF',
            }
          : event
      )
    );
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
    setEditDialogOpen(false);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value)}>
          <TabsList className="bg-transparent space-x-2">
            <TabsTrigger
              value="manage"
              className="px-12 py-3 data-[state=active]:bg-black data-[state=active]:text-white border rounded-xl border-black"
            >
              Manage
            </TabsTrigger>
            <TabsTrigger
              value="monitor"
              className="px-12 py-3 data-[state=active]:bg-black data-[state=active]:text-white border rounded-xl border-black"
            >
              Monitor
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4">
          <div className="text-orange-500 font-medium">Mon 5 Aug, 4:11 PM</div>
          <div className="relative">
            <Select defaultValue="monthly">
              <SelectTrigger className="w-[100px] border-gray-200">
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
            <Switch checked={statusOpen} onCheckedChange={setStatusOpen} />
            <span
              className={`text-xs ${statusOpen ? 'text-green-500' : 'text-red-500'} font-medium`}
            >
              Status: {statusOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {viewMode === 'manage' && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <div className="relative">
                <DropdownMenu
                  open={showEventTypeDropdown}
                  onOpenChange={setShowEventTypeDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-medium"
                    >
                      All Events
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {eventCategories.map((category) => (
                      <DropdownMenuItem key={category}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <TabsList className="bg-transparent ml-4">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="draft"
                  className="data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Draft
                </TabsTrigger>
                <TabsTrigger
                  value="trash"
                  className="data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Trash
                </TabsTrigger>
              </TabsList>

              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full bg-transparent text-black ml-4"
                  >
                    Add
                    <PlusCircle className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white max-w-xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add an events</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="Hackathon">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Event Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter event name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <div className="relative">
                          <Select name="startDate" defaultValue="">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="25 Jun">25 Jun</SelectItem>
                              <SelectItem value="26 Jun">26 Jun</SelectItem>
                              <SelectItem value="27 Jun">27 Jun</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <div className="relative">
                          <Select name="endDate" defaultValue="">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="28 Jun, 2024">
                                28 Jun, 2024
                              </SelectItem>
                              <SelectItem value="29 Jun, 2024">
                                29 Jun, 2024
                              </SelectItem>
                              <SelectItem value="30 Jun, 2024">
                                30 Jun, 2024
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Timings</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="startTime"
                          name="startTime"
                          defaultValue="10:00 a.m."
                          className="flex-1"
                        />
                        <span className="text-sm">to</span>
                        <Input
                          id="endTime"
                          name="endTime"
                          defaultValue="12:00 p.m."
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ticket Type and Price</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm mr-2">1.</span>
                            <Input
                              name="ticketType1"
                              placeholder="Ticket type"
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">2.</span>
                            <Input
                              name="ticketType2"
                              placeholder="Ticket type"
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">3.</span>
                            <Input
                              name="ticketType3"
                              placeholder="Ticket type"
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">4.</span>
                            <Input
                              name="ticketType4"
                              placeholder="Ticket type"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              ₹
                            </span>
                            <Input
                              name="price1"
                              placeholder="Price"
                              className="pl-7"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              ₹
                            </span>
                            <Input
                              name="price2"
                              placeholder="Price"
                              className="pl-7"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              ₹
                            </span>
                            <Input
                              name="price3"
                              placeholder="Price"
                              className="pl-7"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              ₹
                            </span>
                            <Input
                              name="price4"
                              placeholder="Price"
                              className="pl-7"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalTickets">
                        Total Tickets to be sold in single purchase
                      </Label>
                      <Input
                        id="totalTickets"
                        name="totalTickets"
                        placeholder="Enter number"
                      />
                      <p className="text-xs text-gray-500">
                        You can add up to 4 tickets only
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Add event posters/images</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          'Banner Image',
                          'Display Image',
                          'Event Logo',
                          'Other',
                        ].map((type, i) => (
                          <div
                            key={i}
                            className="border rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 p-2 text-center"
                          >
                            <ImagePlus className="h-6 w-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400">
                              {type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="about">About</Label>
                      <Textarea
                        id="about"
                        name="about"
                        placeholder="Event description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agenda">Agenda</Label>
                      <Textarea
                        id="agenda"
                        name="agenda"
                        placeholder="Event agenda"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terms">Terms and Conditions</Label>
                      <Textarea
                        id="terms"
                        name="terms"
                        placeholder="Terms and conditions"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">
                        Event's room, number and building
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter location details"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Workshop Experts</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expertName1" className="text-xs">
                            Name
                          </Label>
                          <Input
                            id="expertName1"
                            name="expertName1"
                            placeholder="Expert name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expertNumber1" className="text-xs">
                            Number
                          </Label>
                          <Input
                            id="expertNumber1"
                            name="expertNumber1"
                            placeholder="Contact number"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Input name="expertName2" placeholder="Expert name" />
                        </div>
                        <div>
                          <Input
                            name="expertNumber2"
                            placeholder="Contact number"
                          />
                        </div>
                      </div>
                      <Button variant="link" className="text-xs p-0 h-auto">
                        + Add people
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800"
                    >
                      Save and Submit
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <TabsContent value="all" className="mt-0">
              {showSuccess && (
                <Card className="p-4 mb-4 bg-white border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <p>
                      Congratulations, your event has been submitted for review.
                    </p>
                  </div>
                </Card>
              )}

              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-red-300 p-3 text-sm font-medium">
                  <div className="col-span-3 flex items-center">
                    Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Price
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-3 flex items-center">
                    Category
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>

                {events.length > 0 ? (
                  <div>
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-500" />
                          </div>
                          <span>{event.name}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.price}
                        </div>
                        <div className="col-span-3 flex items-center">
                          {event.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.timing}
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={event.isOn}
                            onCheckedChange={() => toggleEventStatus(event.id)}
                          />
                          <Badge
                            variant="outline"
                            className={`${
                              event.isOn
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {event.isOn ? 'ON' : 'OFF'}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-gray-500">Add events</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
                  <div className="col-span-3 flex items-center">
                    Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Price
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-3 flex items-center">
                    Category
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>

                <div>
                  {events
                    .filter((e) => e.isOn)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-500" />
                          </div>
                          <span>{event.name}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.price}
                        </div>
                        <div className="col-span-3 flex items-center">
                          {event.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.timing}
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={event.isOn}
                            onCheckedChange={() => toggleEventStatus(event.id)}
                          />
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            ON
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                {events.filter((e) => e.isOn).length === 0 && (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="text-gray-500">No active events</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No draft events</div>
              </div>
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No events in trash</div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {viewMode === 'monitor' && (
        <div className="space-y-6">
          <div className="rounded-md border">
            <div className="grid grid-cols-11 bg-orange-100 p-3 text-sm font-medium">
              <div className="col-span-3 flex items-center">
                Name
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Price
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Category
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Attendees
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Status
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </div>

            {events.length > 0 ? (
              <div>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="grid grid-cols-11 p-3 text-sm border-t"
                  >
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-gray-500" />
                      </div>
                      <span>{event.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      {event.price}
                    </div>
                    <div className="col-span-2 flex items-center">
                      {event.category}
                    </div>
                    <div className="col-span-2 flex items-center">
                      0 registered
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Switch
                        checked={event.isOn}
                        onCheckedChange={() => toggleEventStatus(event.id)}
                      />
                      <span
                        className={
                          event.isOn ? 'text-green-600' : 'text-gray-500'
                        }
                      >
                        {event.isOn ? 'Online' : 'Offline'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-gray-500">Add events</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit an events</DialogTitle>
          </DialogHeader>
          {currentEvent && (
            <form onSubmit={handleEditEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select name="category" defaultValue={currentEvent.category}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Event Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={currentEvent.name}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <div className="relative">
                    <Select
                      name="startDate"
                      defaultValue={currentEvent.startDate}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25 Jun">25 Jun</SelectItem>
                        <SelectItem value="26 Jun">26 Jun</SelectItem>
                        <SelectItem value="27 Jun">27 Jun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <div className="relative">
                    <Select name="endDate" defaultValue={currentEvent.endDate}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="28 Jun, 2024">
                          28 Jun, 2024
                        </SelectItem>
                        <SelectItem value="29 Jun, 2024">
                          29 Jun, 2024
                        </SelectItem>
                        <SelectItem value="30 Jun, 2024">
                          30 Jun, 2024
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Timings</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-startTime"
                    name="startTime"
                    defaultValue={currentEvent.startTime}
                    className="flex-1"
                  />
                  <span className="text-sm">to</span>
                  <Input
                    id="edit-endTime"
                    name="endTime"
                    defaultValue={currentEvent.endTime}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ticket Type and Price</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{i}.</span>
                        <Input
                          name={`ticketType${i}`}
                          placeholder="Ticket type"
                          defaultValue={
                            currentEvent.ticketTypes &&
                            currentEvent.ticketTypes[i - 1]?.type
                          }
                          className="flex-1"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          ₹
                        </span>
                        <Input
                          name={`price${i}`}
                          placeholder="Price"
                          defaultValue={
                            currentEvent.ticketTypes &&
                            currentEvent.ticketTypes[i - 1]?.price
                          }
                          className="pl-7"
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-totalTickets">Total Tickets</Label>
                <Input
                  id="edit-totalTickets"
                  name="totalTickets"
                  defaultValue={currentEvent.totalTickets}
                />
              </div>

              <div className="space-y-2">
                <Label>Add event posters/images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Banner Image', 'Display Image', 'Event Logo'].map(
                    (type, i) => (
                      <div
                        key={i}
                        className="border rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 p-2 text-center"
                      >
                        <ImagePlus className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-400">{type}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-terms">Terms and Conditions</Label>
                <Textarea
                  id="edit-terms"
                  name="terms"
                  defaultValue={currentEvent.terms}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">
                  Event's room, number and building
                </Label>
                <Input
                  id="edit-location"
                  name="location"
                  defaultValue={currentEvent.location}
                />
              </div>

              <div className="space-y-2">
                <Label>Workshop Experts</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-expertName1" className="text-xs">
                      Name
                    </Label>
                    <Input
                      id="edit-expertName1"
                      name="expertName1"
                      defaultValue={
                        currentEvent.experts && currentEvent.experts[0]?.name
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-expertNumber1" className="text-xs">
                      Number
                    </Label>
                    <Input
                      id="edit-expertNumber1"
                      name="expertNumber1"
                      defaultValue={
                        currentEvent.experts && currentEvent.experts[0]?.number
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Input
                      name="expertName2"
                      defaultValue={
                        currentEvent.experts && currentEvent.experts[1]?.name
                      }
                    />
                  </div>
                  <div>
                    <Input
                      name="expertNumber2"
                      defaultValue={
                        currentEvent.experts && currentEvent.experts[1]?.number
                      }
                    />
                  </div>
                </div>
                <Button variant="link" className="text-xs p-0 h-auto">
                  + Add people
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Would you like to delete this machine?</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => deleteEvent(currentEvent.id)}
                  >
                    YES
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    NO
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-black hover:bg-gray-800 px-8"
                >
                  Save
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
