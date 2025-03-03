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

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState('plans');
  const [showSuccess, setShowSuccess] = useState(false);
  const [memberships, setMemberships] = useState([
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
  const [members, setMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('manage');
  const [membershipStatus, setMembershipStatus] = useState(true);

  const handleAddMembership = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMembership = {
      id: memberships.length + 1,
      name: formData.get('name') as string,
      price: `₹ ${formData.get('price')}`,
      duration: formData.get('duration') as string,
      benefits: formData.get('benefits') as string,
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
                  <DialogTitle>Add a membership plan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMembership} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Plan Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Basic Membership"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">
                      Price
                    </label>
                    <Input
                      id="price"
                      name="price"
                      placeholder="e.g. 5000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium">
                      Duration
                    </label>
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
                    <label htmlFor="benefits" className="text-sm font-medium">
                      Benefits
                    </label>
                    <Textarea
                      id="benefits"
                      name="benefits"
                      placeholder="List the benefits of this membership plan"
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
