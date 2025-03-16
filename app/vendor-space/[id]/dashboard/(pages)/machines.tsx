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
  Check,
  ChevronDown,
  Edit,
  Filter,
  ImagePlus,
  Plus,
  PlusCircle,
  SlidersHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface LabIncharge {
  name: string;
  number: string;
}

interface Machine {
  id: number;
  name: string;
  price: string;
  priceValue: string;
  category: string;
  timing: string;
  startTime: string;
  endTime: string;
  status: string;
  isOn: boolean;
  description?: string;
  brandName?: string;
  modelNumber?: string;
  location?: string;
  specialInstructions?: string;
  labIncharge?: LabIncharge[];
}

export default function MachinesPage() {
  const [statusOpen, setStatusOpen] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: 1,
      name: '3D Printer Creality 333XP',
      price: '₹ 500/hr',
      priceValue: '500',
      category: '3D Printer',
      timing: '10 AM - 3 AM',
      startTime: '10 AM',
      endTime: '3 AM',
      status: 'OFF',
      isOn: false,
      description: 'High quality 3D printer for precision printing',
      brandName: 'Creality',
      modelNumber: '333XP',
      location: 'Room 101, Main Building',
      specialInstructions: 'Handle with care, follow safety guidelines',
      labIncharge: [
        { name: 'John Doe', number: '9876543210' },
        { name: 'Jane Smith', number: '8765432109' },
      ],
    },
  ]);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentMachine, setCurrentMachine] = useState<Machine | null>(null);
  const [viewMode, setViewMode] = useState<string>('manage');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showMachineTypeDropdown, setShowMachineTypeDropdown] =
    useState<boolean>(false);

  const machineTypes = [
    '3D Printing',
    'Lathe Machine',
    'Vinyl Cutter',
    'CNC Router',
    'PCB CNC',
    'Laser Engraver',
    '3D Scanner',
    'Wood CNC',
    'Pick and Place',
  ];

  const handleAddMachine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Extract lab incharge details
    const labIncharge: LabIncharge[] = [];
    for (let i = 1; i <= 2; i++) {
      const name = formData.get(`inchargeName${i}`)?.toString() || '';
      const number = formData.get(`inchargeNumber${i}`)?.toString() || '';
      if (name && number) {
        labIncharge.push({ name, number });
      }
    }

    const brandName = formData.get('brandName')?.toString() || '';
    const modelNumber = formData.get('modelNumber')?.toString() || '';
    const name = `${brandName} ${modelNumber}`;
    const category = formData.get('category')?.toString() || '';
    const priceValue = formData.get('price')?.toString() || '0';
    const startTime = formData.get('startTime')?.toString() || '';
    const endTime = formData.get('endTime')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const location = formData.get('location')?.toString() || '';
    const specialInstructions =
      formData.get('specialInstructions')?.toString() || '';

    const newMachine: Machine = {
      id: machines.length + 1,
      name,
      price: `₹ ${priceValue}/hr`,
      priceValue,
      category,
      timing: `${startTime} - ${endTime}`,
      startTime,
      endTime,
      status: 'OFF',
      isOn: false,
      description,
      brandName,
      modelNumber,
      location,
      specialInstructions,
      labIncharge,
    };

    setMachines([...machines, newMachine]);
    setAddDialogOpen(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleEditMachine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMachine) return;

    const formData = new FormData(e.currentTarget);

    // Extract lab incharge details
    const labIncharge: LabIncharge[] = [];
    for (let i = 1; i <= 2; i++) {
      const name = formData.get(`inchargeName${i}`)?.toString() || '';
      const number = formData.get(`inchargeNumber${i}`)?.toString() || '';
      if (name && number) {
        labIncharge.push({ name, number });
      }
    }

    const brandName = formData.get('brandName')?.toString() || '';
    const modelNumber = formData.get('modelNumber')?.toString() || '';
    const name = `${brandName} ${modelNumber}`;
    const category = formData.get('category')?.toString() || '';
    const priceValue = formData.get('price')?.toString() || '0';
    const startTime = formData.get('startTime')?.toString() || '';
    const endTime = formData.get('endTime')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const location = formData.get('location')?.toString() || '';
    const specialInstructions =
      formData.get('specialInstructions')?.toString() || '';

    const updatedMachines = machines.map((machine) => {
      if (machine.id === currentMachine.id) {
        return {
          ...machine,
          name,
          price: `₹ ${priceValue}/hr`,
          priceValue,
          category,
          timing: `${startTime} - ${endTime}`,
          startTime,
          endTime,
          description,
          brandName,
          modelNumber,
          location,
          specialInstructions,
          labIncharge,
        };
      }
      return machine;
    });

    setMachines(updatedMachines);
    setEditDialogOpen(false);
  };

  const openEditDialog = (machine: Machine) => {
    setCurrentMachine(machine);
    setEditDialogOpen(true);
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

  const deleteMachine = (id: number) => {
    setMachines(machines.filter((machine) => machine.id !== id));
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
                  open={showMachineTypeDropdown}
                  onOpenChange={setShowMachineTypeDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-medium"
                    >
                      All Machines
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {machineTypes.map((type) => (
                      <DropdownMenuItem key={type}>{type}</DropdownMenuItem>
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
                    <DialogTitle>Add a machine</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddMachine} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="3D Printer">
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {machineTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        name="brandName"
                        placeholder="e.g. Creality"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modelNumber">Model Number</Label>
                      <Input
                        id="modelNumber"
                        name="modelNumber"
                        placeholder="e.g. 333XP"
                        required
                      />
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

                    <div className="space-y-2">
                      <Label>Select Timings</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="startTime"
                          name="startTime"
                          placeholder="10:00 a.m."
                          defaultValue="10 AM"
                          className="flex-1"
                          required
                        />
                        <span className="text-sm">to</span>
                        <Input
                          id="endTime"
                          name="endTime"
                          placeholder="12:00 p.m."
                          defaultValue="3 AM"
                          className="flex-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Add Images of the machine</Label>
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
                      <Label htmlFor="description">
                        Add other technical details
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the machine, its specifications, and usage instructions"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">
                        Machine's room, number and building
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g. Room 101, Main Building"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">
                        Special instructions for the user
                      </Label>
                      <Textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        placeholder="Any special instructions or guidelines for users"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lab Incharge's Assigned</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inchargeName1" className="text-xs">
                            Name
                          </Label>
                          <Input
                            id="inchargeName1"
                            name="inchargeName1"
                            placeholder="Incharge name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inchargeNumber1" className="text-xs">
                            Number
                          </Label>
                          <Input
                            id="inchargeNumber1"
                            name="inchargeNumber1"
                            placeholder="Contact number"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Input
                            name="inchargeName2"
                            placeholder="Incharge name"
                          />
                        </div>
                        <div>
                          <Input
                            name="inchargeNumber2"
                            placeholder="Contact number"
                          />
                        </div>
                      </div>
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
                <Card className="p-4 mb-4 bg-white border-green-200 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <p>
                      Congratulations, your machine has been submitted for
                      review.
                    </p>
                  </div>
                </Card>
              )}

              <div className="rounded-lg overflow-hidden border">
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

                {machines.length > 0 ? (
                  <div>
                    {machines.map((machine) => (
                      <div
                        key={machine.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                            <Image
                              width={40}
                              height={40}
                              src="/placeholder.svg"
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
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={machine.isOn}
                            onCheckedChange={() =>
                              toggleMachineStatus(machine.id)
                            }
                          />
                          <Badge
                            variant="outline"
                            className={`${
                              machine.isOn
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {machine.isOn ? 'ON' : 'OFF'}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(machine)}
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
                            <Image
                              width={40}
                              height={40}
                              src="/placeholder.svg"
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
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={machine.isOn}
                            onCheckedChange={() =>
                              toggleMachineStatus(machine.id)
                            }
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
                            onClick={() => openEditDialog(machine)}
                          >
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
                        <Image
                          width={40}
                          height={40}
                          src="/placeholder.svg"
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(machine)}
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
                <div className="text-gray-500">Add machines</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Machine Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Machine</DialogTitle>
          </DialogHeader>
          {currentMachine && (
            <form onSubmit={handleEditMachine} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select name="category" defaultValue={currentMachine.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {machineTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-brandName">Brand Name</Label>
                <Input
                  id="edit-brandName"
                  name="brandName"
                  defaultValue={currentMachine.brandName}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-modelNumber">Model Number</Label>
                <Input
                  id="edit-modelNumber"
                  name="modelNumber"
                  defaultValue={currentMachine.modelNumber}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price per hour</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    ₹
                  </span>
                  <Input
                    id="edit-price"
                    name="price"
                    defaultValue={currentMachine.priceValue}
                    className="pl-7"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Timings</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-startTime"
                    name="startTime"
                    defaultValue={currentMachine.startTime}
                    className="flex-1"
                    required
                  />
                  <span className="text-sm">to</span>
                  <Input
                    id="edit-endTime"
                    name="endTime"
                    defaultValue={currentMachine.endTime}
                    className="flex-1"
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
                <Label htmlFor="edit-description">
                  Add other technical details
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={currentMachine.description}
                  placeholder="Describe the machine, its specifications, and usage instructions"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">
                  Machine's room, number and building
                </Label>
                <Input
                  id="edit-location"
                  name="location"
                  defaultValue={currentMachine.location}
                  placeholder="e.g. Room 101, Main Building"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-specialInstructions">
                  Special instructions for the user
                </Label>
                <Textarea
                  id="edit-specialInstructions"
                  name="specialInstructions"
                  defaultValue={currentMachine.specialInstructions}
                  placeholder="Any special instructions or guidelines for users"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Lab Incharge's Assigned</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-inchargeName1" className="text-xs">
                      Name
                    </Label>
                    <Input
                      id="edit-inchargeName1"
                      name="inchargeName1"
                      defaultValue={
                        currentMachine.labIncharge &&
                        currentMachine.labIncharge[0]?.name
                      }
                      placeholder="Incharge name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-inchargeNumber1" className="text-xs">
                      Number
                    </Label>
                    <Input
                      id="edit-inchargeNumber1"
                      name="inchargeNumber1"
                      defaultValue={
                        currentMachine.labIncharge &&
                        currentMachine.labIncharge[0]?.number
                      }
                      placeholder="Contact number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Input
                      name="inchargeName2"
                      defaultValue={
                        currentMachine.labIncharge &&
                        currentMachine.labIncharge[1]?.name
                      }
                      placeholder="Incharge name"
                    />
                  </div>
                  <div>
                    <Input
                      name="inchargeNumber2"
                      defaultValue={
                        currentMachine.labIncharge &&
                        currentMachine.labIncharge[1]?.number
                      }
                      placeholder="Contact number"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Would you like to delete this machine?</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => deleteMachine(currentMachine.id)}
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
