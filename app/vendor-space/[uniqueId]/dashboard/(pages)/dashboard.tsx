import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex gap-4 justify-between">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">90</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Bookings
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">90</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Overall rating
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold">4.2</div>
              <Star className="ml-2 h-6 w-6 text-orange-500 fill-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Chart</CardTitle>
            <div className="relative">
              <select
                aria-label="Revenue Chart Timeframe"
                className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-1 pr-8 text-sm focus:outline-none"
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <div className="flex h-full items-end gap-2">
                {[
                  { month: 'Jan', value: 65 },
                  { month: 'Feb', value: 45 },
                  { month: 'Mar', value: 80 },
                  { month: 'Apr', value: 55 },
                  { month: 'May', value: 90 },
                  { month: 'Jun', value: 70 },
                  { month: 'Jul', value: 50 },
                  { month: 'Aug', value: 85 },
                  { month: 'Sep', value: 95 },
                  { month: 'Oct', value: 60 },
                  { month: 'Nov', value: 75 },
                  { month: 'Dec', value: 65 },
                ].map((data, i) => (
                  <div
                    key={data.month}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div
                      className={`w-full rounded-t-sm ${data.value > 80 ? 'bg-orange-400' : 'bg-gray-200'} transition-all duration-300 hover:bg-orange-300`}
                      style={{
                        height: `${data.value}%`,
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">
                      {data.month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lab Activity</CardTitle>
            <button className="text-xs text-blue-600">Show all</button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src="/placeholder.svg"
                        alt="Event"
                        width={40}
                        height={40}
                      />{' '}
                    </div>
                    <div className="text-sm">
                      You have a new booking request
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">4 hrs ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4 w-1/2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm">30 Jun, 2024 Onwards</div>
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
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                      <Image
                        src="/placeholder.svg"
                        alt="Event"
                        width={40}
                        height={40}
                      />{' '}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Idea to MVP Business incubation
                      </div>
                      <div className="text-xs text-gray-500">
                        IIM Lucknow Incubation Centre
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Events in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm">25 Jun - 28 Jun, 2024</div>
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
                      3D Printing Workshop
                    </div>
                    <div className="text-xs text-gray-500">
                      SOA FAB LAB, Bhubaneswar
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm">25 Jun - 28 Jun, 2024</div>
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
                    <div className="text-sm font-medium">Robotics Workshop</div>
                    <div className="text-xs text-gray-500">
                      SOA FAB LAB, Bhubaneswar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
