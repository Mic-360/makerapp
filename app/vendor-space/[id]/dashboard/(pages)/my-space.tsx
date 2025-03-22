'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import type { Makerspace } from '@/lib/api';
import { updateMakerspace } from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { Check, Plus } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';

interface MySpacePageProps {
  makerspace: Makerspace;
}

export default function MySpacePage({
  makerspace: initialMakerspace,
}: MySpacePageProps) {
  const [wordCount, setWordCount] = useState(0);
  const [statusOpen, setStatusOpen] = useState(
    initialMakerspace.status === 'active'
  );
  const [formData, setFormData] =
    useState<Partial<Makerspace>>(initialMakerspace);
  const { token } = useAuthenticationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialMakerspace.description) {
      const words =
        initialMakerspace.description.trim() === ''
          ? 0
          : initialMakerspace.description.trim().split(/\s+/).length;
      setWordCount(words);
    }
  }, [initialMakerspace.description]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    setWordCount(words);
    setFormData((prev) => ({ ...prev, description: text }));
  };

  const handleInputChange = (field: keyof Makerspace, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!token || !formData) return;

    setIsLoading(true);
    try {
      const updatedData = {
        ...formData,
        status: statusOpen ? 'active' : 'inactive',
      };

      const result = await updateMakerspace(
        initialMakerspace.id,
        updatedData,
        token
      );
      // Update local state after successful API call
      setFormData(result);
    } catch (error) {
      console.error('Error updating makerspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-end gap-12">
        <div className="text-orange-500 font-semibold text-lg">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
          ,{' '}
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
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
            onCheckedChange={setStatusOpen}
            showStatus
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border-0">
          <div className="border-t border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex font-medium hover:no-underline">
              <span className="flex items-center text-xl font-bold">
                1. Basic Details
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 py-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="spaceName" className="text-sm">
                  Name of the space*
                </Label>
                <Input
                  id="spaceName"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="SQA FAB LAB"
                  className="mt-1 rounded-2xl h-12"
                />
              </div>
              <div>
                <Label htmlFor="spaceDescription" className="text-sm">
                  Space Description*
                </Label>
                <Textarea
                  id="spaceDescription"
                  value={formData.description || ''}
                  onChange={handleDescriptionChange}
                  className="mt-1 min-h-[120px] rounded-2xl resize-none"
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {wordCount}/2000 words
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-0">
          <div className="border-t border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex text-gray-800 font-medium hover:no-underline">
              <span className="flex items-center text-xl font-bold">
                2. Space Details
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 py-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="townCity" className="text-sm">
                  Town/City*
                </Label>
                <div className="relative mt-1">
                  <Input id="townCity" className="rounded-2xl pr-10 h-12" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="completeAddress" className="text-sm">
                  Complete Address*
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="completeAddress"
                    className="rounded-2xl pr-10 h-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="organizationName" className="text-sm">
                  Name of the organization (Optional)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="organizationName"
                    placeholder="Enter name of your university/institute/org/space"
                    className="rounded-2xl pr-10 h-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state" className="text-sm">
                    State*
                  </Label>
                  <div className="relative mt-1">
                    <Input id="state" className="rounded-2xl pr-10 h-12" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode" className="text-sm">
                    Zip Code*
                  </Label>
                  <Input id="zipCode" className="mt-1 rounded-2xl h-12" />
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="text-sm">
                  Country*
                </Label>
                <Input id="country" className="mt-1 rounded-2xl h-12" />
              </div>

              <div>
                <Label htmlFor="orgEmail" className="text-sm">
                  Email of the organization (Optional)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="orgEmail"
                    placeholder="Enter email id if you want to share it with us"
                    className="rounded-2xl pr-10 h-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Available Rooms and Seats
                </Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Input
                      placeholder="Category"
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Room Name/Number"
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="No. of Seats"
                      type="number"
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-2xl"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add More Rooms
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Upload Images of your space*
                </Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square border border-dashed rounded-2xl flex items-center justify-center bg-gray-50 cursor-pointer"
                    >
                      <span className="text-sm text-gray-500">Select</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Plus className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className="text-sm text-center">
                    Upload logo of your space*
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Plus className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className="text-sm text-center">
                    Upload organization logo (Optional)
                  </span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-0">
          <div className="border-t border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex text-gray-800 font-medium hover:no-underline">
              <span className="flex items-center text-xl font-bold">
                3. Lab Mentors
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 py-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Lab Facilitators</Label>
                <Input className="mt-2 rounded-2xl h-12" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Select Designation"
                    className="rounded-2xl h-12"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Add LinkedIn Profile"
                    className="rounded-2xl h-12"
                  />
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button variant="outline" size="sm" className="rounded-2xl">
                <Plus className="h-4 w-4 mr-1" /> Add More people
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-0">
          <div className="border-t border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex text-gray-800 font-medium hover:no-underline">
              <span className="flex items-center text-xl font-bold">
                4. Amenities
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 py-6">
            <div>
              <Label className="text-sm font-medium">
                Select amenities available in your space
              </Label>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4 mt-4">
                {[
                  'WiFi',
                  'Medical Room',
                  'Washrooms',
                  'Computers',
                  'Smoke Alarms',
                  'Conference Rooms',
                  'TV Screen 32"',
                  'Fire Extinguishers',
                  'Meeting Room',
                  'Projector',
                  'Emergency Exits',
                  'Water Cooler',
                  'Speaker',
                  'CCTV Camera',
                  'Free parking',
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox id={`amenity-${amenity}`} />
                    <Label
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm font-normal"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-0">
          <div className="border-t border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex text-gray-800 font-medium hover:no-underline">
              <span className="flex items-center text-xl font-bold">
                5. Basic Instructions
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 py-6">
            <div>
              <Label className="text-sm font-medium">
                Select some basic instructions for your space
              </Label>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4 mt-4">
                {[
                  'No smoking inside the space',
                  'No food or drinks allowed',
                  'Clean up after use',
                  "Respect others' work",
                  'Use equipment responsibly',
                  'Report any damages immediately',
                ].map((instruction) => (
                  <div
                    key={instruction}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox id={`instruction-${instruction}`} />
                    <Label
                      htmlFor={`instruction-${instruction}`}
                      className="text-sm font-normal"
                    >
                      {instruction}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label htmlFor="additionalInfo" className="text-sm">
                  Additional Information
                </Label>
                <Textarea
                  id="additionalInfo"
                  className="mt-1 min-h-[100px] rounded-2xl"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className="border-0">
          <div className="border-t border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex text-gray-800 font-medium hover:no-underline">
              <span className="flex items-center text-xl font-bold">
                6. How to reach your space
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 py-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="locationAddress"
                  className="text-sm font-medium"
                >
                  Complete Address
                </Label>
                <Input id="locationAddress" className="mt-1 rounded-2xl h-12" />
              </div>

              {[
                'Nearest Airport',
                'Nearest Railway Station',
                'Nearest Metro',
                'Nearest Bus stop',
              ].map((label) => (
                <div key={label}>
                  <Label
                    htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
                    className="text-sm"
                  >
                    {label}
                  </Label>
                  <Input
                    id={label.replace(/\s+/g, '-').toLowerCase()}
                    className="mt-1 rounded-2xl h-12"
                  />
                </div>
              ))}

              <div>
                <Label className="text-sm font-medium">
                  Mark exact location on Map
                </Label>
                <div className="mt-2 bg-amber-50 rounded-2xl overflow-hidden">
                  <Image
                    src="/world.svg"
                    width={400}
                    height={200}
                    alt="World Map"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <div className="border-t border-gray-200"></div>
      </Accordion>

      <div className="mt-8 flex justify-center">
        <Button
          className="rounded-full px-8 py-6 bg-black text-white text-base"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save and Preview'}
        </Button>
      </div>
    </div>
  );
}
