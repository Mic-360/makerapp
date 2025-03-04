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
  Plus,
  PlusCircle,
  Power,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface Membership {
  id: number;
  name: string;
  price: string;
  duration: string;
  benefits: string;
  status: string;
  isOn: boolean;
}

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState<string>('plans');
  const [statusOpen, setStatusOpen] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [memberships, setMemberships] = useState<Membership[]>([
    {
      id: 1,
      name: 'Basic Membership',
      price: '₹ 5000',
      duration: '3 months',
      benefits: 'Access to basic machines, 10 hours per week',
      status: 'Active',
      isOn: true,
    },
  ]);
  const [members, setMembers] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>('manage');

  const handleAddMembership = (e: {
    preventDefault: () => void;
    target: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMembership = {
      id: memberships.length + 1,
      name: formData.get('name'),
      price: `₹ ${formData.get('price')}`,
      duration: formData.get('duration'),
      benefits: formData.get('benefits'),
      status: 'Active',
      isOn: true,
    };

    setMemberships([...memberships, newMembership]);
    setOpenDialog(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const toggleMembershipStatus = (id: number) => {
    setMemberships(
      memberships.map((membership) =>
        membership.id === id
          ? {
              ...membership,
              isOn: !membership.isOn,
              status: !membership.isOn ? 'Active' : 'Inactive',
            }
          : membership
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
                All Plans
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
                value="expired"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Expired
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
                  <DialogTitle>Add a membership plan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMembership} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Basic Membership"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        ₹
                      </span>
                      <Input
                        id="price"
                        name="price"
                        placeholder="e.g. 5000"
                        className="pl-7"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select name="duration" defaultValue="3 months">
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 month">1 month</SelectItem>
                        <SelectItem value="3 months">3 months</SelectItem>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="1 year">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea
                      id="benefits"
                      name="benefits"
                      placeholder="List the benefits of this membership plan"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terms">Terms and Conditions</Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      placeholder="Terms and conditions for this membership"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Access to Machines</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="machine1"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="machine1" className="text-sm">
                          3D Printer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="machine2"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="machine2" className="text-sm">
                          Laser Cutter
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="machine3"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="machine3" className="text-sm">
                          CNC Router
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="machine4"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="machine4" className="text-sm">
                          PCB Mill
                        </Label>
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

          <div>
            <TabsContent value="all" className="mt-0">
              {showSuccess && (
                <Card className="p-4 mb-4 bg-white border-green-200 flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm">
                    Congratulations, your membership plan has been submitted for
                    review.
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
                  <div className="col-span-2 flex items-center">
                    Duration
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-3 flex items-center">
                    Benefits
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>

                {memberships.length > 0 ? (
                  <div>
                    {memberships.map((membership) => (
                      <div
                        key={membership.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-blue-100 overflow-hidden flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-500" />
                          </div>
                          <span>{membership.name}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {membership.price}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {membership.duration}
                        </div>
                        <div className="col-span-3 flex items-center">
                          <p className="truncate">{membership.benefits}</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <Badge
                            variant="outline"
                            className={`${
                              membership.isOn
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {membership.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-around">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleMembershipStatus(membership.id)
                            }
                          >
                            <Power
                              className={`h-4 w-4 ${membership.isOn ? 'text-green-500' : 'text-gray-400'}`}
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
                    <div className="text-gray-500">Add membership plans</div>
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
                  <div className="col-span-2 flex items-center">
                    Duration
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-3 flex items-center">
                    Benefits
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>

                <div>
                  {memberships
                    .filter((m) => m.isOn)
                    .map((membership) => (
                      <div
                        key={membership.id}
                        className="grid grid-cols-12 p-3 text-sm border-t"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-10 w-10 rounded bg-blue-100 overflow-hidden flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-500" />
                          </div>
                          <span>{membership.name}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {membership.price}
                        </div>
                        <div className="col-span-2 flex items-center">
                          {membership.duration}
                        </div>
                        <div className="col-span-3 flex items-center">
                          <p className="truncate">{membership.benefits}</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            {membership.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex items-center justify-around">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleMembershipStatus(membership.id)
                            }
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
                {memberships.filter((m) => m.isOn).length === 0 && (
                  <div className="p-20 flex flex-col items-center justify-center">
                    <div className="text-gray-500">
                      No active membership plans
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No draft membership plans</div>
              </div>
            </TabsContent>

            <TabsContent value="expired" className="mt-0">
              <div className="rounded-md border p-20 flex flex-col items-center justify-center">
                <div className="text-gray-500">No expired membership plans</div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {viewMode === 'monitor' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">Membership Analytics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Active Members</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-green-600">+0% from last month</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹ 0</p>
                <p className="text-xs text-green-600">+0% from last month</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Active Plans</p>
                <p className="text-2xl font-bold">
                  {memberships.filter((m) => m.isOn).length}
                </p>
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
                Duration
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Subscribers
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Status
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </div>

            {memberships.length > 0 ? (
              <div>
                {memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="grid grid-cols-11 p-3 text-sm border-t"
                  >
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="h-10 w-10 rounded bg-blue-100 overflow-hidden flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                      <span>{membership.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      {membership.price}
                    </div>
                    <div className="col-span-2 flex items-center">
                      {membership.duration}
                    </div>
                    <div className="col-span-2 flex items-center">
                      0 members
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Switch
                        checked={membership.isOn}
                        onCheckedChange={() =>
                          toggleMembershipStatus(membership.id)
                        }
                      />
                      <span
                        className={
                          membership.isOn ? 'text-green-600' : 'text-gray-500'
                        }
                      >
                        {membership.isOn ? 'Online' : 'Offline'}
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
                <div className="text-gray-500">Add membership plans</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'members' && viewMode === 'manage' && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">All Members</h2>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 bg-orange-100 p-3 text-sm font-medium">
              <div className="col-span-3 flex items-center">
                Member
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Plan
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Start Date
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                End Date
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center">
                Status
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
              <div className="col-span-1 text-center">Actions</div>
            </div>

            <div className="p-20 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-gray-500">No members found</div>
              <p className="text-sm text-gray-400 mt-2">
                Members will appear here once added
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
