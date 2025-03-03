'use client';

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
import { ArrowUpDown, Calendar, Check, Edit, Plus, PlusCircle, Power } from 'lucide-react';
import { useState } from 'react';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('all');
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
  const [eventsStatus, setEventsStatus] = useState(true);

  const handleAddEvent = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: events.length + 1,
      name: formData.get('name') as string,
      price: `₹ ${formData.get('price')}`,
      category: formData.get('category') as string,
      timing: formData.get('timing') as string,
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

  const toggleEventStatus = (id: number) => {
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
    <div className="space-y-4">
      <Tabs
        value={viewMode}
        onValueChange={setViewMode}
        className="w-full mt-1"
      >
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="manage"
            className="px-12 py-3 data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Manage
          </TabsTrigger>
          <TabsTrigger
            value="monitor"
            className="px-12 py-3 data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Monitor
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {viewMode === 'manage' && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-transparent mb-4">
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
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full bg-transparent text-black"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add an event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Event Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. 3D Printing Workshop"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select name="category" defaultValue="Workshop">
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
                    <label htmlFor="price" className="text-sm font-medium">
                      Price
                    </label>
                    <Input
                      id="price"
                      name="price"
                      placeholder="e.g. 1000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="timing" className="text-sm font-medium">
                      Timing
                    </label>
                    <Input
                      id="timing"
                      name="timing"
                      placeholder="e.g. 25 Jun - 28 Jun, 2024"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Event description"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Save and Submit
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsList>

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
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              event.isOn
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {event.status}
                          </span>
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
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {event.status}
                          </span>
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
