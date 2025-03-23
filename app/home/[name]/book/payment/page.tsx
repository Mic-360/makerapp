'use client';

import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import {
  Check,
  Clock,
  Link2Icon,
  MapPin,
  MessageCircle,
  Printer,
  Share,
  Star,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';

type BookingState =
  | 'initial'
  | 'loading'
  | 'failed'
  | 'success'
  | 'confirmed'
  | 'approved';

export default function BookingFlow() {
  const [bookingState, setBookingState] = useState<BookingState>('initial');
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [selectedTime, setSelectedTime] = useState('10:00 a.m. to 12:00 p.m.');
  const [quantity, setQuantity] = useState(1);

  const handleProceedToPayment = async () => {
    try {
      setBookingState('loading');
      // Mock backend call to simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // Simulate successful payment response
      setBookingState('success');
      setTimeout(() => {
      setBookingState('confirmed');
      setTimeout(() => setBookingState('approved'), 3000); // Set booking state to approved after 3 seconds
      }, 500);
    } catch (error) {
      console.error('Payment processing error:', error);
      setBookingState('failed');
      setTimeout(() => setBookingState('initial'), 500);
    }
  };

  const renderPaymentStatus = () => {
    switch (bookingState) {
      case 'loading':
        return (
          <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-xl flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
              </div>
              <p className="text-xl">Please wait, while we process</p>
              <p className="text-gray-500">your payment</p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-xl flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto h-16 w-16 rounded-full border-2 border-red-500 flex items-center justify-center">
                  <X className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <p className="text-xl font-semibold">Payment Failed</p>
              <p>Retry!</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-xl flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto h-16 w-16 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <p className="text-xl font-semibold">Congratulations!</p>
              <p>your payment is completed.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderInitialForm = () => {
    return (
      <div className="py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold">Confirm and Pay</h1>
          <div className="flex flex-col items-center">
            <svg
              width="83"
              height="83"
              viewBox="0 0 123 123"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M60.5 102C82.8675 102 101 83.8675 101 61.5C101 39.1325 82.8675 21 60.5 21C38.1325 21 20 39.1325 20 61.5C20 83.8675 38.1325 102 60.5 102ZM60.5 104C83.9721 104 103 84.9721 103 61.5C103 38.0279 83.9721 19 60.5 19C37.0279 19 18 38.0279 18 61.5C18 84.9721 37.0279 104 60.5 104Z"
                fill="#D6D6D6"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M61 -2.62268e-07C64.3137 -1.17422e-07 67 2.68629 67 6L67 116.5C67 119.814 64.3137 122.5 61 122.5C57.6863 122.5 55 119.814 55 116.5L55 6C55 2.68629 57.6863 -4.07115e-07 61 -2.62268e-07Z"
                fill="#f9fafb"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M123 61C123 64.3137 120.314 67 117 67L6.5 67C3.18629 67 0.5 64.3137 0.499999 61C0.499999 57.6863 3.18629 55 6.5 55L117 55C120.314 55 123 57.6863 123 61Z"
                fill="#f9fafb"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M57.4757 21.6528C57.6676 23.0201 56.7148 24.2841 55.3475 24.476C34.046 27.4657 25.1851 46.0071 23.4547 54.974C23.1931 56.3297 21.882 57.2166 20.5263 56.955C19.1706 56.6934 18.2836 55.3823 18.5453 54.0266C20.4815 43.9935 30.354 22.9349 54.6525 19.5246C56.0198 19.3327 57.2838 20.2855 57.4757 21.6528Z"
                fill="#30C77B"
              />
              <path
                d="M60.4039 56.5325H54.4639V54.2285C55.2799 54.2045 56.0599 54.1085 56.8039 53.9405C57.5719 53.7725 58.2559 53.4965 58.8559 53.1125C59.4799 52.7045 59.9959 52.1885 60.4039 51.5645C60.8119 50.9165 61.0759 50.1245 61.1959 49.1885H63.8959V75.0005H60.4039V56.5325Z"
                fill="#323232"
              />
            </svg>
            <p className="text-xs">Done</p>
          </div>
        </div>

        <div className="flex justify-between gap-x-10">
          <div className="flex w-2/3 flex-col">
            <hr className="border-t border-gray-200 my-4" />
            <div className="flex justify-between">
              <div className="flex gap-4 mb-6">
                <Image
                  src="/assetlist.png"
                  alt="3D Printer"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">3d Printer Creality 333XP</h3>
                  <p className="text-sm text-gray-600">
                    Max Build Vol: 200 X 200 X 200 cm
                    <br />
                    Material: FDA, ABS, Resin
                    <br />
                    Nozzle Size: .25mm
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-x-4 mb-4">
                <Button
                  className="hover:bg-orange-500 aspect-square"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span>{quantity}</span>
                <Button
                  className="hover:bg-orange-500"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
                <span className="ml-auto font-semibold">
                  ₹ {500 * quantity}/hr
                </span>
              </div>
            </div>
            <hr className="border-t border-gray-200" />
            <div className="space-y-4 my-6">
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-semibold col-span-2">SELECTED DATE</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={new Date().toDateString()}>
                      {new Date().toDateString()}
                    </SelectItem>
                    <SelectItem
                      value={new Date(Date.now() + 86400000).toDateString()}
                    >
                      {new Date(Date.now() + 86400000).toDateString()}
                    </SelectItem>
                    <SelectItem
                      value={new Date(Date.now() + 2 * 86400000).toDateString()}
                    >
                      {new Date(Date.now() + 2 * 86400000).toDateString()}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-semibold col-span-2">SELECTED TIME</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00 a.m. to 12:00 p.m.">
                      10:00 a.m. to 12:00 p.m.
                    </SelectItem>
                    <SelectItem value="12:00 p.m. to 2:00 p.m.">
                      12:00 p.m. to 2:00 p.m.
                    </SelectItem>
                    <SelectItem value="2:00 p.m. to 4:00 p.m.">
                      2:00 p.m. to 4:00 p.m.
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-xl mb-4">Price Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹ 90</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee</span>
                  <span>₹ 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance</span>
                  <span>₹ 50</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-b py-2">
                  <span className="font-semibold text-xl">
                    Total Cost (INR)
                  </span>
                  <span className="font-semibold text-lg">
                    ₹ {500 * quantity + 145}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3 border p-10 rounded-2xl shadow-xl flex flex-col items-center">
            <h3 className="font-medium mb-4">Payment Mode</h3>
            <Select defaultValue="upi">
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upi">RazorPay UPI</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-start gap-x-2 my-6">
              <Checkbox id="terms" className="mt-1" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                By selecting the button below, I agree to the Makerspace rules,
                Ground rules for guests, Karkhana Reworking and Refund Policy
                and that Karkhana can charge my payment method if I'm
                responsible for damage.
              </label>
            </div>

            <Input placeholder="Enter Coupon Code" className="mb-4" />

            <div className="mb-6 space-y-2">
              <div className="border-y p-4">
                <h3 className="font-medium mb-2">Cancellation</h3>
                <p className="text-sm text-gray-600">
                  Cancel before 6hrs of your booking time for a complete refund.
                  After that, your refund depends on when you cancel.{' '}
                  <Button variant="link" className="p-0 h-auto">
                    Learn more
                  </Button>
                </p>
              </div>
            </div>

            <Button
              className="rounded-full px-6"
              onClick={handleProceedToPayment}
            >
              Proceed to payment
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingConfirmation = () => {
    return (
      <div className="py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Booking Confirmed!</h1>
          <div className="flex flex-col items-end">
            <svg
              width="83"
              height="83"
              viewBox="0 0 123 123"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60.5"
                cy="61.5"
                r="41"
                stroke="#BDBDBD"
                stroke-width="3"
              />
              <path
                d="M21 54.5C22.8333 45 32.2 25.2 55 22"
                stroke="#30C77B"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M68.164 22.0778C77.798 23.8883 98.065 33.9965 102.061 59.9449"
                stroke="#30C77B"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M56.1623 102.355C46.4232 101.241 25.4827 92.6138 19.6341 67.0192"
                stroke="#30C77B"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M101 69.0002C99.1548 78.6356 88.9227 98.8952 62.7561 102.85"
                stroke="#30C77B"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M117 61L6.5 61"
                stroke="#f9fafb"
                stroke-width="12"
                stroke-linecap="round"
              />
              <path
                d="M61 6L61 116.5"
                stroke="#f9fafb"
                stroke-width="12"
                stroke-linecap="round"
              />
              <path
                d="M62.8687 73V66.952H51.2407V64.252L63.4447 48.088H65.8207V64.54H69.8887V66.952H65.8207V73H62.8687ZM54.1567 64.432V64.54H62.8687V52.984H62.7967L54.1567 64.432Z"
                fill="#454545"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <Button variant="link" className="flex gap-x-2 items-center">
                <Share className="h-4 w-4 text-gray-400" />
                <span>Print Receipt</span>
              </Button>
              <Button variant="link" className="flex items-center gap-x-2">
                <Printer className="h-4 w-4 text-gray-400 " />{' '}
                <span>Print confirmed ticket</span>
              </Button>
            </div>
          </div>
        </div>

        <Card className="max-w-screen-xl p-8 rounded-3xl border-t-8 border-blue-600">
          <CardContent className="p-0 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-8">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-emerald-500 text-sm font-semibold">
                    MACHINE BOOKED
                  </span>
                  <p>
                    <span className="text-emerald-500 text-sm">
                      Booking Id:{' '}
                    </span>
                    <span className="font-medium">LB456304HHIV</span>
                  </p>
                </div>
                <h1 className="text-2xl font-medium mt-4">
                  3d Printer Creality 333XP
                </h1>
              </div>

              <div className="space-y-1">
                <div className="flex gap-x-2">
                  <span className="text-gray-700">Max Build Vol:</span>
                  <span className="font-medium">200 X 200 X 200 cm</span>
                </div>
                <div className="flex gap-x-2">
                  <span className="text-gray-700">Material:</span>
                  <span className="font-medium">FDA, ABS, Resin</span>
                </div>
                <div className="flex gap-x-2">
                  <span className="text-gray-700">Nozzle Size:</span>
                  <span className="font-medium">0.25mm</span>
                </div>
                <button className="text-gray-400 text-sm mt-2">
                  View More
                </button>
              </div>

              <div className="space-y-4 border-y py-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">BOOKING DATE</span>
                  <span className="font-medium">3 June 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">BOOKING TIME</span>
                  <span className="font-medium">10:00 a.m. to 12:00 p.m.</span>
                </div>
              </div>

              <div>
                <h2 className="uppercase text-gray-600 mb-2">Cancellation</h2>
                <p className="text-gray-800 ml-4 text-sm">
                  Cancel before 8 hrs of your booking time for a complete
                  refund.
                  <br />
                  After that, your refund depends on when you cancel.{' '}
                  <Link
                    href="/cancel-policy"
                    className="text-gray-400 underline"
                  >
                    Learn more
                  </Link>
                </p>
                <Button variant="link" className="text-gray-400">
                  Cancel your booking request
                </Button>
              </div>
            </div>
            <div className="p-6 border-l border-gray-400">
              <div className="text-start space-y-4">
                <div className="flex justify-start">
                  <Image
                    src="/soa.svg"
                    alt="SOA FAB Lab Logo"
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
                <h2 className="text-xl font-semibold">SOA FAB Lab</h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>
                    SOA University Campus 1, Khandagiri, Bhubaneswar, Odisha
                    751030
                  </span>
                </div>
                <div className="flex gap-6">
                  <p className="flex gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span>10 - 6 P.M.</span>
                  </p>
                  <p className="flex gap-2">
                    <Link2Icon className="w-5 h-5 -rotate-45 text-orange-500" />
                    <Link
                      href="http://www.soafablab.edu.in"
                      className="w-5 h-5 text-gray-400 flex gap-x-2"
                    >
                      www.soafablab.edu.in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBookingRequest = () => {
    return (
      <div className="bg-background">
        <main className="max-w-7xl mx-auto px-4 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Booking Request Sent!</h1>
            <div className="flex flex-col items-center">
              <svg
                width="83"
                height="83"
                viewBox="0 0 123 123"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="60.5"
                  cy="61.5"
                  r="41"
                  stroke="#BDBDBD"
                  stroke-width="3"
                />
                <path
                  d="M21 54.5C22.8333 45 32.2 25.2 55 22"
                  stroke="#30C77B"
                  stroke-width="5"
                  stroke-linecap="round"
                />
                <path
                  d="M68.164 22.0778C77.798 23.8883 98.065 33.9965 102.061 59.9449"
                  stroke="#30C77B"
                  stroke-width="5"
                  stroke-linecap="round"
                />
                <path
                  d="M101 69.0002C99.1548 78.6356 88.9227 98.8952 62.7561 102.85"
                  stroke="#30C77B"
                  stroke-width="5"
                  stroke-linecap="round"
                />
                <path
                  d="M117 61L6.5 61"
                  stroke="#f9fafb"
                  stroke-width="12"
                  stroke-linecap="round"
                />
                <path
                  d="M61 6L61 116.5"
                  stroke="#f9fafb"
                  stroke-width="12"
                  stroke-linecap="round"
                />
                <path
                  d="M60.728 73.54C55.292 73.54 51.008 70.48 50.9 64.864H53.888C53.996 68.824 56.552 71.02 60.62 71.02C64.04 71.02 66.452 69.328 66.452 65.836C66.452 62.704 64.112 61.048 59.972 61.048H58.424V58.708H59.936C63.788 58.708 65.732 57.088 65.732 54.46C65.732 51.76 63.32 50.14 60.368 50.14C56.804 50.14 54.68 52.444 54.68 55.864H51.728C51.764 51.004 55.04 47.764 60.476 47.764C65.048 47.764 68.684 50.248 68.684 54.532C68.684 57.304 66.992 58.924 64.616 59.716V59.824C68.072 60.724 69.584 62.92 69.584 66.124C69.584 70.84 65.732 73.54 60.728 73.54Z"
                  fill="#454545"
                />
              </svg>
              <span className="text-xs">Confirmation Pending</span>

              <Button variant="link" className="flex items-center gap-x-2">
                <Printer className="h-4 w-4 text-gray-400 " />{' '}
                <span>Print payment receipt</span>
              </Button>
            </div>
          </div>

          <Card className="max-w-screen-xl p-8 rounded-3xl border-2 border-gray-600">
            <CardContent className="p-0 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
              <div className="space-y-8">
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-500 text-sm font-semibold">
                      MACHINE BOOKED
                    </span>
                    <p>
                      <span className="text-emerald-500 text-sm">
                        Booking Id:{' '}
                      </span>
                      <span className="font-medium">LB456304HHIV</span>
                    </p>
                  </div>
                  <h1 className="text-2xl font-medium mt-4">
                    3d Printer Creality 333XP
                  </h1>
                </div>

                <div className="space-y-1">
                  <div className="flex gap-x-2">
                    <span className="text-gray-700">Max Build Vol:</span>
                    <span className="font-medium">200 X 200 X 200 cm</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="text-gray-700">Material:</span>
                    <span className="font-medium">FDA, ABS, Resin</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="text-gray-700">Nozzle Size:</span>
                    <span className="font-medium">0.25mm</span>
                  </div>
                  <button className="text-gray-400 text-sm mt-2">
                    View More
                  </button>
                </div>

                <div className="space-y-4 border-y py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">BOOKING DATE</span>
                    <span className="font-medium">3 June 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">BOOKING TIME</span>
                    <span className="font-medium">
                      10:00 a.m. to 12:00 p.m.
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="uppercase text-gray-600 mb-2">Cancellation</h2>
                  <p className="text-gray-800 ml-4 text-sm">
                    Cancel before 8 hrs of your booking time for a complete
                    refund.
                    <br />
                    After that, your refund depends on when you cancel.{' '}
                    <Link
                      href="/cancel-policy"
                      className="text-gray-400 underline"
                    >
                      Learn more
                    </Link>
                  </p>
                  <Button variant="link" className="text-gray-400">
                    Cancel your booking request
                  </Button>
                </div>
              </div>
              <div className="p-6 border-l border-gray-400">
                <div className="text-start space-y-4">
                  <div className="flex justify-start">
                    <Image
                      src="/soa.svg"
                      alt="SOA FAB Lab Logo"
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">SOA FAB Lab</h2>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-2">
                    <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>
                      SOA University Campus 1, Khandagiri, Bhubaneswar, Odisha
                      751030
                    </span>
                  </div>
                  <div className="flex gap-6">
                    <p className="flex gap-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span>10 - 6 P.M.</span>
                    </p>
                    <p className="flex gap-2">
                      <Link2Icon className="w-5 h-5 -rotate-45 text-orange-500" />
                      <Link
                        href="http://www.soafablab.edu.in"
                        className="w-5 h-5 text-gray-400 flex gap-x-2"
                      >
                        www.soafablab.edu.in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <TopBar theme="light" />
      <div className="max-w-6xl mx-auto pt-20">
        {bookingState === 'initial' && renderInitialForm()}
        {bookingState === 'confirmed' && renderBookingRequest()}
        {bookingState === 'approved' && renderBookingConfirmation()}
        {renderPaymentStatus()}
        <Separator className="my-8" />
        <div className="flex items-start justify-between gap-4 my-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact the Lab</h2>
            <h3 className="text-md font-medium mb-2 flex gap-x-1 items-center">
              <MapPin className="h-4 w-4 inline-block text-orange-500" />
              <span>Location</span>
            </h3>
            <p className="text-sm text-gray-600 ml-8">
              SQA University Campus 1, Khandagiri,
              <br />
              Bhubaneswar, Odisha - 751030
            </p>

            <h3 className="text-md font-medium mt-4 mb-2 flex gap-x-1 items-center">
              <Star className="h-4 w-4 inline-block text-orange-500" />
              <span>How to reach us</span>
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-8">
              <li>2km from Bhubaneswar airport</li>
              <li>5km from Bhubaneswar Railway Station</li>
              <li>1km from Khandagiri metro station</li>
              <li>2km from Municipal metro station</li>
            </ul>

            <h3 className="text-md font-medium mt-4 mb-2 flex gap-x-1 items-center">
              <MessageCircle className="h-4 w-4 inline-block text-orange-500" />
              <span>Chat with Lab</span>
            </h3>
          </div>
          <div className="flex flex-col gap-y-2 items-center">
            <div className="bg-yellow-100 rounded-2xl py-1 px-4">
              <Image
                src="/world.svg"
                alt="World Map"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <Button
              variant="link"
              className="text-lg"
              onClick={() =>
                window.open(
                  'https://maps.app.goo.gl/qjaRb4rr4dzq64NY7',
                  '_blank'
                )
              }
            >
              Find on Map →
            </Button>{' '}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
