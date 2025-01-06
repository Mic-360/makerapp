'use client';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatsCardProps {
  title: string;
  value?: string | number;
  className?: string;
}

const StatsCard = ({ title, value, className }: StatsCardProps) => (
  <Card className={`p-6 bg-[#F5F5F5] rounded-3xl ${className}`}>
    <h3 className="text-base font-medium text-gray-600">{title}</h3>
    {value && <p className="mt-2 text-2xl font-semibold">{value}</p>}
  </Card>
);

export default function DashboardPage() {
  return (
    <div className="flex gap-6">
      {/* Left Side */}
      <div className="flex-grow space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-3 gap-6">
          <StatsCard title="Total Bookings" value="0" />
          <StatsCard title="Upcoming Bookings" value="0" />
          <StatsCard title="Overall rating" value="0.0" />
        </div>

        {/* Revenue Chart */}
        <Card className="p-6 bg-[#F5F5F5] rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-600">
              Revenue Chart
            </h3>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-36 bg-white rounded-lg">
            {/* Chart will be implemented here */}
          </div>
        </Card>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2 p-6 bg-[#F5F5F5] rounded-3xl">
            <h3 className="text-base font-medium text-gray-600 mb-4">
              Lab Activity
            </h3>
            <div className="h-36 bg-white rounded-lg">
              {/* Activity chart will be implemented here */}
            </div>
          </Card>
          <Card className="p-6 bg-[#F5F5F5] rounded-3xl">
            <h3 className="text-base font-medium text-gray-600 mb-4">
              Total Memberships
            </h3>
            <div className="h-36 bg-white rounded-lg">
              {/* Memberships chart will be implemented here */}
            </div>
          </Card>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/3 space-y-6">
        <StatsCard title="Upcoming" value="0" className="h-[calc(40%-12px)]" />
        <Card className="p-6 bg-[#F5F5F5] rounded-3xl h-[calc(60%-12px)]">
          <h3 className="text-base font-medium text-gray-600 mb-4">
            Events in Progress
          </h3>
          <div className="h-[calc(100%-2rem)] bg-white rounded-lg">
            {/* Events list will be implemented here */}
          </div>
        </Card>
      </div>
    </div>
  );
}
