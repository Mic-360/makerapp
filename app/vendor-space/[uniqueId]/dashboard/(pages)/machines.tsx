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
import {
  ArrowUpDown,
  Check,
  Edit,
  Plus,
  PlusCircle,
  Power,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function MachinesPage() {
  const [activeTab, setActiveTab] = useState('all');
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
  const [machinesStatus, setMachinesStatus] = useState(true);

  const handleAddMachine = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMachine = {
      id: machines.length + 1,
      name: formData.get('name') as string,
      price: `₹ ${formData.get('price')}/hr`,
      category: formData.get('category') as string,
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

  const toggleMachineStatus = (id: number) => {
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
    <div className="space-y-4">
      <Tabs
        value={viewMode}
        onValueChange={setViewMode}
        className="w-full mt-1"
      >
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="manage"
            className="px-12 py-3 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Manage
          </TabsTrigger>
          <TabsTrigger
            value="monitor"
            className="px-12 py-3 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white"
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
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="rounded-full bg-transparent text-black">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add a machine</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMachine} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Machine Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. 3D Printer Creality 333XP"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
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
                    <label htmlFor="price" className="text-sm font-medium">
                      Price per hour
                    </label>
                    <Input
                      id="price"
                      name="price"
                      placeholder="e.g. 500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="startTime"
                        className="text-sm font-medium"
                      >
                        Start Time
                      </label>
                      <Input
                        id="startTime"
                        name="startTime"
                        placeholder="e.g. 10 AM"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="endTime" className="text-sm font-medium">
                        End Time
                      </label>
                      <Input
                        id="endTime"
                        name="endTime"
                        placeholder="e.g. 3 AM"
                        required
                      />
                    </div>
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
                  <div className="col-span-1 text-center">Actions</div>
                </div>

                {machines.length > 0 ? (
                  <div>
                    {machines.map((machine) => (
                      <div
                        key={machine.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt={machine.name}
                              height={40}
                              width={40}
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
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              machine.isOn
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {machine.status}
                          </span>
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
                  <div className="col-span-1 text-center">Actions</div>
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
                          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt={machine.name}
                              height={40}
                              width={40}
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
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {machine.status}
                          </span>
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
                      <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt={machine.name}
                          height={40}
                          width={40}
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
