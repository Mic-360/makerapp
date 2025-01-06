'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface StatsCardProps {
  title: string;
  value: string;
}

const StatsCard = ({ title, value }: StatsCardProps) => (
  <Card className="p-6 bg-[#F5F5F5] rounded-2xl">
    <h3 className="text-base font-medium text-gray-600">{title}</h3>
    <p className="mt-2 text-2xl font-semibold">{value}</p>
  </Card>
);

export default function RevenuePage() {
  return (
    <div className="flex gap-6">
      {/* Left Side */}
      <div className="flex-grow space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6">
          <StatsCard title="Total Revenue" value="₹0" />
          <StatsCard title="From Machines" value="₹0" />
          <StatsCard title="Profit" value="₹0" />
        </div>

        {/* Transaction History */}
        <Card className="p-6 bg-[#F5F5F5] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-600">
              Transaction History
            </h3>
            <Button variant="link" className="text-blue-600">
              Show all
            </Button>
          </div>
          <div className="h-48 bg-white rounded-lg">
            {/* Transaction history table will be implemented here */}
          </div>
        </Card>

        {/* Payment Options */}
        <Card className="p-6 bg-[#F5F5F5] rounded-2xl">
          <h3 className="text-base font-medium text-gray-600 mb-4">
            Payment Options
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <Image
                src="/visa-mastercard.png"
                alt="Visa/Mastercard"
                width={100}
                height={50}
                className="mx-auto mb-2"
              />
              <Button variant="outline" className="w-full">
                Add Visa or Mastercard
              </Button>
            </div>
            <div className="text-center">
              <Image
                src="/phonepe.png"
                alt="PhonePe"
                width={100}
                height={50}
                className="mx-auto mb-2"
              />
              <Button variant="outline" className="w-full">
                Add Phone Pay QR/Link
              </Button>
            </div>
            <div className="text-center">
              <Image
                src="/upi.png"
                alt="UPI"
                width={100}
                height={50}
                className="mx-auto mb-2"
              />
              <Button variant="outline" className="w-full">
                Add UPI Link/QR
              </Button>
            </div>
            <div className="text-center">
              <Image
                src="/paytm.png"
                alt="Paytm"
                width={100}
                height={50}
                className="mx-auto mb-2"
              />
              <Button variant="outline" className="w-full">
                Add PayTM Link/QR
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Side */}
      <div className="w-1/4">
        <StatsCard title="Revenue Report" value="View" />
      </div>
    </div>
  );
}
