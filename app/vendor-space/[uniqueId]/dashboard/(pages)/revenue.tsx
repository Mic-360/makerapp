import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export default function RevenuePage() {
  return (
    <div className="flex justify-between gap-4">
      <div className="space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹10000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                From Machines
              </CardTitle>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹6000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profit</CardTitle>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹8000</div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Transaction History
              </CardTitle>
              <button className="text-xs text-blue-600">Show all</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">Ranbir Singh</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        3D Printing Workshop
                      </div>
                      <div className="text-xs text-gray-500">
                        SOA FAB LAB Bhubaneswar
                      </div>
                      <div className="text-xs text-gray-500">
                        25 Jun - 28 Jun, 2024
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-xs text-gray-500">
                        Transaction Id: KFRS34DCXR#8
                      </div>
                    </div>
                    <div className="flex-1 text-right font-medium">₹ 1000</div>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 flex items-center">
                    <Image
                      src="/placeholder.svg"
                      alt="Event"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Add Visa or Mastercard
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-10 flex items-center">
                    <Image
                      src="/placeholder.svg"
                      alt="Event"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Add PhonePe or GPay
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-10 flex items-center">
                    <Image
                      src="/placeholder.svg"
                      alt="Event"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Add UPI or QR
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-10 flex items-center">
                    <Image
                      src="/placeholder.svg"
                      alt="Event"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Add PayTM UPI or QR
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Revenue Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-medium">Total Revenue</div>
              <div className="flex items-center">
                <div>₹10000</div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2"
                >
                  <path
                    d="M12 8V16M8 12H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-medium">Total Registrations</div>
              <div className="flex items-center">
                <div>2000</div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2"
                >
                  <path
                    d="M12 8V16M8 12H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-medium">
                Highest Revenue Generating Event
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V16M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-sm">25 Jun - 28 Jun, 2024</div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Event"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="text-sm font-medium">3D Printing Workshop</div>
                <div className="text-xs text-gray-500">
                  SOA FAB LAB, Bhubaneswar
                </div>
              </div>
            </div>
            <div className="text-sm">25 Jun - 28 Jun, 2024</div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Event"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="text-sm font-medium">3D Printing Workshop</div>
                <div className="text-xs text-gray-500">
                  SOA FAB LAB, Bhubaneswar
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2 pt-2">
              <div className="font-medium">
                Highest Revenue Generating Machine
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V16M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Event"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="text-sm font-medium">
                  3D Printer Creality 333XP
                </div>
                <div className="text-xs text-gray-500">
                  SOA FAB LAB, Bhubaneswar
                </div>
              </div>
            </div>
            <div className="mt-4 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              <div className="text-center">
                <div className="font-medium">TBD</div>
                <div className="text-xs text-gray-500">
                  Graphs or anything analytics
                  <br />
                  churn rates, etc
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
