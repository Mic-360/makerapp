'use client';

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
  Edit,
  ImagePlus,
  Plus,
  PlusCircle,
  Power,
} from 'lucide-react';
import { useState } from 'react';

export default function EventsPage() {
  // const [activeTab, setActiveTab] = useState('all');
  const [statusOpen, setStatusOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      name: '3D Printing Workshop',
      price: '₹ 1000',
      category: 'Workshop',
      timing: '25 Jun - 28 Jun, 2024',
      status: 'Upcoming',
      isOn: true,
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('manage');

  const handleAddEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: events.length + 1,
      name: formData.get('name'),
      price: `₹ ${formData.get('price')}`,
      category: formData.get('category'),
      timing: `${formData.get('startDate')} - ${formData.get('endDate')}`,
      status: 'Upcoming',
      isOn: true,
    };

    setEvents([...events, newEvent]);
    setOpenDialog(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const toggleEventStatus = (id) => {
    setEvents(
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              isOn: !event.isOn,
              status: !event.isOn ? 'Upcoming' : 'Inactive',
            }
          : event
      )
    );
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
        >
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
            <select
              aria-label="Select Timeframe"
              className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-1.5 pr-8 text-sm focus:outline-none"
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
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
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center mb-4">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                All Events
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Past
              </TabsTrigger>
            </TabsList>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full bg-transparent text-black"
                >
                  Add
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-xl max-h-[85vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scrollbar-hide">
                <DialogHeader>
                  <DialogTitle>Add an event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="Hackathon">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Hackathon">Hackathon</SelectItem>
                        <SelectItem value="Conference">Conference</SelectItem>
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
                        <Input
                          id="startDate"
                          name="startDate"
                          placeholder="Select date"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.5 4.5L6 8L9.5 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="relative">
                        <Input
                          id="endDate"
                          name="endDate"
                          placeholder="Select date"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.5 4.5L6 8L9.5 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Timings</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="startTime"
                        name="startTime"
                        placeholder="10:00 a.m."
                        className="flex-1"
                      />
                      <span className="text-sm">to</span>
                      <Input
                        id="endTime"
                        name="endTime"
                        placeholder="12:00 p.m."
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
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="border rounded-md aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-50"
                        >
                          <ImagePlus className="h-6 w-6 text-gray-400" />
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
                        <Label htmlFor="expertName" className="text-xs">
                          Name
                        </Label>
                        <Input
                          id="expertName"
                          name="expertName"
                          placeholder="Expert name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expertNumber" className="text-xs">
                          Number
                        </Label>
                        <Input
                          id="expertNumber"
                          name="expertNumber"
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

          <div>
            <TabsContent value="all" className="mt-0">
              {showSuccess && (
                <Card className="p-4 mb-4 bg-white border-green-200 flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm">
                    Congratulations, your event has been submitted for review.
                  </p>
                </Card>
              )}

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
                  <div className="col-span-1 text-center">Actions</div>
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
                        <div className="col-span-1 flex items-center">
                          <Badge
                            variant="outline"
                            className={`${
                              event.isOn
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-around">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventStatus(event.id)}
                          >
                            <Power
                              className={`h-4 w-4 ${event.isOn ? 'text-green-500' : 'text-gray-400'}`}
                            />
                          </Button>
                          <Button variant="ghost" size="sm">
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
                  <div className="col-span-1 text-center">Actions</div>
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
                        <div className="col-span-1 flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-around">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventStatus(event.id)}
                          >
                            <Power className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="sm">
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

            <TabsContent value="upcoming" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No upcoming events</div>
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No past events</div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {viewMode === 'monitor' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">Events Analytics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Upcoming Events</p>
                <p className="text-2xl font-bold">
                  {events.filter((e) => e.isOn).length}
                </p>
                <p className="text-xs text-green-600">+0% from last month</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₹ 0</p>
                <p className="text-xs text-green-600">+0% from last month</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Registered Attendees</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-green-600">+0% from last month</p>
              </div>
            </div>
          </Card>

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
    </div>
  );
}
