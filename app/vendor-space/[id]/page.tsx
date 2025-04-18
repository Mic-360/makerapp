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
import { createMakerspace } from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { Check, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useEffect } from 'react';
import { verifyMakerspaceToken } from '@/lib/api';

interface FormData {
  type: 'independent' | 'institution' | '';
  purposes: ('rent' | 'host')[];
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
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
      orgEmail: '',
      country: '',
    },
    media: {
      images: [],
    },
  });

  const { user, token } = useAuthenticationStore();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = params.id as string;
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
  }, [params.id, router]);

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
      const token = params.id as string;

      if (!token) {
        throw new Error('No token found');
      }

      // Create a FormData object
      const makerspaceFormData = new FormData();

      // Append text fields
      makerspaceFormData.append('type', formData.type);
      formData.purposes.forEach((purpose) =>
        makerspaceFormData.append('usage[]', purpose)
      );
      makerspaceFormData.append('name', formData.spaceDetails.name);
      makerspaceFormData.append('email', formData.spaceDetails.email);
      makerspaceFormData.append('vendorEmail', formData.spaceDetails.email); // Add vendorEmail
      makerspaceFormData.append(
        'number',
        selectedCountryCode + formData.spaceDetails.contact
      );
      makerspaceFormData.append(
        'inChargeName',
        formData.spaceDetails.inchargeName
      );
      makerspaceFormData.append('websiteLink', formData.spaceDetails.website);
      makerspaceFormData.append('city', formData.address.city);
      makerspaceFormData.append('state', formData.address.state);
      makerspaceFormData.append('address', formData.address.address);
      makerspaceFormData.append('zipcode', formData.address.zipCode);
      makerspaceFormData.append('country', formData.address.country);
      makerspaceFormData.append('organizationName', formData.address.orgName);
      makerspaceFormData.append(
        'organizationEmail',
        formData.address.orgEmail || ''
      );

      // Process and append timings
      const processedTimings = {
        monday:
          formData.spaceDetails.timings.Monday?.from &&
          formData.spaceDetails.timings.Monday?.to
            ? `${formData.spaceDetails.timings.Monday.from}-${formData.spaceDetails.timings.Monday.to}`
            : '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: '',
      };
      makerspaceFormData.append('timings', JSON.stringify(processedTimings));

      // Append image files
      formData.media.images.forEach((file, index) => {
        if (file) {
          makerspaceFormData.append('images', file);
        }
      });

      // Append logo files, checking if they exist
      if (formData.media.spaceLogo) {
        makerspaceFormData.append('images', formData.media.spaceLogo);
      }
      if (formData.media.orgLogo) {
        makerspaceFormData.append('images', formData.media.orgLogo);
      }

      const response = await createMakerspace(token, makerspaceFormData);

      // Save makerspace ID and redirect to dashboard
      useAuthenticationStore
        .getState()
        .setActiveMakerspaceId(response.makerspace._id);
      router.push(`/vendor-space/${response.makerspace._id}/dashboard`);
      setLoading(false);
    } catch (error: any) {
      console.log('Submission error:', error.message);
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-[36px] font-bold text-[#1C1C1C] text-center max-w-3xl mb-16 font-nhaasTxPro">
              Are you an independent lab or with an institution?
            </h1>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
              {[
                {
                  type: 'independent',
                  title: 'Independent\nLab',
                  description:
                    'Generate revenue by renting out underutilized machines to creators and hobbyists.',
                },
                {
                  type: 'institution',
                  title: 'Inside\nInstitution',
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
                  className={`flex-1 p-8 rounded-[27px] border text-left transition-all relative ${
                    formData.type === option.type
                      ? 'border-[#1C1C1C] border-[1.8px]'
                      : 'border-[#D6D6D6] hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`${
                      formData.type === option.type
                        ? 'border-[#30C77B]'
                        : 'border-[#D6D6D6]'
                    } absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex justify-center items-center`}
                  >
                    {formData.type === option.type && (
                      <div className="h-3 w-3 rounded-full bg-[#30C77B]" />
                    )}
                  </div>
                  <h2 className="text-[28px] font-medium text-[#323232] mb-4 whitespace-pre-line leading-[1.14]">
                    {option.title}
                  </h2>
                  <p className="text-[16px] text-[#626262] leading-[1.375]">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-[36px] font-bold text-[#323232] text-center max-w-3xl mb-16 font-nhaasTxPro leading-[1.26]">
              What do you want to use this app for?
            </h1>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
              {[
                {
                  type: 'rent',
                  title: 'Rent\nMachines',
                  description:
                    'Generate revenue by renting out underutilized machines to creators and hobbyists.',
                },
                {
                  type: 'host',
                  title: 'Host\nEvents',
                  description:
                    'Increase exposure and revenue by organizing workshops, meetups, and special events.',
                },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    const newPurposes = formData.purposes.includes(
                      option.type as 'rent' | 'host'
                    )
                      ? formData.purposes.filter((p) => p !== option.type)
                      : [...formData.purposes, option.type as 'rent' | 'host'];
                    setFormData({ ...formData, purposes: newPurposes });
                  }}
                  className={`flex-1 p-8 rounded-[27px] border text-left transition-all relative ${
                    formData.purposes.includes(option.type as 'rent' | 'host')
                      ? 'border-[#030303] border-[1.3px]'
                      : 'border-[#D6D6D6] hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`${
                      formData.purposes.includes(option.type as 'rent' | 'host')
                        ? 'border-[#30C77B]'
                        : 'border-[#D6D6D6]'
                    } absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex justify-center items-center`}
                  >
                    {formData.purposes.includes(
                      option.type as 'rent' | 'host'
                    ) && <div className="h-3 w-3 rounded-full bg-[#30C77B]" />}
                  </div>
                  <h2 className="text-[28px] font-medium text-[#323232] mb-4 whitespace-pre-line leading-[1.18]">
                    {option.title}
                  </h2>
                  <p className="text-[16px] text-[#626262] leading-[1.44]">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-screen max-w-5xl">
            <h1 className="text-[36px] font-bold text-[#323232] text-center mb-2 font-nhaasTxPro leading-[1.26]">
              Tell us about your Space
            </h1>
            <p className="text-[#888888] text-[16px] text-center mb-16 font-nhaasTxPro">
              Add details about your space below
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {/* Left column */}
                <div className="space-y-2">
                  <Label
                    htmlFor="space-name"
                    className="pl-4 text-[14px] font-medium text-[#323232] font-nhaasTxPro"
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
                      className="h-12 rounded-xl pr-12 text-[18px] leading-[1.24] text-[#1C1C1C] placeholder:text-[#888888] border-[1.5px] border-[#D6D6D6] font-nhaasTxPro"
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
                      <SelectTrigger className="w-32 h-12 rounded-xl border-[1.5px] border-[#D6D6D6] text-[16px] font-nhaasTxPro">
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
                        className="h-12 rounded-xl pr-12 text-[18px] leading-[1.24] text-[#1C1C1C] placeholder:text-[#888888] border-[1.5px] border-[#D6D6D6] font-nhaasTxPro"
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
                    className="pl-4 text-[14px] font-medium text-[#323232] font-nhaasTxPro"
                  >
                    Website*
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
                      className="h-12 rounded-xl pr-12 text-[18px] leading-[1.24] text-[#1C1C1C] placeholder:text-[#888888] border-[1.5px] border-[#D6D6D6] font-nhaasTxPro"
                    />
                    {formData.spaceDetails.website && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
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

                <div className="space-y-2">
                  <Label className="pl-4 text-[14px] font-medium text-[#323232] font-nhaasTxPro">
                    Select Timings
                  </Label>
                  <div className="flex items-center gap-4 rounded-lg">
                    <Select
                      value={convertTo12Hour(
                        formData.spaceDetails.timings.Monday?.from || ''
                      )}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            timings: {
                              Monday: {
                                from: convertTo24Hour(value),
                                to:
                                  formData.spaceDetails.timings.Monday?.to ||
                                  '',
                              },
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-full h-12 rounded-xl border-[1.5px] border-[#D6D6D6] text-[18px] leading-[1.22] font-nhaasTxPro">
                        <SelectValue placeholder="Opening time">
                          {formData.spaceDetails.timings.Monday?.from
                            ? convertTo12Hour(
                                formData.spaceDetails.timings.Monday.from
                              )
                            : 'Opening time'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          const time = `${hour}:00`;
                          return (
                            <SelectItem
                              key={hour}
                              value={convertTo12Hour(time)}
                            >
                              {convertTo12Hour(time)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <span className="text-[#888888] font-medium text-[16px] font-nhaasTxPro">
                      to
                    </span>
                    <Select
                      value={convertTo12Hour(
                        formData.spaceDetails.timings.Monday?.to || ''
                      )}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          spaceDetails: {
                            ...formData.spaceDetails,
                            timings: {
                              Monday: {
                                from:
                                  formData.spaceDetails.timings.Monday?.from ||
                                  '',
                                to: convertTo24Hour(value),
                              },
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-full h-12 rounded-xl border-[1.5px] border-[#D6D6D6] text-[18px] leading-[1.22] font-nhaasTxPro">
                        <SelectValue placeholder="Closing time">
                          {formData.spaceDetails.timings.Monday?.to
                            ? convertTo12Hour(
                                formData.spaceDetails.timings.Monday.to
                              )
                            : 'Closing time'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          const time = `${hour}:00`;
                          return (
                            <SelectItem
                              key={hour}
                              value={convertTo12Hour(time)}
                            >
                              {convertTo12Hour(time)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-8 max-w-screen-lg">
              <Label className="pl-4 text-[14px] font-medium text-[#323232] font-nhaasTxPro">
                Days Open
              </Label>
              <div className="flex gap-[0.6rem]">
                {days.map((day) => (
                  <Button
                    variant="ghost"
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
                    className={`h-12 px-8 rounded-[10px] border transition-colors font-nhaasTxPro text-[14px] font-medium ${
                      formData.spaceDetails.daysOpen.includes(day)
                        ? 'bg-[#2A2A2A] text-white border-[#2A2A2A]'
                        : 'text-[#323232] border-[#D9D9D9] hover:border-[#323232]'
                    }`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-screen max-w-6xl">
            <h1 className="text-[36px] font-bold text-[#1C1C1C] text-center mb-2 font-nhaasTxPro leading-[1.26]">
              Tell us more about your Space
            </h1>
            <p className="text-[#888888] text-[16px] text-center mb-16 font-nhaasTxPro leading-[1.22]">
              Add details about your space below
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="pl-4 text-[14px] font-semibold text-[#1C1C1C] font-nhaasTxPro"
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
                      className="h-12 rounded-xl border-[1.5px] border-[#D6D6D6] pr-12 text-[18px] leading-[1.24] font-nhaasTxPro text-[#1C1C1C] placeholder:text-[#9E9E9E]"
                    />
                    {formData.address.city.trim() && (
                      <Check className="w-5 h-5 text-[#30C77B] absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="pl-4 text-[14px] font-semibold text-[#1C1C1C] font-nhaasTxPro"
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
                      className="h-36 border-[1.5px] border-[#D6D6D6] mb-2 rounded-xl pr-12 text-[18px] leading-[1.24] font-nhaasTxPro align-top text-start p-4 w-full bg-transparent placeholder:text-[#9E9E9E] text-[#1C1C1C]"
                    />
                    {formData.address.address.trim() && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-4" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="org-name"
                    className="pl-4 text-[14px] font-bold text-[#1C1C1C] font-nhaasTxPro leading-[1.26]"
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
                      className="h-12 rounded-xl border-[1.5px] border-[#D6D6D6] pr-12 text-[18px] leading-[1.24] font-nhaasTxPro text-[#1C1C1C] placeholder:text-[#9E9E9E]"
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
                    className="pl-4 text-[14px] font-semibold text-[#1C1C1C] font-nhaasTxPro"
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
                      className="h-12 rounded-xl border-[1.5px] border-[#D6D6D6] pr-12 text-[18px] leading-[1.24] font-nhaasTxPro text-[#1C1C1C] placeholder:text-[#9E9E9E]"
                    />
                    {formData.address.state.trim() && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="zip"
                    className="pl-4 text-[14px] font-semibold text-[#1C1C1C] font-nhaasTxPro"
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
                      className="h-12 rounded-xl border-[1.5px] border-[#D6D6D6] pr-12 text-[18px] leading-[1.24] font-nhaasTxPro text-[#1C1C1C] placeholder:text-[#9E9E9E]"
                    />
                    {formData.address.zipCode.trim() && (
                      <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="pl-4 text-[14px] font-semibold text-[#1C1C1C] font-nhaasTxPro"
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
                      <SelectTrigger className="w-full h-12 rounded-xl border-[1.5px] border-[#D6D6D6] text-[18px] leading-[1.24] font-nhaasTxPro text-[#1C1C1C] placeholder:text-[#9E9E9E]">
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
                    className="pl-4 text-[14px] font-bold text-[#1C1C1C] font-nhaasTxPro leading-[1.26]"
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
                      className="h-12 rounded-xl border-[1.5px] border-[#D6D6D6] pr-12 text-[18px] leading-[1.24] font-nhaasTxPro text-[#1C1C1C] placeholder:text-[#9E9E9E]"
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
            <h1 className="text-[36px] font-bold text-[#1C1C1C] text-center mb-2 font-nhaasTxPro leading-[1.26]">
              Show us your Space
            </h1>
            <p className="text-[16px] text-[#888888] text-center mb-16 font-nhaasTxPro leading-[1.22]">
              Add images of your space
            </p>{' '}
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-[14px] font-semibold text-[#323232] font-haasGrotDisp leading-[1.2] tracking-[-1%]">
                    Upload images of your space*
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="w-4 h-4 rounded-full border border-[#9B9B9B] border-opacity-80 flex items-center justify-center">
                          <span className="text-[12px] text-[#9B9B9B] font-medium">
                            i
                          </span>
                        </div>
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
                        aspect-[16/9] rounded-[17px] border border-[#D6D6D6]
                        ${
                          formData.media.images[index]
                            ? 'border-none p-0'
                            : 'p-4'
                        }
                        flex items-center justify-center cursor-pointer
                        hover:border-[#1C1C1C] transition-colors overflow-hidden relative group
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
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[17px]">
                            <p className="text-white text-[14px] font-nhaasTxPro">
                              Click to change
                            </p>
                          </div>
                        </>
                      ) : (
                        <Plus className="w-8 h-8 text-[#1C1C1C] opacity-50" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-24">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Label className="text-[14px] font-semibold text-[#1C1C1C] font-haasGrotDisp">
                      Upload logo of your space*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="w-4 h-4 rounded-full border border-[#9B9B9B] border-opacity-80 flex items-center justify-center">
                            <span className="text-[12px] text-[#9B9B9B] font-medium">
                              i
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload your space logo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <label
                    className={`
                      w-32 h-32 rounded-full border-[1px] border-[#D6D6D6]
                      ${formData.media.spaceLogo ? 'border-none p-0' : 'p-4'}
                      flex items-center justify-center cursor-pointer
                      hover:border-[#1C1C1C] transition-colors overflow-hidden relative group
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
                          className="object-cover rounded-full"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                          <p className="text-white text-[14px] font-nhaasTxPro">
                            Click to change
                          </p>
                        </div>
                      </>
                    ) : (
                      <Plus className="w-8 h-8 text-[#1C1C1C] opacity-50" />
                    )}
                  </label>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <Label className="text-[14px] font-bold text-[#1C1C1C] font-nhaasTxPro leading-[1.26]">
                    Upload organisation&apos;s logo (Optional)
                  </Label>
                  <label
                    className={`
                      w-32 h-32 rounded-full border-[1px] border-[#D6D6D6]
                      ${formData.media.orgLogo ? 'border-none p-0' : 'p-4'}
                      flex items-center justify-center cursor-pointer
                      hover:border-[#1C1C1C] transition-colors overflow-hidden relative group
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
                          className="object-cover rounded-full"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                          <p className="text-white text-[14px] font-nhaasTxPro">
                            Click to change
                          </p>
                        </div>
                      </>
                    ) : (
                      <Plus className="w-8 h-8 text-[#1C1C1C] opacity-50" />
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
