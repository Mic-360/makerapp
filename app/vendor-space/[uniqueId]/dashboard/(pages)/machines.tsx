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
  Check,
  Edit,
  ImagePlus,
  Plus,
  PlusCircle,
  Power,
} from 'lucide-react';
import { useState } from 'react';

export default function MachinesPage() {
  // const [activeTab, setActiveTab] = useState('all');
  const [statusOpen, setStatusOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [machines, setMachines] = useState([
    {
      id: 1,
      name: '3D Printer Creality 333XP',
      price: '₹ 500/hr',
      category: '3D Printer',
      timing: '10 AM - 3 AM',
      status: 'OFF',
      isOn: false,
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('manage');

  const handleAddMachine = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMachine = {
      id: machines.length + 1,
      name: formData.get('name'),
      price: `₹ ${formData.get('price')}/hr`,
      category: formData.get('category'),
      timing: `${formData.get('startTime')} - ${formData.get('endTime')}`,
      status: 'OFF',
      isOn: false,
    };

    setMachines([...machines, newMachine]);
    setOpenDialog(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const toggleMachineStatus = (id) => {
    setMachines(
      machines.map((machine) =>
        machine.id === id
          ? {
              ...machine,
              isOn: !machine.isOn,
              status: !machine.isOn ? 'ON' : 'OFF',
            }
          : machine
      )
    );
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={setViewMode}>
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
                All Machines
              </TabsTrigger>
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
                  <DialogTitle>Add a machine</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMachine} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Machine Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. 3D Printer Creality 333XP"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="3D Printer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3D Printer">3D Printer</SelectItem>
                        <SelectItem value="Lathe Machine">
                          Lathe Machine
                        </SelectItem>
                        <SelectItem value="Vinyl Cutter">
                          Vinyl Cutter
                        </SelectItem>
                        <SelectItem value="CNC Router">CNC Router</SelectItem>
                        <SelectItem value="PCB CNC">PCB CNC</SelectItem>
                        <SelectItem value="Laser Engraver">
                          Laser Engraver
                        </SelectItem>
                        <SelectItem value="3D Scanner">3D Scanner</SelectItem>
                        <SelectItem value="Wood CNC">Wood CNC</SelectItem>
                        <SelectItem value="Pick and Place">
                          Pick and Place
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price per hour</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        ₹
                      </span>
                      <Input
                        id="price"
                        name="price"
                        placeholder="e.g. 500"
                        className="pl-7"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        placeholder="e.g. 10 AM"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        placeholder="e.g. 3 AM"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Machine Images</Label>
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the machine, its specifications, and usage instructions"
                      rows={4}
                    />
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
                    Congratulations, your machine has been submitted for review.
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
                  <div className="col-span-1 text-center">Edit</div>
                </div>

                {machines.length > 0 ? (
                  <div>
                    {machines.map((machine) => (
                      <div
                        key={machine.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                            <img
                              src="/placeholder.svg?height=40&width=40"
                              alt={machine.name}
                            />
                          </div>
                          <span>{machine.name}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {machine.price}
                        </div>
                        <div className="col-span-3 flex items-center">
                          {machine.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {machine.timing}
                        </div>
                        <div className="col-span-1 flex items-center">
                          <Badge
                            variant="outline"
                            className={`${
                              machine.isOn
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {machine.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-around">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMachineStatus(machine.id)}
                          >
                            <Power
                              className={`h-4 w-4 ${machine.isOn ? 'text-green-500' : 'text-gray-400'}`}
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
                    <div className="text-gray-500">Add machines</div>
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
                  {machines
                    .filter((m) => m.isOn)
                    .map((machine) => (
                      <div
                        key={machine.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                            <img
                              src="/placeholder.svg?height=40&width=40"
                              alt={machine.name}
                            />
                          </div>
                          <span>{machine.name}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {machine.price}
                        </div>
                        <div className="col-span-3 flex items-center">
                          {machine.category}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {machine.timing}
                        </div>
                        <div className="col-span-1 flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            {machine.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-around">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMachineStatus(machine.id)}
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
                {machines.filter((m) => m.isOn).length === 0 && (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="text-gray-500">No active machines</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No draft machines</div>
              </div>
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No machines in trash</div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {viewMode === 'monitor' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">Machines Analytics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Active Machines</p>
                <p className="text-2xl font-bold">
                  {machines.filter((m) => m.isOn).length}
                </p>
                <p className="text-xs text-green-600">+0% from last month</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₹ 0</p>
                <p className="text-xs text-green-600">+0% from last month</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Bookings</p>
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
                Usage
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Status
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </div>

            {machines.length > 0 ? (
              <div>
                {machines.map((machine) => (
                  <div
                    key={machine.id}
                    className="grid grid-cols-11 p-3 text-sm border-t"
                  >
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=40&width=40"
                          alt={machine.name}
                        />
                      </div>
                      <span>{machine.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      {machine.price}
                    </div>
                    <div className="col-span-2 flex items-center">
                      {machine.category}
                    </div>
                    <div className="col-span-2 flex items-center">
                      0 hours this month
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Switch
                        checked={machine.isOn}
                        onCheckedChange={() => toggleMachineStatus(machine.id)}
                      />
                      <span
                        className={
                          machine.isOn ? 'text-green-600' : 'text-gray-500'
                        }
                      >
                        {machine.isOn ? 'Online' : 'Offline'}
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
                <div className="text-gray-500">Add machines</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
