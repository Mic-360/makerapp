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
import { Bolt, Check, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

interface MySpacePageProps {
  makerspace: Makerspace;
  setMakerspace: React.Dispatch<React.SetStateAction<Makerspace | null>>;
}

export default function MySpacePage({
  makerspace: initialMakerspace,
  setMakerspace,
}: MySpacePageProps) {
  const router = useRouter();
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

  const handleStatusChange = async (checked: boolean) => {
    if (!token) return;

    setIsLoading(true);
    setStatusOpen(checked);
    try {
      const updatedData = {
        status: checked ? 'active' : 'inactive',
      };

      const result = await updateMakerspace(
        initialMakerspace._id,
        updatedData,
        token
      );
      // Update local state after successful API call
      setFormData((prev) => ({ ...prev, status: result.status }));

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

  const handleImageUpload = async (files: File[], isLogo: boolean = false) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('isLogoUpload', isLogo.toString());

    return formData;
  };

  const handleSubmit = async () => {
    if (!token || !formData) return;

    setIsLoading(true);
    try {
      // Handle regular form data
      const updatedData: Partial<Makerspace> = {
        status: statusOpen ? 'active' : 'inactive',
        type: formData.type || 'fabrication',
        usage: formData.usage || ['education', 'prototyping', 'manufacturing'],
        name: formData.name || '',
        description: formData.description || '',
        email: formData.email || '',
        number: formData.number || '',
        inChargeName: formData.inChargeName || '',
        websiteLink: formData.websiteLink || '',
        timings: formData.timings || {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '9:00 AM - 2:00 PM',
          sunday: 'Closed',
        },
        city: formData.city || '',
        state: formData.state || '',
        address: formData.address || '',
        zipcode: formData.zipcode || '',
        country: formData.country || '',
        organizationName: formData.organizationName || '',
        organizationEmail: formData.organizationEmail || '',
        rating: formData.rating || 0,
        seating: formData.seating || [],
        mentors: formData.mentors || [],
        amenities: formData.amenities || [],
        instructions: formData.instructions || [],
        howToReach: formData.howToReach || {},
        additionalInformation: formData.additionalInformation || '',
      };

      // First update the text data
      await updateMakerspace(initialMakerspace._id, updatedData, token);

      // Handle regular images if changed
      const changedImages = document.querySelectorAll<HTMLInputElement>(
        'input[type="file"][id^="spaceImage_"]'
      );
      const imageFiles: File[] = [];
      changedImages.forEach((input) => {
        if (input.files?.[0]) {
          imageFiles.push(input.files[0]);
        }
      });

      if (imageFiles.length > 0) {
        const imageFormData = await handleImageUpload(imageFiles, false);
        await updateMakerspace(initialMakerspace._id, imageFormData, token);
      }

      // Handle logo images if changed
      const logoFiles: File[] = [];
      const spaceLogo = document.getElementById(
        'spaceLogo_input'
      ) as HTMLInputElement;
      const orgLogo = document.getElementById(
        'orgLogo_input'
      ) as HTMLInputElement;

      if (spaceLogo?.files?.[0]) logoFiles.push(spaceLogo.files[0]);
      if (orgLogo?.files?.[0]) logoFiles.push(orgLogo.files[0]);

      if (logoFiles.length > 0) {
        const logoFormData = await handleImageUpload(logoFiles, true);
        await updateMakerspace(initialMakerspace._id, logoFormData, token);
      }

      // Refresh the data
      setFormData(updatedData);
      router.push(`${window.location.pathname}/preview`);
    } catch (error) {
      console.error('Error updating makerspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 pt-4 pb-10">
      {/* Header Section */}
      <div className="flex items-center justify-end gap-x-8">
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
            <SelectTrigger className="border-orange-500 text-black rounded-md w-[110px] text-sm">
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

      <Accordion type="single" collapsible className="w-full px-2">
        {/* Basic Details Section */}
        <AccordionItem
          value="item-1"
          className="overflow-hidden"
        >
          <div className="border-t py-2 border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex font-medium hover:no-underline bg-white">
              <span className="flex items-center text-xl font-bold text-[#2C4ABE]">
                1. Basic Details
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-6 py-6 bg-white">
            <div className="space-y-5">
              <div>
                <Label
                  htmlFor="spaceName"
                  className="pl-3 text-sm text-gray-600"
                >
                  Name of the space*
                </Label>
                <Input
                  id="spaceName"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="SQA FAB LAB"
                  className="mt-1.5 rounded-2xl h-12 border-gray-300"
                />
              </div>

              <div>
                <Label
                  htmlFor="websiteLink"
                  className="pl-3 text-sm text-gray-600"
                >
                  Your Lab's Website*
                </Label>
                <Input
                  id="websiteLink"
                  value={formData.websiteLink || ''}
                  onChange={(e) =>
                    handleInputChange('websiteLink', e.target.value)
                  }
                  placeholder="Add a website link of your Space"
                  className="mt-1.5 rounded-2xl h-12 border-gray-300"
                />
              </div>

              <div>
                <Label
                  htmlFor="spaceDescription"
                  className="pl-3 text-sm text-gray-600"
                >
                  Space Description*
                </Label>
                <Textarea
                  id="spaceDescription"
                  value={formData.description || ''}
                  onChange={handleDescriptionChange}
                  className="mt-1.5 min-h-[120px] rounded-2xl resize-none border-gray-300"
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {wordCount}/2000 words
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Space Details Section */}
        <AccordionItem
          value="item-2"
          className="overflow-hidden"
        >
          <div className="border-t py-2 border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex font-medium hover:no-underline bg-white">
              <span className="flex items-center text-xl font-bold text-[#2C4ABE]">
                2. Space Details
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-6 py-6 bg-white">
            <div className="space-y-5">
              <div>
                <Label
                  htmlFor="townCity"
                  className="pl-3 text-sm font-semibold text-gray-600"
                >
                  Town/City*
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="townCity"
                    className="rounded-2xl h-12 pr-10 border-gray-300"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="state"
                    className="pl-3 text-sm font-semibold text-gray-600"
                  >
                    State*
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="state"
                      className="rounded-2xl h-12 pr-10 border-gray-300"
                      value={formData.state || ''}
                      onChange={(e) =>
                        handleInputChange('state', e.target.value)
                      }
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="zipCode"
                    className="pl-3 text-sm font-semibold text-gray-600"
                  >
                    Zip Code*
                  </Label>
                  <Input
                    id="zipCode"
                    className="mt-1.5 rounded-2xl h-12 border-gray-300"
                    value={formData.zipcode || ''}
                    onChange={(e) =>
                      handleInputChange('zipcode', e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="country"
                  className="pl-3 text-sm font-semibold text-gray-600"
                >
                  Country*
                </Label>
                <Input
                  id="country"
                  className="mt-1.5 rounded-2xl h-12 border-gray-300"
                  value={formData.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>

              <div>
                <Label
                  htmlFor="completeAddress"
                  className="pl-3 text-sm font-semibold text-gray-600"
                >
                  Complete Address*
                </Label>
                <div className="relative mt-1.5">
                  <Textarea
                    id="completeAddress"
                    className="min-h-[100px] rounded-2xl border-gray-300"
                    value={formData.address || ''}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="organizationName"
                  className="pl-3 text-sm font-semibold text-gray-600"
                >
                  Name of the organization*
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="organizationName"
                    placeholder="Enter name of your university/institute/org/space"
                    className="rounded-2xl h-12 pr-10 border-gray-300"
                    value={formData.organizationName || ''}
                    onChange={(e) =>
                      handleInputChange('organizationName', e.target.value)
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="orgEmail"
                  className="pl-3 text-sm font-semibold text-gray-600"
                >
                  Email of the organization*
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="orgEmail"
                    placeholder="Enter email id"
                    className="rounded-2xl h-12 pr-10 border-gray-300"
                    value={formData.organizationEmail || ''}
                    onChange={(e) =>
                      handleInputChange('organizationEmail', e.target.value)
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div>
                <Label className="pl-3 text-sm font-semibold text-gray-600">
                  Days and Timing
                </Label>
                <div className="mt-3 space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    <div className="text-center">
                      <div className="border border-gray-200 rounded-lg py-2 text-base">
                        Monday
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border border-gray-200 rounded-lg py-2 text-base">
                        Tuesday
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border border-gray-200 rounded-lg py-2 text-base">
                        Wednesday
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border border-gray-200 rounded-lg py-2 text-base">
                        Thursday
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border border-gray-200 rounded-lg py-2 text-base">
                        Friday
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border border-gray-200 rounded-lg py-2 text-base">
                        Saturday
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border border-gray-200 rounded-lg py-2 text-base">
                        Sunday
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="pl-3 text-sm text-gray-500">
                        Days Open
                      </Label>
                    </div>
                    <div>
                      <Label className="pl-3 text-sm text-gray-500">Time</Label>
                    </div>
                  </div>

                  {[
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                  ].map((day) => (
                    <div
                      key={day}
                      className="grid grid-cols-2 gap-4 items-center"
                    >
                      <div className="capitalize text-base font-medium">
                        {day}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="rounded-2xl h-12 border-gray-300 text-center"
                          placeholder="10:00 AM"
                          value={(
                            formData.timings?.[
                              day as keyof Makerspace['timings']
                            ] || ''
                          )
                            .split('-')[0]
                            ?.trim()}
                          onChange={(e) => {
                            const currentTiming =
                              formData.timings?.[
                                day as keyof Makerspace['timings']
                              ] || '';
                            const endTime =
                              currentTiming.split('-')[1]?.trim() || '6:00 PM';
                            const newTiming = `${e.target.value} - ${endTime}`;
                            const updatedTimings = {
                              ...formData.timings,
                              [day]: newTiming,
                            };
                            handleInputChange('timings', updatedTimings);
                          }}
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          className="rounded-2xl h-12 border-gray-300 text-center"
                          placeholder="6:00 PM"
                          value={(
                            formData.timings?.[
                              day as keyof Makerspace['timings']
                            ] || ''
                          )
                            .split('-')[1]
                            ?.trim()}
                          onChange={(e) => {
                            const currentTiming =
                              formData.timings?.[
                                day as keyof Makerspace['timings']
                              ] || '';
                            const startTime =
                              currentTiming.split('-')[0]?.trim() || '10:00 AM';
                            const newTiming = `${startTime} - ${e.target.value}`;
                            const updatedTimings = {
                              ...formData.timings,
                              [day]: newTiming,
                            };
                            handleInputChange('timings', updatedTimings);
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="text-right">
                    <Button variant="link" className="text-gray-500">
                      Apply All
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="pl-3 text-sm font-semibold text-gray-600">
                  Available Rooms and Seats
                </Label>
                {formData.seating?.map((seat, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Input
                        placeholder="Category"
                        className="rounded-2xl h-12 border-gray-300"
                        value={seat.category || ''}
                        onChange={(e) => {
                          const updatedSeating = [...(formData.seating || [])];
                          updatedSeating[index].category = e.target.value;
                          handleInputChange('seating', updatedSeating);
                        }}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Room Name/Number"
                        className="rounded-2xl h-12 border-gray-300"
                        value={seat.room || ''}
                        onChange={(e) => {
                          const updatedSeating = [...(formData.seating || [])];
                          updatedSeating[index].room = e.target.value;
                          handleInputChange('seating', updatedSeating);
                        }}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="No. of Seats"
                        type="number"
                        className="rounded-2xl h-12 border-gray-300"
                        value={seat.seats || ''}
                        onChange={(e) => {
                          const updatedSeating = [...(formData.seating || [])];
                          updatedSeating[index].seats = parseInt(
                            e.target.value
                          );
                          handleInputChange('seating', updatedSeating);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-2xl text-gray-500"
                  onClick={() => {
                    const updatedSeating = [...(formData.seating || [])];
                    updatedSeating.push({
                      category: '',
                      room: '',
                      seats: 0,
                    });
                    handleInputChange('seating', updatedSeating);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add More Rooms
                </Button>
              </div>

              <div>
                <Label className="pl-3 text-sm font-semibold text-gray-600">
                  Upload Images of your space*
                </Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer overflow-hidden relative"
                      onClick={() =>
                        document.getElementById(`spaceImage_${i}`)?.click()
                      }
                    >
                      {formData.imageLinks?.[i] ? (
                        <Image
                          src={formData.imageLinks[i]}
                          alt={`Space image ${i + 1}`}
                          width={200}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Plus className="h-6 w-6 text-gray-400" />
                      )}
                      <input
                        type="file"
                        id={`spaceImage_${i}`}
                        className="hidden"
                        accept="image/*"
                        title={`Upload space image ${i + 1}`}
                        aria-label={`Upload space image ${i + 1}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const updatedImages = [
                                ...(formData.imageLinks || []),
                              ];
                              updatedImages[i] = reader.result as string;
                              handleInputChange('imageLinks', updatedImages);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-6 place-items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-semibold text-center">
                    Upload logo of your space*
                  </span>
                  <div
                    className="w-28 h-28 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() =>
                      document.getElementById('spaceLogo_input')?.click()
                    }
                  >
                    {formData.logoImageLinks?.[0] ? (
                      <Image
                        src={formData.logoImageLinks[0]}
                        alt="Space logo"
                        width={112}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Plus className="h-6 w-6 text-gray-400" />
                    )}
                    <input
                      type="file"
                      id="spaceLogo_input"
                      className="hidden"
                      accept="image/*"
                      title="Upload space logo"
                      aria-label="Upload space logo"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updatedLogos = [
                              ...(formData.logoImageLinks || []),
                            ];
                            updatedLogos[0] = reader.result as string;
                            handleInputChange('logoImageLinks', updatedLogos);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-semibold text-center">
                    Upload organization logo (Optional)
                  </span>
                  <div
                    className="w-28 h-28 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() =>
                      document.getElementById('orgLogo_input')?.click()
                    }
                  >
                    {formData.logoImageLinks?.[1] ? (
                      <Image
                        src={formData.logoImageLinks[1]}
                        alt="Organization logo"
                        width={112}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Plus className="h-6 w-6 text-gray-400" />
                    )}
                    <input
                      type="file"
                      id="orgLogo_input"
                      className="hidden"
                      accept="image/*"
                      title="Upload organization logo"
                      aria-label="Upload organization logo"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updatedLogos = [
                              ...(formData.logoImageLinks || []),
                            ];
                            updatedLogos[1] = reader.result as string;
                            handleInputChange('logoImageLinks', updatedLogos);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lab Mentors Section */}
        <AccordionItem
          value="item-3"
          className="overflow-hidden"
        >
          <div className="border-t py-2 border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex font-medium hover:no-underline bg-white">
              <span className="flex items-center text-xl font-bold text-[#2C4ABE]">
                3. Lab Mentors
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-6 py-6 bg-white">
            <div className="space-y-5">
              <Label className="pl-3 text-base font-semibold text-gray-600">
                Name of the Lab Facilitator
              </Label>

              {formData.mentors?.map((mentor, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-5">
                    <div
                      className="rounded-full h-20 w-20 bg-gray-100 border border-gray-300 overflow-hidden cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const updatedMentors = [
                                ...(formData.mentors || []),
                              ];
                              updatedMentors[index].image =
                                reader.result as string;
                              handleInputChange('mentors', updatedMentors);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                    >
                      {mentor.image ? (
                        <Image
                          src={mentor.image}
                          alt={`${mentor.name}'s photo`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Plus className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Name"
                        className="rounded-2xl h-12 border-gray-300"
                        value={mentor.name || ''}
                        onChange={(e) => {
                          const updatedMentors = [...(formData.mentors || [])];
                          updatedMentors[index].name = e.target.value;
                          handleInputChange('mentors', updatedMentors);
                        }}
                      />
                      <Input
                        placeholder="Designation"
                        className="rounded-2xl h-12 border-gray-300"
                        value={mentor.designation || ''}
                        onChange={(e) => {
                          const updatedMentors = [...(formData.mentors || [])];
                          updatedMentors[index].designation = e.target.value;
                          handleInputChange('mentors', updatedMentors);
                        }}
                      />
                      <Input
                        placeholder="LinkedIn Profile"
                        className="rounded-2xl h-12 border-gray-300"
                        value={mentor.linkedin || ''}
                        onChange={(e) => {
                          const updatedMentors = [...(formData.mentors || [])];
                          updatedMentors[index].linkedin = e.target.value;
                          handleInputChange('mentors', updatedMentors);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="mt-3 rounded-2xl text-gray-500"
                onClick={() => {
                  const updatedMentors = [...(formData.mentors || [])];
                  updatedMentors.push({
                    name: '',
                    designation: '',
                    linkedin: '',
                    image: '',
                  });
                  handleInputChange('mentors', updatedMentors);
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add More Mentors
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Amenities Section */}
        <AccordionItem
          value="item-4"
          className="overflow-hidden"
        >
          <div className="border-t py-2 border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex font-medium hover:no-underline bg-white">
              <span className="flex items-center text-xl font-bold text-[#2C4ABE]">
                4. Amenities
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-6 py-6 bg-white">
            <div>
              <Label className="text-base font-semibold text-gray-600">
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
                    <Checkbox
                      id={`amenity-${amenity}`}
                      className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                      checked={(formData.amenities || []).includes(amenity)}
                      onCheckedChange={(checked) => {
                        const currentAmenities = new Set(
                          formData.amenities || []
                        );
                        if (checked) {
                          currentAmenities.add(amenity);
                        } else {
                          currentAmenities.delete(amenity);
                        }
                        handleInputChange(
                          'amenities',
                          Array.from(currentAmenities)
                        );
                      }}
                    />
                    <Label
                      htmlFor={`amenity-${amenity}`}
                      className="text-base font-normal text-gray-800"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Basic Instructions Section */}
        <AccordionItem
          value="item-5"
          className="overflow-hidden"
        >
          <div className="border-t py-2 border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex font-medium hover:no-underline bg-white">
              <span className="flex items-center text-xl font-bold text-[#2C4ABE]">
                5. Basic Instructions
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-6 py-6 bg-white">
            <div>
              <Label className="text-base font-semibold text-gray-600">
                Add some basic instructions for your space
              </Label>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4 mt-4">
                {[
                  'Use equipment responsibly',
                  'Maintain cleanliness',
                  'Follow safety protocols',
                  'Respect shared spaces',
                  'Book meeting rooms in advance',
                  'Adhere to community guidelines',
                  'Report any issues to the management',
                  'Make sure to wear your Personal Protective Equipment whenever necessary',
                  'Code of Conduct',
                  'Workshop Rules',
                  'House Rules',
                  'Lab Etiquette',
                  'Operational Safety Instructions',
                ].map((instruction) => (
                  <div
                    key={instruction}
                    className="flex items-center space-x-2"
                  >
                    <Bolt className="h-3 w-3 text-orange-500 shrink-0" />
                    <Label
                      htmlFor={`instruction-${instruction}`}
                      className="text-sm font-normal text-gray-800"
                    >
                      {instruction}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label
                  htmlFor="additionalInfo"
                  className="pl-3 text-sm font-semibold text-gray-600"
                >
                  Additional Information
                </Label>
                <Textarea
                  id="additionalInfo"
                  className="mt-1.5 min-h-[100px] rounded-2xl border-gray-300"
                  value={formData.additionalInformation || ''}
                  onChange={(e) =>
                    handleInputChange('additionalInformation', e.target.value)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* How to reach your space Section */}
        <AccordionItem
          value="item-6"
          className="overflow-hidden"
        >
          <div className="border-t py-2 border-gray-200">
            <AccordionTrigger className="px-4 py-4 flex font-medium hover:no-underline bg-white">
              <span className="flex items-center text-xl font-bold text-[#2C4ABE]">
                6. How to reach your space
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-6 py-6 bg-white">
            <div className="space-y-5">
              <div>
                <Label
                  htmlFor="locationAddress"
                  className="pl-3 text-sm font-semibold text-gray-600"
                >
                  Complete Address
                </Label>
                <Textarea
                  id="locationAddress"
                  className="mt-1.5 min-h-[100px] rounded-2xl border-gray-300"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              {['airport', 'railway', 'metro', 'bus'].map((transport) => (
                <div key={transport} className="mb-4">
                  <Label
                    htmlFor={`transport-${transport}`}
                    className="pl-3 text-sm font-semibold text-gray-600 capitalize"
                  >
                    Nearest {transport}
                  </Label>
                  <Input
                    id={`transport-${transport}`}
                    className="mt-1.5 rounded-2xl h-12 border-gray-300"
                    value={
                      formData.howToReach?.[
                        transport as keyof Makerspace['howToReach']
                      ] || ''
                    }
                    onChange={(e) => {
                      const updatedHowToReach: Makerspace['howToReach'] = {
                        ...(formData.howToReach || {}),
                        [transport]: e.target.value,
                      };
                      handleInputChange('howToReach', updatedHowToReach);
                    }}
                  />
                </div>
              ))}

              <div>
                <Label className="pl-3 text-sm font-semibold text-gray-600">
                  Mark exact location on Map
                </Label>
                <div className="mt-2 bg-amber-50 rounded-2xl overflow-hidden">
                  <Image
                    src="/world.svg"
                    width={400}
                    height={200}
                    alt="World Map"
                    className="w-full h-auto"
                    onClick={() => window.open(initialMakerspace.googleMapLink)}
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
          className="rounded-full px-12 py-6 bg-black hover:bg-neutral-800 text-white text-lg font-bold"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save and Preview'}
        </Button>
      </div>
    </div>
  );
}
