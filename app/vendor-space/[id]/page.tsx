'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { createMakerspace, verifyMakerspaceToken } from '@/lib/api';
import { Check, Info, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

interface FormData {
  type: 'independent' | 'institution' | '';
  purposes: ('rent' | 'membership' | 'events')[];
  spaceDetails: {
    name: string;
    email: string;
    contact: string;
    inchargeName: string;
    website: string;
    daysOpen: string[];
    timings: Record<string, { from: string; to: string }>;
  };
  address: {
    city: string;
    state: string;
    address: string;
    zipCode: string;
    orgName: string;
    orgEmail?: string;
    country: string;
  };
  media: {
    images: File[];
    spaceLogo?: File;
    orgLogo?: File;
  };
}

const steps = [1, 2, 3, 4, 5];

export default function SpaceSubmissionFlow() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [formData, setFormData] = useState<FormData>({
    type: '',
    purposes: [],
    spaceDetails: {
      name: '',
      email: '',
      contact: '',
      inchargeName: '',
      website: '',
      daysOpen: [],
      timings: {},
    },
    address: {
      city: '',
      state: '',
      address: '',
      zipCode: '',
      orgName: '',
      country: '',
    },
    media: {
      images: [],
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = pathname.split('/').pop();
        if (!token) {
          router.push('/vendor-space');
          return;
        }

        const response = await verifyMakerspaceToken(token);
        if (!response.isValid) {
          router.push('/vendor-space');
          return;
        }

        if (response.email) {
          setVerifiedEmail(response.email);
          setFormData((prev) => ({
            ...prev,
            spaceDetails: {
              ...prev.spaceDetails,
              email: response.email || '',
            },
          }));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error verifying token:', error);
        router.push('/vendor-space');
      }
    };

    verifyToken();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateContact = (contact: string) => {
    return /^\d{10}$/.test(contact);
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    const [hours, minutes] = time.split(':');
    let convertedHours = hours;

    if (hours === '12') {
      convertedHours = '00';
    }

    if (modifier === 'PM') {
      convertedHours = String(parseInt(convertedHours, 10) + 12);
    }

    return `${convertedHours}:${minutes}`;
  };

  const convertTo12Hour = (time24h: string) => {
    if (!time24h) return '';
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);

    if (hour === 0) {
      return `12:${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const countryCodes = [
    { country: 'India', code: '+91' },
    { country: 'United States', code: '+1' },
    { country: 'United Kingdom', code: '+44' },
  ];

  const validateCase3 = () => {
    const { name, email, contact, inchargeName } = formData.spaceDetails;
    return (
      name.trim() !== '' &&
      validateEmail(email) &&
      validateContact(contact) &&
      inchargeName.trim() !== ''
    );
  };

  const validateCase4 = () => {
    const { city, state, address, zipCode, country } = formData.address;

    return (
      city.trim() !== '' &&
      state.trim() !== '' &&
      address.trim() !== '' &&
      zipCode.trim() !== '' &&
      country.trim() !== ''
    );
  };

  const validateCase5 = () => {
    const { images, spaceLogo } = formData.media;
    const filledImagesCount = images.filter((img) => img).length;
    return filledImagesCount >= 3 && spaceLogo !== undefined;
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...formData.media.images];
      newImages[index] = file;
      setFormData({
        ...formData,
        media: {
          ...formData.media,
          images: newImages,
        },
      });
    }
  };

  const handleLogoUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'space' | 'org'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        media: {
          ...formData.media,
          [type === 'space' ? 'spaceLogo' : 'orgLogo']: file,
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = pathname.split('/').pop();

      if (!token) {
        throw new Error('No token found');
      }

      // Process uploaded images and logos to get URLs
      const imageUrls = await Promise.all(
        formData.media.images.map(async (file) => {
          // Here you would implement your image upload logic
          // and return the URL of the uploaded image
          return '/assetlist.png'; // Replace with actual upload logic
        })
      );

      const spaceLogoUrl = formData.media.spaceLogo
        ? '/assetlist.png'
        : undefined; // Replace with actual upload
      const orgLogoUrl = formData.media.orgLogo ? '/assetlist.png' : undefined; // Replace with actual upload

      // Convert timings to required format
      const processedTimings: Record<string, string> = {};
      Object.entries(formData.spaceDetails.timings).forEach(([day, timing]) => {
        processedTimings[day.toLowerCase()] = `${timing.from}-${timing.to}`;
      });

      const makerspaceData = {
        type: formData.type,
        usage: formData.purposes,
        name: formData.spaceDetails.name,
        email: formData.spaceDetails.email,
        number: selectedCountryCode + formData.spaceDetails.contact,
        inChargeName: formData.spaceDetails.inchargeName,
        websiteLink: formData.spaceDetails.website || '',
        timings: processedTimings,
        city: formData.address.city,
        state: formData.address.state,
        address: formData.address.address,
        zipcode: formData.address.zipCode,
        country: formData.address.country,
        organizationName: formData.address.orgName || undefined,
        organizationEmail: formData.address.orgEmail || undefined,
        imageLinks: imageUrls,
        logoImageLinks: [spaceLogoUrl, orgLogoUrl].filter(Boolean) as string[],
      };

      const response = await createMakerspace(token, makerspaceData);

      // Redirect to the dashboard page for the created makerspace
      router.push(`/vendor-space/${response._id}/dashboard`);
    } catch (error: any) {
      console.log('Submission error:', error.message);
    } finally {
      setLoading(false);
    }
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
                  className={`flex-1 p-8 rounded-3xl border text-left transition-all relative ${
                    formData.type === option.type
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`${
                      formData.type === option.type
                        ? 'border-green-500'
                        : 'border-gray-300'
                    } absolute top-4 right-4 w-4 h-4 rounded-full border-2 flex justify-center items-center`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        formData.type === option.type
                          ? 'bg-green-500'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
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
                  className={`flex-1 p-8 rounded-3xl border text-left transition-all relative ${
                    formData.purposes.includes(
                      option.type as 'rent' | 'membership' | 'events'
                    )
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`${
                      formData.purposes.includes(
                        option.type as 'rent' | 'membership' | 'events'
                      )
                        ? 'border-green-500'
                        : 'border-gray-300'
                    } absolute top-4 right-4 w-4 h-4 rounded-full border-2 flex justify-center items-center`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        formData.purposes.includes(
                          option.type as 'rent' | 'membership' | 'events'
                        )
                          ? 'bg-green-500'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
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
                {/* Left column */}
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
                  <div className="flex gap-2">
                    <Select
                      value={selectedCountryCode}
                      onValueChange={setSelectedCountryCode}
                    >
                      <SelectTrigger className="w-32 h-12 rounded-2xl border-black/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.code} ({country.country})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Input
                        id="contact"
                        placeholder="Enter your number"
                        type="tel"
                        value={formData.spaceDetails.contact}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 10) {
                            setFormData({
                              ...formData,
                              spaceDetails: {
                                ...formData.spaceDetails,
                                contact: value,
                              },
                            });
                          }
                        }}
                        className="h-12 rounded-2xl pr-12 text-base placeholder:text-gray-400 border border-black/20"
                      />
                      {validateContact(formData.spaceDetails.contact) && (
                        <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                  {formData.spaceDetails.contact &&
                    !validateContact(formData.spaceDetails.contact) && (
                      <p className="text-red-500 text-sm pl-4">
                        Please enter a valid 10-digit number
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="website"
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    Website
                  </Label>
                  <div className="relative">
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
                    {formData.spaceDetails.website && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <Label className="pl-4 text-base font-normal text-gray-600">
                    Days Open
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {days.map((day) => (
                      <Button
                        variant="ghost"
                        key={day}
                        onClick={() => {
                          const newDays =
                            formData.spaceDetails.daysOpen.includes(day)
                              ? formData.spaceDetails.daysOpen.filter(
                                  (d) => d !== day
                                )
                              : [...formData.spaceDetails.daysOpen, day];
                          setFormData({
                            ...formData,
                            spaceDetails: {
                              ...formData.spaceDetails,
                              daysOpen: newDays,
                              timings: formData.spaceDetails.daysOpen.includes(
                                day
                              )
                                ? Object.fromEntries(
                                    Object.entries(
                                      formData.spaceDetails.timings
                                    ).filter(([key]) => key !== day)
                                  )
                                : {
                                    ...formData.spaceDetails.timings,
                                    [day]: { from: '', to: '' },
                                  },
                            },
                          });
                        }}
                        className={`h-12 px-4 rounded-2xl border transition-colors ${
                          formData.spaceDetails.daysOpen.includes(day)
                            ? 'bg-black text-white border-black'
                            : 'text-gray-900 border-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
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
                    {validateEmail(formData.spaceDetails.email) && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {formData.spaceDetails.email &&
                    !validateEmail(formData.spaceDetails.email) && (
                      <p className="text-red-500 text-sm pl-4">
                        Please enter a valid email address
                      </p>
                    )}
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="pl-4 text-base font-normal text-gray-600">
                      Timings*
                    </Label>
                    {Object.keys(formData.spaceDetails.timings).length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 rounded-xl"
                        onClick={() => {
                          const firstDay = Object.entries(
                            formData.spaceDetails.timings
                          )[0];
                          if (firstDay) {
                            const [_, timing] = firstDay;
                            const newTimings =
                              formData.spaceDetails.daysOpen.reduce(
                                (
                                  acc: Record<
                                    string,
                                    { from: string; to: string }
                                  >,
                                  day
                                ) => {
                                  if (day !== 'Sunday') {
                                    acc[day] = { ...timing };
                                  }
                                  return acc;
                                },
                                {}
                              );
                            setFormData({
                              ...formData,
                              spaceDetails: {
                                ...formData.spaceDetails,
                                timings: newTimings,
                              },
                            });
                          }
                        }}
                      >
                        Assign to all
                      </Button>
                    )}
                  </div>
                  <div className="h-72 overflow-y-scroll space-y-4 scrollbar-hide">
                    {formData.spaceDetails.daysOpen.map((day) => (
                      <div
                        key={day}
                        className="flex items-center gap-2 border border-gray-400 p-4 rounded-2xl"
                      >
                        <span className="w-24 text-gray-600 font-medium">
                          {day}
                        </span>
                        <div className="flex-1 flex items-center gap-2">
                          {day === 'Sunday' ? (
                            <>
                              <Select
                                value={
                                  formData.spaceDetails.timings[day]?.from || ''
                                }
                                onValueChange={(value) => {
                                  if (value === 'closed') {
                                    setFormData({
                                      ...formData,
                                      spaceDetails: {
                                        ...formData.spaceDetails,
                                        timings: {
                                          ...formData.spaceDetails.timings,
                                          [day]: {
                                            from: 'closed',
                                            to: 'closed',
                                          },
                                        },
                                      },
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      spaceDetails: {
                                        ...formData.spaceDetails,
                                        timings: {
                                          ...formData.spaceDetails.timings,
                                          [day]: {
                                            ...formData.spaceDetails.timings[
                                              day
                                            ],
                                            from: convertTo24Hour(value),
                                          },
                                        },
                                      },
                                    });
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full h-12 rounded-xl border-gray-300">
                                  <SelectValue placeholder="Opening time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="closed">Closed</SelectItem>
                                  {Array.from({ length: 12 }, (_, i) => {
                                    const hour = (i + 1).toString();
                                    return (
                                      <>
                                        <SelectItem
                                          key={`${hour}AM`}
                                          value={`${hour}:00 AM`}
                                        >
                                          {`${hour}:00 AM`}
                                        </SelectItem>
                                        <SelectItem
                                          key={`${hour}PM`}
                                          value={`${hour}:00 PM`}
                                        >
                                          {`${hour}:00 PM`}
                                        </SelectItem>
                                      </>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              {formData.spaceDetails.timings[day]?.from !==
                                'closed' && (
                                <>
                                  <span className="text-gray-400">to</span>
                                  <Select
                                    value={convertTo12Hour(
                                      formData.spaceDetails.timings[day]?.to ||
                                        ''
                                    )}
                                    onValueChange={(value) =>
                                      setFormData({
                                        ...formData,
                                        spaceDetails: {
                                          ...formData.spaceDetails,
                                          timings: {
                                            ...formData.spaceDetails.timings,
                                            [day]: {
                                              ...formData.spaceDetails.timings[
                                                day
                                              ],
                                              to: convertTo24Hour(value),
                                            },
                                          },
                                        },
                                      })
                                    }
                                  >
                                    <SelectTrigger className="w-full h-12 rounded-xl border-gray-300">
                                      <SelectValue placeholder="Closing time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 12 }, (_, i) => {
                                        const hour = (i + 1).toString();
                                        return (
                                          <>
                                            <SelectItem
                                              key={`${hour}AM`}
                                              value={`${hour}:00 AM`}
                                            >
                                              {`${hour}:00 AM`}
                                            </SelectItem>
                                            <SelectItem
                                              key={`${hour}PM`}
                                              value={`${hour}:00 PM`}
                                            >
                                              {`${hour}:00 PM`}
                                            </SelectItem>
                                          </>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <Select
                                value={convertTo12Hour(
                                  formData.spaceDetails.timings[day]?.from || ''
                                )}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    spaceDetails: {
                                      ...formData.spaceDetails,
                                      timings: {
                                        ...formData.spaceDetails.timings,
                                        [day]: {
                                          ...formData.spaceDetails.timings[day],
                                          from: convertTo24Hour(value),
                                        },
                                      },
                                    },
                                  })
                                }
                              >
                                <SelectTrigger className="w-full h-12 rounded-xl border-gray-300">
                                  <SelectValue placeholder="Opening time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => {
                                    const hour = (i + 1).toString();
                                    return (
                                      <>
                                        <SelectItem
                                          key={`${hour}AM`}
                                          value={`${hour}:00 AM`}
                                        >
                                          {`${hour}:00 AM`}
                                        </SelectItem>
                                        <SelectItem
                                          key={`${hour}PM`}
                                          value={`${hour}:00 PM`}
                                        >
                                          {`${hour}:00 PM`}
                                        </SelectItem>
                                      </>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <span className="text-gray-400">to</span>
                              <Select
                                value={convertTo12Hour(
                                  formData.spaceDetails.timings[day]?.to || ''
                                )}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    spaceDetails: {
                                      ...formData.spaceDetails,
                                      timings: {
                                        ...formData.spaceDetails.timings,
                                        [day]: {
                                          ...formData.spaceDetails.timings[day],
                                          to: convertTo24Hour(value),
                                        },
                                      },
                                    },
                                  })
                                }
                              >
                                <SelectTrigger className="text-black w-full h-12 rounded-xl border-gray-300">
                                  <SelectValue placeholder="Closing time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => {
                                    const hour = (i + 1).toString();
                                    return (
                                      <>
                                        <SelectItem
                                          key={`${hour}AM`}
                                          value={`${hour}:00 AM`}
                                        >
                                          {`${hour}:00 AM`}
                                        </SelectItem>
                                        <SelectItem
                                          key={`${hour}PM`}
                                          value={`${hour}:00 PM`}
                                        >
                                          {`${hour}:00 PM`}
                                        </SelectItem>
                                      </>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                      placeholder="Enter your city"
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
                    {formData.address.city.trim() && (
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
                    <textarea
                      id="address"
                      placeholder="Enter your complete address"
                      title="Complete address input field"
                      aria-label="Complete address"
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
                      className="h-36 border border-black/20 mb-2 rounded-2xl pr-12 text-base align-top text-start p-4 w-full bg-transparent placeholder:text-gray-400"
                    />
                    {formData.address.address.trim() && (
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
                    className="pl-4 text-base font-normal text-gray-600"
                  >
                    State*
                  </Label>
                  <div className="relative">
                    <Input
                      id="state"
                      placeholder="Enter your state"
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
                    {formData.address.state.trim() && (
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
                      placeholder="Enter your zip code"
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
                    {formData.address.zipCode.trim() && (
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
                    <Select
                      value={formData.address.country}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            country: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-full h-12 rounded-2xl border-black/20">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem
                            key={country.country}
                            value={country.country}
                          >
                            {country.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    {formData.address.orgEmail &&
                      validateEmail(formData.address.orgEmail) && (
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
                  {[0, 1, 2, 3].map((index) => (
                    <label
                      key={index}
                      className={`
                        aspect-[16/9] rounded-2xl border-2 border-dashed
                        ${formData.media.images[index] ? 'border-none p-0' : 'border-gray-400 p-4'}
                        flex items-center justify-center cursor-pointer
                        hover:border-gray-300 transition-colors overflow-hidden relative group
                      `}
                    >
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      {formData.media.images[index] ? (
                        <>
                          <Image
                            src={URL.createObjectURL(
                              formData.media.images[index]
                            )}
                            alt={`Space image ${index + 1}`}
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
                    </label>
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
                  <label
                    className={`
                      w-32 h-32 rounded-full border-2 border-dashed
                      ${formData.media.spaceLogo ? 'border-none p-0' : 'border-gray-400 p-4'}
                      flex items-center justify-center cursor-pointer
                      hover:border-gray-300 transition-colors overflow-hidden relative group
                    `}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'space')}
                    />
                    {formData.media.spaceLogo ? (
                      <>
                        <Image
                          src={URL.createObjectURL(formData.media.spaceLogo)}
                          alt="Space logo"
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
                  </label>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <Label className="text-base font-normal text-gray-600">
                    Upload organisation&apos;s logo (Optional)
                  </Label>
                  <label
                    className={`
                      w-32 h-32 rounded-full border-2 border-dashed
                      ${formData.media.orgLogo ? 'border-none p-0' : 'border-gray-400 p-4'}
                      flex items-center justify-center cursor-pointer
                      hover:border-gray-300 transition-colors overflow-hidden relative group
                    `}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'org')}
                    />
                    {formData.media.orgLogo ? (
                      <>
                        <Image
                          src={URL.createObjectURL(formData.media.orgLogo)}
                          alt="Organization logo"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </>
                    ) : (
                      <Plus className="w-8 h-8 text-gray-300" />
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => (
    <footer className="w-full p-6 gap-20 flex justify-center items-center">
      <Button
        className="rounded-2xl px-8 border-gray-300 border"
        variant="outline"
        onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
        disabled={currentStep === 1}
      >
        BACK
      </Button>
      <Button
        variant="default"
        className="flex rounded-3xl items-center gap-2 px-12"
        onClick={() =>
          currentStep === 5
            ? handleSubmit()
            : setCurrentStep((prev) => prev + 1)
        }
        disabled={
          (currentStep === 1 && !formData.type) ||
          (currentStep === 2 && formData.purposes.length === 0) ||
          (currentStep === 3 && !validateCase3()) ||
          (currentStep === 4 && !validateCase4()) ||
          (currentStep === 5 && !validateCase5())
        }
      >
        SAVE AND NEXT
      </Button>
    </footer>
  );

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
                  ? 'bg-red-300 text-white'
                  : step < currentStep
                    ? 'bg-green-500 text-black'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {renderStep()}
      </main>

      {renderFooter()}
    </div>
  );
}
