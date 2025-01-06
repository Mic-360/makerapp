'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Plus, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/router';

interface FormData {
  type: 'independent' | 'institution' | null;
  purposes: ('rent' | 'membership' | 'events')[];
  spaceDetails: {
    name: string;
    email: string;
    contact: string;
    inchargeName: string;
    website: string;
    timings: {
      from: string;
      to: string;
    };
    daysOpen: string[];
  };
  address: {
    city: string;
    state: string;
    address: string;
    zipCode: string;
    country: string;
    orgName?: string;
    orgEmail?: string;
  };
  media: {
    images: File[];
    spaceLogo?: File;
    orgLogo?: File;
  };
}

export default function SpaceSubmissionFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: null,
    purposes: [],
    spaceDetails: {
      name: '',
      email: '',
      contact: '',
      inchargeName: '',
      website: '',
      timings: { from: '10:00 a.m.', to: '12:00 p.m.' },
      daysOpen: [],
    },
    address: {
      city: '',
      state: '',
      address: '',
      zipCode: '',
      country: '',
      orgName: '',
      orgEmail: '',
    },
    media: {
      images: [],
      spaceLogo: undefined,
      orgLogo: undefined,
    },
  });

  const steps = [1, 2, 3, 4, 5];
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    if (currentStep === 5) {
      router.push(`/vendor-space/${currentStep}/dashboard`);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-center max-w-3xl mb-16">
              Are you an independent lab or with an institution?
            </h1>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
              {[
                {
                  type: 'independent',
                  title: 'Independent Lab',
                  description:
                    'Generate revenue by renting out underutilized machines to creators and hobbyists.',
                },
                {
                  type: 'institution',
                  title: 'Inside Institution',
                  description:
                    'Establish a steady income stream and build community loyalty through membership plans.',
                },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      type: option.type as 'independent' | 'institution',
                    })
                  }
                  className={`flex-1 p-8 rounded-3xl border-2 text-left transition-all relative ${
                    formData.type === option.type
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 ${
                      formData.type === option.type
                        ? 'border-black bg-black'
                        : 'border-gray-300'
                    }`}
                  />
                  <h2 className="text-2xl font-bold mb-4">{option.title}</h2>
                  <p className="text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-center max-w-3xl mb-16">
              What do you want to use this app for?
            </h1>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
              {[
                {
                  type: 'rent',
                  title: 'Rent Machines',
                  description:
                    'Generate revenue by renting out underutilized machines to creators and hobbyists.',
                },
                {
                  type: 'membership',
                  title: 'Offer Memberships',
                  description:
                    'Establish a steady income stream and build community loyalty through membership plans.',
                },
                {
                  type: 'events',
                  title: 'Host Events',
                  description:
                    'Increase exposure and revenue by organizing workshops, meetups, and special events.',
                },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    const newPurposes = formData.purposes.includes(
                      option.type as 'rent' | 'membership' | 'events'
                    )
                      ? formData.purposes.filter((p) => p !== option.type)
                      : [
                          ...formData.purposes,
                          option.type as 'rent' | 'membership' | 'events',
                        ];
                    setFormData({ ...formData, purposes: newPurposes });
                  }}
                  className={`flex-1 p-8 rounded-3xl border-2 text-left transition-all relative ${
                    formData.purposes.includes(
                      option.type as 'rent' | 'membership' | 'events'
                    )
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 ${
                      formData.purposes.includes(
                        option.type as 'rent' | 'membership' | 'events'
                      )
                        ? 'border-black bg-black'
                        : 'border-gray-300'
                    }`}
                  />
                  <h2 className="text-2xl font-bold mb-4">{option.title}</h2>
                  <p className="text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-screen max-w-5xl">
            <h1 className="text-[40px] font-bold text-center mb-2">
              Tell us about your Space
            </h1>
            <p className="text-gray-500 text-center mb-16">
              Add details about your space below
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="space-name"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Name of the space*
                  </Label>
                  <div className="relative">
                    <Input
                      id="space-name"
                      placeholder="Enter name of your Makerspace/Fablab"
                      value={formData.spaceDetails.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            name: e.target.value,
                          },
                        })
                      }
                      className="h-12 rounded-2xl pr-12 text-base placeholder:text-gray-400 border border-black/20"
                    />
                    {formData.spaceDetails.name && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contact"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Contact number*
                  </Label>
                  <div className="relative">
                    <Input
                      id="contact"
                      placeholder="+91"
                      value={formData.spaceDetails.contact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            contact: e.target.value,
                          },
                        })
                      }
                      className="h-12 rounded-2xl pr-12 text-base placeholder:text-gray-400 border border-black/20"
                    />
                    {formData.spaceDetails.contact && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="website"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Website*
                  </Label>
                  <Input
                    id="website"
                    placeholder="Add a website link of you Space"
                    value={formData.spaceDetails.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        spaceDetails: {
                          ...formData.spaceDetails,
                          website: e.target.value,
                        },
                      })
                    }
                    className="h-12 border border-black/20 rounded-2xl text-base placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="space-email"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Email of the space*
                  </Label>
                  <div className="relative">
                    <Input
                      id="space-email"
                      type="email"
                      placeholder="Enter email of your space"
                      value={formData.spaceDetails.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            email: e.target.value,
                          },
                        })
                      }
                      className="h-12 rounded-2xl pr-12 text-base placeholder:text-gray-400 border border-black/20"
                    />
                    {formData.spaceDetails.email && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="incharge"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Space incharge&apos;s name*
                  </Label>
                  <div className="relative">
                    <Input
                      id="incharge"
                      placeholder="Enter name of the incharge"
                      value={formData.spaceDetails.inchargeName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            inchargeName: e.target.value,
                          },
                        })
                      }
                      className="h-12 rounded-2xl pr-12 text-base placeholder:text-gray-400 border border-black/20"
                    />
                    {formData.spaceDetails.inchargeName && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="pl-4 text-base font-normal text-gray-600">
                    Select Timings
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      value={formData.spaceDetails.timings.from}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            timings: {
                              ...formData.spaceDetails.timings,
                              from: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl text-base"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      value={formData.spaceDetails.timings.to}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            timings: {
                              ...formData.spaceDetails.timings,
                              to: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="pl-4 text-base font-normal text-gray-600">
                  Days Open
                </Label>
                <div className="flex flex-wrap gap-3">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        const newDays = formData.spaceDetails.daysOpen.includes(
                          day
                        )
                          ? formData.spaceDetails.daysOpen.filter(
                              (d) => d !== day
                            )
                          : [...formData.spaceDetails.daysOpen, day];
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            daysOpen: newDays,
                          },
                        });
                      }}
                      className={`h-14 px-8 rounded-2xl border transition-colors ${
                        formData.spaceDetails.daysOpen.includes(day)
                          ? 'bg-black text-white border-black'
                          : 'text-gray-900 border-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-screen max-w-6xl">
            <h1 className="text-[40px] font-bold text-center mb-2">
              Tell us more about your Space
            </h1>
            <p className="text-gray-500 text-center mb-16">
              Add details about your space below
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Town/City*
                  </Label>
                  <div className="relative">
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            city: e.target.value,
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl pr-12 text-base"
                    />
                    {formData.address.city && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Complete Address*
                  </Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={formData.address.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            address: e.target.value,
                          },
                        })
                      }
                      className="h-36 border border-black/20 mb-8 rounded-2xl pr-12 text-base align-top"
                    />
                    {formData.address.address && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-4" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="org-name"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Name of the organisation (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="org-name"
                      placeholder="Enter name of you university/institution/Legal Name"
                      value={formData.address.orgName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            orgName: e.target.value,
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl pr-12 text-base placeholder:text-gray-400"
                    />
                    {formData.address.orgName && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-base font-normal text-gray-600"
                  >
                    State*
                  </Label>
                  <div className="relative">
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            state: e.target.value,
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl pr-12 text-base"
                    />
                    {formData.address.state && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="zip"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Zip Code*
                  </Label>
                  <div className="relative">
                    <Input
                      id="zip"
                      value={formData.address.zipCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            zipCode: e.target.value,
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl pr-12 text-base"
                    />
                    {formData.address.zipCode && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Country*
                  </Label>
                  <div className="relative">
                    <Input
                      id="country"
                      value={formData.address.country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            country: e.target.value,
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl pr-12 text-base"
                    />
                    {formData.address.country && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="org-email"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Email of the organisation (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="org-email"
                      type="email"
                      placeholder="Enter email of you university/institution"
                      value={formData.address.orgEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            orgEmail: e.target.value,
                          },
                        })
                      }
                      className="h-12 border border-black/20 rounded-2xl pr-12 text-base placeholder:text-gray-400"
                    />
                    {formData.address.orgEmail && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="w-screen max-w-6xl">
            <h1 className="text-[40px] font-bold text-center mb-2">
              Show us your Space
            </h1>
            <p className="text-gray-500 text-center mb-16">
              Add images of your space
            </p>

            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-normal text-gray-600">
                    Upload images of your space*
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload images of your space</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className="aspect-[16/9] rounded-2xl border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <Plus className="w-8 h-8 text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-24">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Label className="text-base font-normal text-gray-600">
                      Upload logo of your space
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload your space logo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
                    <Plus className="w-8 h-8 text-gray-300" />
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <Label className="text-base font-normal text-gray-600">
                    Upload organisation&apos;s logo (Optional)
                  </Label>
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
                    <Plus className="w-8 h-8 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full p-6 px-20 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Karkhana Logo"
            width={170}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex gap-4">
          {steps.map((step) => (
            <div
              key={step}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === currentStep
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {renderStep()}
      </main>

      <footer className="w-full p-6 px-20 flex justify-between items-center border-t">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          BACK
        </Button>
        <Button
          variant="link"
          className="flex items-center gap-2"
          onClick={handleNext}
          disabled={
            (currentStep === 1 && !formData.type) ||
            (currentStep === 2 && formData.purposes.length === 0)
          }
        >
          SAVE AND NEXT
          <ArrowRight className="w-4 h-4" />
        </Button>
      </footer>
    </div>
  );
}
