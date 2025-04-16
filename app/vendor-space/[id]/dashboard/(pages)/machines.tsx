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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  createMachine,
  fetchMachinesByMakerspace,
  Machine,
  Makerspace,
  updateMachine,
  updateMakerspace,
} from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Edit,
  Filter,
  ImageIcon,
  Plus,
  PlusCircle,
  SlidersHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface MySpacePageProps {
  makerspace: Makerspace;
  setMakerspace: (makerspace: Makerspace | null) => void;
}

const MachinesPage = ({
  makerspace: initialMakerspace,
  setMakerspace,
}: MySpacePageProps) => {
  const [error, setError] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(
    initialMakerspace.status === 'active'
  );
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentMachine, setCurrentMachine] = useState<Machine | null>(null);
  const [viewMode, setViewMode] = useState<string>('manage');
  const [activeTab, setActiveTab] = useState<string>('active');
  const { token } = useAuthenticationStore();
  const [showMachineTypeDropdown, setShowMachineTypeDropdown] =
    useState<boolean>(false);
  const [selectedMachineType, setSelectedMachineType] =
    useState<string>('All Machines');
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

  // Replace static machineTypes with dynamic categories
  const machineCategories = [
    'All Machines',
    ...Array.from(new Set(machines.map((machine) => machine.category))).filter(
      Boolean
    ),
  ];

  const newCategories = ['3D Printer', 'CNC', 'Laser Cutter', 'Electronics'];

  // Fetch machines on component mount
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setIsLoading(true);
        const fetchedMachines = await fetchMachinesByMakerspace(
          initialMakerspace.name
        );
        setMachines(fetchedMachines);
      } catch (err) {
        console.error('Error fetching machines:', err);
        setError('Failed to load machines');
      } finally {
        setIsLoading(false);
      }
    };

    if (initialMakerspace.name) {
      fetchMachines();
    }
  }, [initialMakerspace.name]);

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

  const handleAddMachine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      // Create time object
      const time = {
        start: formData.get('startTime')?.toString() || '',
        end: formData.get('endTime')?.toString() || '',
      };
      formData.set('time', JSON.stringify(time));

      // Convert price to number
      const price = Number(formData.get('price'));
      if (isNaN(price)) {
        throw new Error('Invalid price value');
      }
      formData.set('price', price.toString());

      // Set brand and model from form data
      formData.set('brand', formData.get('brandName')?.toString() || '');
      formData.set('model', formData.get('modelNumber')?.toString() || '');

      // Parse and add inCharge array
      const inCharge = [];
      for (let i = 1; i <= 2; i++) {
        const name = formData.get(`inchargeName${i}`)?.toString();
        const number = formData.get(`inchargeNumber${i}`)?.toString();
        if (name && number) {
          inCharge.push({ name, number });
        }
      }
      formData.set('inCharge', JSON.stringify(inCharge));

      // Set description and instructions
      formData.set(
        'description',
        formData.get('description')?.toString() || ''
      );
      formData.set(
        'instruction',
        formData.get('specialInstructions')?.toString() || ''
      );

      // Set makerSpace from the parent component
      formData.set('makerSpace', initialMakerspace.name);

      // Set initial status as inactive
      formData.set('status', 'inactive');

      // Add images if selected
      if (selectedImages) {
        Array.from(selectedImages).forEach((file) => {
          formData.append('images', file);
        });
      }

      const createdMachine = await createMachine(formData, token);
      setMachines([...machines, createdMachine]);
      setAddDialogOpen(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding machine:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to add machine'
      );
    }
  };

  const handleEditMachine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMachine?._id || !token) return;

    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      // Create time object
      const time = {
        start: formData.get('startTime')?.toString() || '',
        end: formData.get('endTime')?.toString() || '',
      };
      formData.set('time', JSON.stringify(time));

      // Convert price to number
      const price = Number(formData.get('price'));
      if (isNaN(price)) {
        throw new Error('Invalid price value');
      }
      formData.set('price', price.toString());

      // Set brand and model from form data
      formData.set('brand', formData.get('brandName')?.toString() || '');
      formData.set('model', formData.get('modelNumber')?.toString() || '');

      // Parse and add inCharge array
      const inCharge = [];
      for (let i = 1; i <= 2; i++) {
        const name = formData.get(`inchargeName${i}`)?.toString();
        const number = formData.get(`inchargeNumber${i}`)?.toString();
        if (name && number) {
          inCharge.push({ name, number });
        }
      }
      formData.set('inCharge', JSON.stringify(inCharge));

      // Set description and instructions
      formData.set(
        'description',
        formData.get('description')?.toString() || ''
      );
      formData.set(
        'instruction',
        formData.get('specialInstructions')?.toString() || ''
      );

      // Set makerSpace from the parent component
      formData.set('makerSpace', initialMakerspace.name);

      // Add images if selected
      if (selectedImages) {
        Array.from(selectedImages).forEach((file) => {
          formData.append('images', file);
        });
      }

      const updatedMachine = await updateMachine(
        currentMachine._id,
        formData,
        token
      );

      setMachines(
        machines.map((machine) =>
          machine._id === currentMachine._id ? updatedMachine : machine
        )
      );
      setEditDialogOpen(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating machine:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to update machine'
      );
    }
  };

  const openEditDialog = (machine: Machine) => {
    setCurrentMachine(machine);
    setEditDialogOpen(true);
  };

  const toggleMachineStatus = async (machine: Machine) => {
    if (!token) return;

    try {
      const newStatus = machine.status === 'active' ? 'inactive' : 'active';
      const updatedMachine = await updateMachine(
        machine._id,
        { status: newStatus },
        token
      );

      setMachines(
        machines.map((m) => (m._id === machine._id ? updatedMachine : m))
      );
    } catch (error) {
      console.error('Error toggling machine status:', error);
      setError('Failed to update machine status');
    }
  };

  const deleteMachine = (machineId: string) => {
    setMachines(machines.filter((machine) => machine._id !== machineId));
    setEditDialogOpen(false);
  };

  const filteredMachines = machines
    .filter((machine) => {
      if (selectedMachineType === 'All Machines') return true;
      return machine.category === selectedMachineType;
    })
    .filter((machine) => {
      if (activeTab === 'active') return machine.status === 'active';
      if (activeTab === 'draft') return machine.status === 'inactive';
      if (activeTab === 'trash') return machine.status === 'removed';
      return false;
    });

  const renderTab = (detail: string) => (
    <div className="rounded-xl border overflow-hidden">
      <div className="grid grid-cols-12 bg-red-300 p-3 text-sm font-medium">
        <div className="col-span-1 flex items-center">
          <ImageIcon className="ml-1 h-4 w-4" />
        </div>
        <div className="col-span-3 flex items-center">
          Name
          <ChevronsUpDown className="ml-2.5 h-4 w-4" />
        </div>
        <div className="col-span-2 flex items-center">
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
        {filteredMachines.map((machine) => (
          <div
            key={machine._id}
            className="grid grid-cols-12 p-3 text-sm border-t"
          >
            <div className="col-span-1 flex items-center gap-2">
              <Image
                width={100}
                height={100}
                src={machine.imageLinks?.[0] || '/placeholder.svg'}
                alt={`${machine.brand} ${machine.model}`}
                className="object-cover h-10 w-10 rounded"
              />
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <span>{`${machine.brand} ${machine.model}`}</span>
            </div>
            <div className="col-span-2 flex items-center">
              {formatPrice(machine.price)}/hr
            </div>
            <div className="col-span-2 flex items-center">
              {machine.category}
            </div>
            <div className="col-span-2 flex items-center">
              {machine.time.start} - {machine.time.end}
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <Switch
                checked={machine.status === 'active'}
                onCheckedChange={() => toggleMachineStatus(machine)}
              />
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
      {filteredMachines.length === 0 && (
        <div className="p-20 flex flex-col items-center justify-center">
          <div className="text-gray-500 flex flex-col items-center gap-4">
            <Plus className="h-8 w-8 text-gray-500" />
            <p className="text-sm">{detail}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddMachineDialog = () => (
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
          <DialogTitle>Add a machine</DialogTitle>
          <Separator />
        </DialogHeader>
        <form onSubmit={handleAddMachine} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="pl-3">
              Category
            </Label>
            <Select name="category" defaultValue="3D Printer">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {newCategories.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandName" className="pl-3">
              Brand Name
            </Label>
            <Input
              id="brandName"
              name="brandName"
              placeholder="e.g. Creality"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelNumber" className="pl-3">
              Model Number
            </Label>
            <Input
              id="modelNumber"
              name="modelNumber"
              placeholder="e.g. 333XP"
              required
            />
          </div>

          <div className="flex gap-x-4 justify-between">
            <div className="space-y-2 w-1/2">
              <Label htmlFor="price" className="pl-3">
                Price per hour
              </Label>
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

            <div className="space-y-2 w-1/2">
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

          <div className="space-y-2">
            <Label className="pl-3">Add Images of the machine</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
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
                        // Validate file size
                        if (files[0].size > 10 * 1024 * 1024) {
                          setError('File too large. Maximum size is 10MB.');
                          return;
                        }

                        // Validate file type
                        if (!files[0].type.startsWith('image/')) {
                          setError('Only image files are allowed!');
                          return;
                        }

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
                        setError(null);
                      }
                    }}
                  />
                  {selectedImages?.[index] ? (
                    <>
                      <Image
                        src={URL.createObjectURL(selectedImages[index])}
                        alt={`Machine image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm">Click to change</p>
                      </div>
                    </>
                  ) : currentMachine?.imageLinks?.[index] ? (
                    <>
                      <Image
                        src={currentMachine.imageLinks[index]}
                        alt={`Machine image ${index + 1}`}
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
            <p className="text-xs text-gray-500 mt-1">
              Each image must be less than 10MB.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="pl-3">
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
            <Label htmlFor="location" className="pl-3">
              Machine's room, number and building
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. Room 101, Main Building"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions" className="pl-3">
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
            <Label className="pl-3">Lab Incharge's Assigned</Label>
            <div className="grid grid-cols-2 gap-4 pl-4">
              <div>
                <Label htmlFor="inchargeName1" className="text-xs pl-3">
                  Name
                </Label>
                <Input
                  id="inchargeName1"
                  name="inchargeName1"
                  placeholder="Incharge name"
                />
              </div>
              <div>
                <Label htmlFor="inchargeNumber1" className="text-xs pl-3">
                  Number
                </Label>
                <Input
                  id="inchargeNumber1"
                  name="inchargeNumber1"
                  placeholder="Contact number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 pl-4">
              <div>
                <Input name="inchargeName2" placeholder="Incharge name" />
              </div>
              <div>
                <Input name="inchargeNumber2" placeholder="Contact number" />
              </div>
            </div>
          </div>

          <Separator className="my-2" />
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
    <div className="container space-y-4 pt-2 relative">
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
              Congratulations, your machine has been submitted for review.
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
                      {selectedMachineType}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit">
                    {machineCategories.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        className="pr-8"
                        onClick={() => setSelectedMachineType(type)}
                      >
                        {type}
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

              {renderAddMachineDialog()}
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
              {renderTab('Add Machines')}
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              {renderTab('No Pending Machines')}
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              {renderTab('No Machines')}
            </TabsContent>
          </div>
        </Tabs>
      )}

      {viewMode === 'monitor' && (
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
                      {selectedMachineType}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit">
                    {machineCategories.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        className="pr-8"
                        onClick={() => setSelectedMachineType(type)}
                      >
                        {type}
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

              {renderAddMachineDialog()}
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
              {renderTab('Add Machines')}
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              {renderTab('No Pending Machines')}
            </TabsContent>

            <TabsContent value="trash" className="mt-0">
              {renderTab('No Machines')}
            </TabsContent>
          </div>
        </Tabs>
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
                    {newCategories.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-brand">Brand Name</Label>
                <Input
                  id="edit-brand"
                  name="brandName"
                  defaultValue={currentMachine.brand}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-model">Model Number</Label>
                <Input
                  id="edit-model"
                  name="modelNumber"
                  defaultValue={currentMachine.model}
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
                    defaultValue={currentMachine.price}
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
                    defaultValue={currentMachine.time.start}
                    className="flex-1"
                    required
                  />
                  <span className="text-sm">to</span>
                  <Input
                    id="edit-endTime"
                    name="endTime"
                    defaultValue={currentMachine.time.end}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Machine Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
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
                            // Validate file size
                            if (files[0].size > 10 * 1024 * 1024) {
                              setError('File too large. Maximum size is 10MB.');
                              return;
                            }

                            // Validate file type
                            if (!files[0].type.startsWith('image/')) {
                              setError('Only image files are allowed!');
                              return;
                            }

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
                            setError(null);
                          }
                        }}
                      />
                      {selectedImages?.[index] ? (
                        <>
                          <Image
                            src={URL.createObjectURL(selectedImages[index])}
                            alt={`Machine image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">
                              Click to change
                            </p>
                          </div>
                        </>
                      ) : currentMachine?.imageLinks?.[index] ? (
                        <>
                          <Image
                            src={currentMachine.imageLinks[index]}
                            alt={`Machine image ${index + 1}`}
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
                <p className="text-xs text-gray-500 mt-1">
                  Upload up to 6 images. Each image must be less than 10MB.
                </p>
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
                  defaultValue={currentMachine.instruction}
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
                        currentMachine.inCharge &&
                        currentMachine.inCharge[0]?.name
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
                        currentMachine.inCharge &&
                        currentMachine.inCharge[0]?.number
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
                        currentMachine.inCharge &&
                        currentMachine.inCharge[1]?.name
                      }
                      placeholder="Incharge name"
                    />
                  </div>
                  <div>
                    <Input
                      name="inchargeNumber2"
                      defaultValue={
                        currentMachine.inCharge &&
                        currentMachine.inCharge[2]?.number
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
                    onClick={() => deleteMachine(currentMachine._id)}
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
};

export default MachinesPage;
