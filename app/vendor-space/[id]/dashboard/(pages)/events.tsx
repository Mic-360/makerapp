'use client';

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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  createEvent,
  Event,
  fetchEventsByMakerspace,
  Makerspace,
  updateEvent,
  updateMakerspace,
} from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { cn, formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertCircle,
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
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface MySpacePageProps {
  makerspace: Makerspace;
  setMakerspace: React.Dispatch<React.SetStateAction<Makerspace | null>>;
}

interface Experts {
  name: string;
  number: string;
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
  const [experts, setExperts] = useState<Experts[]>([{ name: '', number: '' }]);
  const [selectedEventType, setSelectedEventType] =
    useState<string>('All Events');
  const [showEventTypeDropdown, setShowEventTypeDropdown] =
    useState<boolean>(false);
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
      // Basic required fields validation
      const name = formData.get('name')?.toString();
      const category = formData.get('category')?.toString();
      const description = formData.get('description')?.toString();
      const location = formData.get('location')?.toString();
      const ticketType = formData.get('ticketType')?.toString();
      const ticketPrice = parseFloat(formData.get('price')?.toString() || '0');
      const ticketLimit = parseInt(
        formData.get('totalTickets')?.toString() || '0',
        10
      );
      const startTime = formData.get('startTime')?.toString() || '';
      const endTime = formData.get('endTime')?.toString() || '';

      // Validate required fields
      if (
        !name ||
        !category ||
        !description ||
        !location ||
        !ticketType ||
        !ticketPrice ||
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime
      ) {
        console.log('Missing required fields:', {
          name,
          category,
          description,
          location,
          ticketType,
          ticketPrice,
          startDate,
          endDate,
          startTime,
          endTime,
        });
        setError('Please fill in all required fields');
        return;
      }

      if (ticketLimit <= 0) {
        setError('Ticket limit must be greater than zero');
        return;
      }

      // Handle image upload
      const imageLinks = await handleImageUpload(selectedImages);

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
        imageLinks,
        description,
        agenda: formData.get('agenda')?.toString() || '',
        terms: formData.get('terms')?.toString() || '',
        location,
        experts,
        makerSpace: initialMakerspace.name,
      };

      const createdEvent = await createEvent(newEventData, token);
      setEvents([...events, createdEvent]);
      setAddDialogOpen(false);
      setShowSuccess(true);

      // Reset form state
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedImages(null);
      setExperts([{ name: '', number: '' }]);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create event. Please try again.'
      );
    }
  };

  const handleEditEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentEvent?._id || !token) return;
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      // Basic required fields validation
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
      const startTime = formData.get('startTime')?.toString() || '';
      const endTime = formData.get('endTime')?.toString() || '';

      // Validate required fields
      if (
        !name ||
        !category ||
        !description ||
        !location ||
        !ticketType ||
        !ticketPrice ||
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime
      ) {
        setError('Please fill in all required fields');
        return;
      }

      if (ticketLimit <= 0) {
        setError('Ticket limit must be greater than zero');
        return;
      }

      // Handle image upload if new images were selected
      let imageLinks = currentEvent.imageLinks || [];
      if (selectedImages) {
        const newImageLinks = await handleImageUpload(selectedImages);
        imageLinks = [...imageLinks, ...newImageLinks];
      }

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
        imageLinks,
        description,
        agenda: formData.get('agenda')?.toString() || '',
        terms: formData.get('terms')?.toString() || '',
        location,
        experts,
        makerSpace: initialMakerspace.name,
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

      // Reset form state
      setEditDialogOpen(false);
      setShowSuccess(true);
      setSelectedImages(null);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating event:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update event. Please try again.'
      );
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

  const newCategories = ['Workshop', 'Hackathon', 'Seminar'];

  const filteredEvents = events
    .filter((event) => {
      if (selectedEventType === 'All Events') return true;
      return event.category === selectedEventType;
    })
    .filter((event) => {
      if (activeTab === 'active') return event.status === 'active';
      if (activeTab === 'draft') return event.status === 'draft';
      if (activeTab === 'trash') return event.status === 'inactive';
      return false;
    });

  const renderTab = (detail: string) => (
    <div className="rounded-xl border overflow-hidden">
      <div className="grid grid-cols-12 bg-red-300 p-3 text-sm font-medium">
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
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Edit</div>
      </div>
      <div>
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="grid grid-cols-12 p-3 text-sm border-t"
          >
            <div className="col-span-1 flex items-center gap-2">
              <Image
                src={event?.imageLinks?.[0] || '/assetlist.png'}
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
              {formatPrice(event.ticket.price)}/hr
            </div>
            <div className="col-span-2 flex items-center">{event.category}</div>
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
      {filteredEvents.length === 0 && (
        <div className="p-20 flex flex-col items-center justify-center">
          <div className="text-gray-500 flex flex-col items-center gap-4">
            <Plus className="h-8 w-8 text-gray-500" />
            <p className="text-sm">{detail}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddEventDialog = () => (
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
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Add an event</DialogTitle>
          <Separator />
        </DialogHeader>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="category" className="pl-3">
              Category
            </Label>
            <Select name="category" defaultValue="Hackathon">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {newCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="name" className="pl-3">
              Event Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter event name"
              required
            />
          </div>

          <div className="flex gap-2 items-center">
            <div className="space-y-1">
              <Label htmlFor="startDate" className="pl-3">
                Start Date
              </Label>
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
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
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
            <span className="mt-6 text-sm">to</span>
            <div className="space-y-1">
              <Label htmlFor="endDate" className="pl-3">
                End Date
              </Label>
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
            <div className="space-y-1">
              <Label className="pl-3">Select Timings</Label>
              <div className="flex items-center gap-2">
                <Select name="startTime" defaultValue="10:00 AM">
                  <SelectTrigger className="w-full h-10 rounded-xl border-gray-300">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = (i + 1).toString();
                      return (
                        <>
                          <SelectItem key={`${hour}AM`} value={`${hour}:00 AM`}>
                            {`${hour}:00 AM`}
                          </SelectItem>
                          <SelectItem key={`${hour}PM`} value={`${hour}:00 PM`}>
                            {`${hour}:00 PM`}
                          </SelectItem>
                        </>
                      );
                    })}
                  </SelectContent>
                </Select>
                <span className="text-sm">to</span>
                <Select name="endTime" defaultValue="12:00 PM">
                  <SelectTrigger className="w-full h-10 rounded-xl border-gray-300">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = (i + 1).toString();
                      return (
                        <>
                          <SelectItem key={`${hour}AM`} value={`${hour}:00 AM`}>
                            {`${hour}:00 AM`}
                          </SelectItem>
                          <SelectItem key={`${hour}PM`} value={`${hour}:00 PM`}>
                            {`${hour}:00 PM`}
                          </SelectItem>
                        </>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="pl-3">Ticket Type and Price</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Input
                    name="ticketType"
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
                  <Input name="price" placeholder="Price" className="pl-7" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="totalTickets" className="pl-3">
              Total Tickets to be sold in single purchase
            </Label>
            <div className="flex gap-4 items-center">
              <Input
                id="totalTickets"
                name="totalTickets"
                placeholder="Enter number"
                className="w-1/2"
              />
              <p className="text-xs text-gray-500">
                You can add up to tickets only
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="pl-3">Add event posters/images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <Label
                  key={index}
                  className={`
                              aspect-[16/9] rounded-2xl border-2 border-dashed
                              ${selectedImages?.[index] ? 'border-none p-0' : 'border-gray-400 p-4'}
                              flex items-center justify-center cursor-pointer
                              hover:border-gray-300 transition-colors overflow-hidden relative group
                            `}
                >
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) {
                        const newImages = new DataTransfer();
                        // Keep existing files
                        if (selectedImages) {
                          Array.from(selectedImages).forEach((f, i) => {
                            if (i !== index) newImages.items.add(f);
                          });
                        }
                        // Add new file at index
                        newImages.items.add(files[0]);
                        setSelectedImages(newImages.files);
                      }
                    }}
                  />
                  {selectedImages?.[index] ? (
                    <>
                      <Image
                        src={URL.createObjectURL(selectedImages[index])}
                        alt={`Event image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm">Click to change</p>
                      </div>
                    </>
                  ) : (
                    <Plus className="w-8 h-8 text-gray-300" />
                  )}
                </Label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="about" className="pl-3">
              About
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="agenda" className="pl-3">
              Agenda
            </Label>
            <Textarea
              id="agenda"
              name="agenda"
              placeholder="Event agenda"
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="terms" className="pl-3">
              Terms and Conditions
            </Label>
            <Textarea
              id="terms"
              name="terms"
              placeholder="Terms and conditions"
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="location" className="pl-3">
              Event's room, number and building
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter location details"
            />
          </div>

          <div className="space-y-1">
            <Label className="pl-3">Workshop Experts</Label>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-4">
              {experts.map((_, index) => (
                <React.Fragment key={index}>
                  <div>
                    <Label
                      htmlFor={`expertName${index + 1}`}
                      className="text-xs pl-3"
                    >
                      Name
                    </Label>
                    <Input
                      id={`expertName${index + 1}`}
                      name={`expertName${index + 1}`}
                      placeholder="Expert name"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`expertNumber${index + 1}`}
                      className="text-xs pl-3"
                    >
                      Number
                    </Label>
                    <Input
                      id={`expertNumber${index + 1}`}
                      name={`expertNumber${index + 1}`}
                      placeholder="Contact number"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
            <Button
              type='button'
              variant="link"
              className="text-xs h-auto pl-4"
              onClick={() => setExperts([...experts, { name: '', number: '' }])}
            >
              + Add people
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-center">
            <Button
              type="submit"
              className="rounded-full px-6 hover:bg-gray-800"
            >
              Save and Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4 pt-2 relative min-h-screen">
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

      {showSuccess && (
        <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 mb-1 bg-white border-green-200 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-green-100 p-2">
              <Check className="h-16 w-16 text-green-600" />
            </div>
            <p className="max-w-64 text-center">
              Congratulations, your event has been submitted for review.
            </p>
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
                <DropdownMenu
                  open={showEventTypeDropdown}
                  onOpenChange={setShowEventTypeDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-medium"
                    >
                      {selectedEventType}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit">
                    {eventCategories.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        className="pr-8"
                        onClick={() => setSelectedEventType(type)}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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

              {renderAddEventDialog()}
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
              {renderTab('Add Events')}
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              {renderTab('No Pending Events')}
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              {renderTab('No Events')}
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
                <DropdownMenu
                  open={showEventTypeDropdown}
                  onOpenChange={setShowEventTypeDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-medium"
                    >
                      {selectedEventType}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit">
                    {eventCategories.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        className="pr-12"
                        onClick={() => setSelectedEventType(type)}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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

              {renderAddEventDialog()}
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
              {renderTab('Add Events')}
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              {renderTab('No Pending Events')}
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              {renderTab('No Events')}
            </TabsContent>
          </div>
        </Tabs>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Edit an event</DialogTitle>
            <Separator />
          </DialogHeader>
          {currentEvent && (
            <form onSubmit={handleEditEvent} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="category" className="pl-3">
                  Category
                </Label>
                <Select name="category" defaultValue="Hackathon">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {newCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="name" className="pl-3">
                  Event Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div className="flex gap-2 items-center">
                <div className="space-y-1">
                  <Label htmlFor="startDate" className="pl-3">
                    Start Date
                  </Label>
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
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
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
                <span className="mt-6 text-sm">to</span>
                <div className="space-y-1">
                  <Label htmlFor="endDate" className="pl-3">
                    End Date
                  </Label>
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
                <div className="space-y-1">
                  <Label className="pl-3">Select Timings</Label>
                  <div className="flex items-center gap-2">
                    <Select name="startTime" defaultValue="10:00 AM">
                      <SelectTrigger className="w-full h-10 rounded-xl border-gray-300">
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = (i + 1).toString();
                          return (
                            <>
                              <SelectItem
                                key={`${hour}AM`}
                                value={`${hour}:00 AM`}
                              >
                                {`${hour}:00 AM`}
                              </SelectItem>
                              <SelectItem
                                key={`${hour}PM`}
                                value={`${hour}:00 PM`}
                              >
                                {`${hour}:00 PM`}
                              </SelectItem>
                            </>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <span className="text-sm">to</span>
                    <Select name="endTime" defaultValue="12:00 PM">
                      <SelectTrigger className="w-full h-10 rounded-xl border-gray-300">
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = (i + 1).toString();
                          return (
                            <>
                              <SelectItem
                                key={`${hour}AM`}
                                value={`${hour}:00 AM`}
                              >
                                {`${hour}:00 AM`}
                              </SelectItem>
                              <SelectItem
                                key={`${hour}PM`}
                                value={`${hour}:00 PM`}
                              >
                                {`${hour}:00 PM`}
                              </SelectItem>
                            </>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="pl-3">Ticket Type and Price</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">1.</span>
                      <Input
                        name="ticketType3"
                        placeholder="Ticket type"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">2.</span>
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
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="totalTickets" className="pl-3">
                  Total Tickets to be sold in single purchase
                </Label>
                <div className="flex gap-4 items-center">
                  <Input
                    id="totalTickets"
                    name="totalTickets"
                    placeholder="Enter number"
                    className="w-1/2"
                  />
                  <p className="text-xs text-gray-500">
                    You can add up to tickets only
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="pl-3">Add event posters/images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <Label
                      key={index}
                      className={`
                              aspect-[16/9] rounded-2xl border-2 border-dashed
                              ${selectedImages?.[index] ? 'border-none p-0' : 'border-gray-400 p-4'}
                              flex items-center justify-center cursor-pointer
                              hover:border-gray-300 transition-colors overflow-hidden relative group
                            `}
                    >
                      <Input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files[0]) {
                            const newImages = new DataTransfer();
                            // Keep existing files
                            if (selectedImages) {
                              Array.from(selectedImages).forEach((f, i) => {
                                if (i !== index) newImages.items.add(f);
                              });
                            }
                            // Add new file at index
                            newImages.items.add(files[0]);
                            setSelectedImages(newImages.files);
                          }
                        }}
                      />
                      {selectedImages?.[index] ? (
                        <>
                          <Image
                            src={URL.createObjectURL(selectedImages[index])}
                            alt={`Event image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">
                              Click to change
                            </p>
                          </div>
                        </>
                      ) : (
                        <Plus className="w-8 h-8 text-gray-300" />
                      )}
                    </Label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="about" className="pl-3">
                  About
                </Label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Event description"
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="agenda" className="pl-3">
                  Agenda
                </Label>
                <Textarea
                  id="agenda"
                  name="agenda"
                  placeholder="Event agenda"
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="terms" className="pl-3">
                  Terms and Conditions
                </Label>
                <Textarea
                  id="terms"
                  name="terms"
                  placeholder="Terms and conditions"
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="location" className="pl-3">
                  Event's room, number and building
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter location details"
                />
              </div>

              <div className="space-y-1">
                <Label className="pl-3">Workshop Experts</Label>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-4">
                  {experts.map((_, index) => (
                    <React.Fragment key={index}>
                      <div>
                        <Label
                          htmlFor={`expertName${index + 1}`}
                          className="text-xs pl-3"
                        >
                          Name
                        </Label>
                        <Input
                          id={`expertName${index + 1}`}
                          name={`expertName${index + 1}`}
                          placeholder="Expert name"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`expertNumber${index + 1}`}
                          className="text-xs pl-3"
                        >
                          Number
                        </Label>
                        <Input
                          id={`expertNumber${index + 1}`}
                          name={`expertNumber${index + 1}`}
                          placeholder="Contact number"
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="text-xs h-auto pl-4"
                  onClick={() =>
                    setExperts([...experts, { name: '', number: '' }])
                  }
                >
                  + Add people
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="rounded-full px-6 bg-black hover:bg-gray-800"
                >
                  Save and Submit
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
