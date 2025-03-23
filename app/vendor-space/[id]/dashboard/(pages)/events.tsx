'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as DatePicker } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  createEvent,
  fetchEventsByMakerspace,
  Makerspace,
  updateEvent,
  updateMakerspace,
} from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Edit,
  Filter,
  ImageIcon,
  ImagePlus,
  Plus,
  PlusCircle,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Event } from '@/lib/api';
import Image from 'next/image';

interface MySpacePageProps {
  makerspace: Makerspace;
  setMakerspace: React.Dispatch<React.SetStateAction<Makerspace | null>>;
}

export default function EventsPage({
  makerspace: initialMakerspace,
  setMakerspace,
}: MySpacePageProps) {
  const { token } = useAuthenticationStore();
  const [error, setError] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(
    initialMakerspace.status === 'active'
  );
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<string>('manage');
  const [activeTab, setActiveTab] = useState<string>('active');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Events');

  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

  const handleStatusChange = async (checked: boolean) => {
    if (!token) return;

    setIsLoading(true);
    setStatusOpen(checked);
    try {
      const updatedData = {
        status: checked ? 'active' : 'inactive',
      };

      await updateMakerspace(initialMakerspace._id, updatedData, token);

      setMakerspace({
        ...initialMakerspace,
        status: checked ? 'active' : 'inactive',
      });
    } catch (error) {
      console.error('Error updating makerspace status:', error);
      // Revert the switch state if there's an error
      setStatusOpen(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return [];

    // TODO: Implement image upload to storage service
    // For now, we'll just store the file names
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    return imageUrls;
  };

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    if (!token) return;

    try {
      // Basic required fields
      const name = formData.get('name')?.toString();
      const category = formData.get('category')?.toString();
      const description = formData.get('about')?.toString();
      const location = formData.get('location')?.toString();
      const ticketType = formData.get('ticketType1')?.toString();
      const ticketPrice = parseFloat(formData.get('price1')?.toString() || '0');
      const ticketLimit = parseInt(
        formData.get('totalTickets')?.toString() || '0',
        10
      );

      // Validate required fields
      if (
        !name ||
        !category ||
        !description ||
        !location ||
        !ticketType ||
        !ticketPrice
      ) {
        setError('Please fill in all required fields');
        return;
      }

      if (ticketLimit <= 0) {
        setError('Ticket limit must be greater than zero');
        return;
      }

      if (!startDate || !endDate) {
        setError('Please select both start and end dates');
        return;
      }

      // Handle image upload
      const imageLinks = await handleImageUpload(selectedImages);

      // Format dates
      const startTime = formData.get('startTime')?.toString() || '';
      const endTime = formData.get('endTime')?.toString() || '';

      // Extract experts
      const experts = [];
      for (let i = 1; i <= 2; i++) {
        const name = formData.get(`expertName${i}`)?.toString();
        const number = formData.get(`expertNumber${i}`)?.toString();
        if (name && number) {
          experts.push({ name, number });
        }
      }

      const newEventData = {
        name,
        category,
        date: {
          start: format(startDate, 'yyyy-MM-dd'),
          end: format(endDate, 'yyyy-MM-dd'),
        },
        time: {
          start: startTime,
          end: endTime,
        },
        ticket: {
          type: ticketType,
          price: ticketPrice,
        },
        ticketLimit,
        description,
        agenda: formData.get('agenda')?.toString(),
        terms: formData.get('terms')?.toString(),
        location,
        experts,
        makerSpace: initialMakerspace.name,
        imageLinks,
      };

      const createdEvent = await createEvent(newEventData, token);
      setEvents([...events, createdEvent]);
      setAddDialogOpen(false);
      setShowSuccess(true);

      // Reset form state
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedImages(null);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    }
  };

  const handleEditEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentEvent?._id) return;
    setError(null);

    if (!token) return;

    try {
      const formData = new FormData(e.currentTarget);

      // Basic required fields
      const name = formData.get('name')?.toString();
      const category = formData.get('category')?.toString();
      const description = formData.get('about')?.toString();
      const location = formData.get('location')?.toString();
      const ticketType = formData.get('ticketType1')?.toString();
      const ticketPrice = parseFloat(formData.get('price1')?.toString() || '0');
      const ticketLimit = parseInt(
        formData.get('totalTickets')?.toString() || '0',
        10
      );

      // Validate required fields
      if (
        !name ||
        !category ||
        !description ||
        !location ||
        !ticketType ||
        !ticketPrice
      ) {
        setError('Please fill in all required fields');
        return;
      }

      if (ticketLimit <= 0) {
        setError('Ticket limit must be greater than zero');
        return;
      }

      // Format dates
      const startDate = formData.get('startDate')?.toString() || '';
      const endDate = formData.get('endDate')?.toString() || '';
      const startTime = formData.get('startTime')?.toString() || '';
      const endTime = formData.get('endTime')?.toString() || '';

      // Extract experts
      const experts = [];
      for (let i = 1; i <= 2; i++) {
        const name = formData.get(`expertName${i}`)?.toString();
        const number = formData.get(`expertNumber${i}`)?.toString();
        if (name && number) {
          experts.push({ name, number });
        }
      }

      const updatedEventData = {
        name,
        category,
        date: {
          start: startDate,
          end: endDate,
        },
        time: {
          start: startTime,
          end: endTime,
        },
        ticket: {
          type: ticketType,
          price: ticketPrice,
        },
        ticketLimit,
        description,
        agenda: formData.get('agenda')?.toString(),
        terms: formData.get('terms')?.toString(),
        location,
        experts,
      };

      const updatedEvent = await updateEvent(
        currentEvent._id,
        updatedEventData,
        token
      );
      setEvents(
        events.map((event) =>
          event._id === currentEvent._id ? { ...event, ...updatedEvent } : event
        )
      );

      setEditDialogOpen(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please try again.');
    }
  };

  const toggleEventStatus = async (id: string) => {
    if (!token) return;
    try {
      const event = events.find((e) => e._id === id);
      if (!event) return;

      const newStatus = event.status === 'active' ? 'inactive' : 'active';
      const updatedEvent = await updateEvent(id, { status: newStatus }, token);

      setEvents(
        events.map((event) =>
          event._id === id ? { ...event, ...updatedEvent } : event
        )
      );
    } catch (error) {
      console.error('Error toggling event status:', error);
      setError('Failed to update event status');
    }
  };

  const openEditDialog = (event: Event) => {
    setCurrentEvent(event);
    setEditDialogOpen(true);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event._id !== id));
    setEditDialogOpen(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await fetchEventsByMakerspace(
          initialMakerspace.name
        );
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    if (initialMakerspace.name) {
      fetchEvents();
    }
  }, [initialMakerspace.name]);

  const eventCategories = [
    'All Events',
    ...Array.from(new Set(events.map((event) => event.category))).filter(
      Boolean
    ),
  ];

  const filteredEvents = events.filter((event) => {
    if (selectedCategory === 'All Events') return true;
    return event.category === selectedCategory;
  });

  return (
    <div className="space-y-4 pt-2">
      {error && (
        <Card className="p-4 mb-4 bg-white border-red-200">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-100 p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-red-600">{error}</p>
          </div>
        </Card>
      )}

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
        <div className="flex items-center justify-end gap-8">
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
              onCheckedChange={handleStatusChange}
              showStatus
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {viewMode === 'manage' && (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center">
              <div className="relative">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  defaultValue="All Events"
                >
                  <SelectTrigger className="border-none text-sm space-x-2 shadow-none">
                    <SelectValue placeholder="All Events" />
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

              <TabsList className="bg-transparent">
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !startDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate
                                ? format(startDate, 'PPP')
                                : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DatePicker
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !endDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DatePicker
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setSelectedImages(e.target.files)}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="col-span-4 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-50 text-center"
                        >
                          <ImagePlus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload images
                          </span>
                        </label>
                        {selectedImages && (
                          <div className="col-span-4 space-y-2">
                            {Array.from(selectedImages).map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm truncate">
                                  {file.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const dt = new DataTransfer();
                                    Array.from(selectedImages).forEach(
                                      (f, i) => {
                                        if (i !== index) dt.items.add(f);
                                      }
                                    );
                                    setSelectedImages(dt.files);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
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

          <div className="rounded-md shadow-xl bg-white">
            <TabsContent value="active" className="mt-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
                  <div className="col-span-1 flex items-center">
                    <ImageIcon className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-4 flex items-center">
                    Name
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Price
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Category
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">Status</div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>

                <div>
                  {filteredEvents
                    .filter((e) => e.status === 'active')
                    .map((event) => (
                      <div
                        key={event._id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-1 flex items-center gap-2">
                          <Image
                            src={event?.imageLinks?.[0] || ''}
                            alt="Event"
                            width={200}
                            height={200}
                            className="object-cover h-10 w-10 rounded"
                          />
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                          <span>{event.name}</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          Rs{event.ticket.price}/hr
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.time.start} - {event.time.end}
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={event.status === 'active'}
                            onCheckedChange={() => toggleEventStatus(event._id)}
                          />
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
                {filteredEvents.filter((e) => e.status === 'active').length ===
                  0 && (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="text-gray-500 flex flex-col items-center gap-4">
                      <Plus className="h-8 w-8 text-gray-500" />
                      <p className="text-sm">Add Events</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
                  <div className="col-span-1 flex items-center">
                    <ImageIcon className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-4 flex items-center">
                    Name
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Price
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Category
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">Status</div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>

                <div>
                  {filteredEvents
                    .filter((e) => e.status === 'draft')
                    .map((event) => (
                      <div
                        key={event._id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-1 flex items-center gap-2">
                          <Image
                            src={event?.imageLinks?.[0] || ''}
                            alt="Event"
                            width={200}
                            height={200}
                            className="object-cover h-10 w-10 rounded"
                          />
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                          <span>{event.name}</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          Rs{event.ticket.price}/hr
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.time.start} - {event.time.end}
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={event.status === 'active'}
                            onCheckedChange={() => toggleEventStatus(event._id)}
                          />
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
                {events.filter((e) => e.status === 'draft').length === 0 && (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="text-gray-500 flex flex-col items-center gap-4">
                      <Plus className="h-8 w-8 text-gray-500" />
                      <p className="text-sm">No Pending Events</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
                  <div className="col-span-1 flex items-center">
                    <ImageIcon className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-5 flex items-center">
                    Name
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Price
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Category
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>
                <div className="p-20 flex flex-col items-center justify-center">
                  <div className="text-gray-500 flex flex-col items-center gap-4">
                    <p className="text-sm">No Pending Events</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {viewMode === 'monitor' && (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center">
              <div className="relative">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  defaultValue="All Events"
                >
                  <SelectTrigger className="border-none text-sm space-x-2 shadow-none">
                    <SelectValue placeholder="All Events" />
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

              <TabsList className="bg-transparent">
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !startDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate
                                ? format(startDate, 'PPP')
                                : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DatePicker
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !endDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DatePicker
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setSelectedImages(e.target.files)}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="col-span-4 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-50 text-center"
                        >
                          <ImagePlus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload images
                          </span>
                        </label>
                        {selectedImages && (
                          <div className="col-span-4 space-y-2">
                            {Array.from(selectedImages).map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm truncate">
                                  {file.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const dt = new DataTransfer();
                                    Array.from(selectedImages).forEach(
                                      (f, i) => {
                                        if (i !== index) dt.items.add(f);
                                      }
                                    );
                                    setSelectedImages(dt.files);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
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

          <div className="rounded-md shadow-xl bg-white">
            <TabsContent value="active" className="mt-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
                  <div className="col-span-1 flex items-center">
                    <ImageIcon className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-4 flex items-center">
                    Name
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Price
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Category
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">Status</div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>

                <div>
                  {filteredEvents
                    .filter((e) => e.status === 'active')
                    .map((event) => (
                      <div
                        key={event._id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-1 flex items-center gap-2">
                          <Image
                            src={event?.imageLinks?.[0] || ''}
                            alt="Event"
                            width={200}
                            height={200}
                            className="object-cover h-10 w-10 rounded"
                          />
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                          <span>{event.name}</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          Rs{event.ticket.price}/hr
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.time.start} - {event.time.end}
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={event.status === 'active'}
                            onCheckedChange={() => toggleEventStatus(event._id)}
                          />
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
                {events.filter((e) => e.status === 'active').length === 0 && (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="text-gray-500 flex flex-col items-center gap-4">
                      <Plus className="h-8 w-8 text-gray-500" />
                      <p className="text-sm">Add Events</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
                  <div className="col-span-1 flex items-center">
                    <ImageIcon className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-4 flex items-center">
                    Name
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Price
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Category
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">Status</div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>

                <div>
                  {filteredEvents
                    .filter((e) => e.status === 'draft')
                    .map((event) => (
                      <div
                        key={event._id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-1 flex items-center gap-2">
                          <Image
                            src={event?.imageLinks?.[0] || ''}
                            alt="Event"
                            width={200}
                            height={200}
                            className="object-cover h-10 w-10 rounded"
                          />
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                          <span>{event.name}</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          Rs{event.ticket.price}/hr
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {event.time.start} - {event.time.end}
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={event.status === 'active'}
                            onCheckedChange={() => toggleEventStatus(event._id)}
                          />
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
                {events.filter((e) => e.status === 'draft').length === 0 && (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="text-gray-500 flex flex-col items-center gap-4">
                      <Plus className="h-8 w-8 text-gray-500" />
                      <p className="text-sm">No Pending Events</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
                  <div className="col-span-1 flex items-center">
                    <ImageIcon className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-5 flex items-center">
                    Name
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Price
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Category
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    Timing
                    <ChevronsUpDown className="ml-2.5 h-4 w-4" />
                  </div>
                  <div className="col-span-1 text-center">Edit</div>
                </div>
                <div className="p-20 flex flex-col items-center justify-center">
                  <div className="text-gray-500 flex flex-col items-center gap-4">
                    <p className="text-sm">No Pending Events</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
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
                      defaultValue={currentEvent.date.start}
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
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <div className="relative">
                      <Select
                        name="endDate"
                        defaultValue={currentEvent.date.end}
                      >
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
              </div>
              <div className="space-y-2">
                <Label>Select Timings</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-startTime"
                    name="startTime"
                    defaultValue={currentEvent.time.start}
                    className="flex-1"
                  />
                  <span className="text-sm">to</span>
                  <Input
                    id="edit-endTime"
                    name="endTime"
                    defaultValue={currentEvent.time.end}
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
                            currentEvent.ticket.type &&
                            currentEvent.ticket.type[i - 1]
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
                            currentEvent.ticket.type &&
                            currentEvent.ticket.type[i - 1]
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
                  defaultValue={currentEvent.ticketLimit}
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
                    onClick={() => deleteEvent(currentEvent._id)}
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
