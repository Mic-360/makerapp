'use client';

import Loading from '@/app/loading';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BASE_URL } from '@/lib/api';
import {
  CircleParking,
  Clock,
  Clock10,
  Link2,
  MapPin,
  MessageCircle,
  Monitor,
  Star,
  ThumbsUp,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const mockReviews = [
  {
    userName: 'John Doe',
    userImage: '/assetlist.png',
    comment:
      'Great facilities and helpful staff at the lab space! Highly recommend. Would come again. worth the price. Great facilities and helpful staff at the lab space! Highly recommend. Would come again. worth the price.',
    rating: 4.5,
    date: '2024-01-15',
  },
  {
    userName: 'Jane Smith',
    userImage: '/assetlist.png',
    comment: 'Excellent equipment and workspace. Would definitely come back!',
    rating: 5,
    date: '2024-01-10',
  },
  {
    userName: 'Mike Johnson',
    userImage: '/assetlist.png',
    comment: 'Professional environment, worth the price. Will return!',
    rating: 4,
    date: '2024-01-05',
  },
];

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const [makerspace, setMakerspace] = useState(null);

  useEffect(() => {
    const fetchMakerspace = async () => {
      try {
        const id = params.id as string;

        const response = await fetch(`${BASE_URL}/api/makerspaces/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch makerspace');
        }

        const data = await response.json();

        setMakerspace(data);
      } catch (error) {
        console.error('Error fetching makerspace:', error);
      }
    };

    fetchMakerspace();
  }, [params.id]);

  const renderAmenities = () => {
    return (
      <>
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-orange-500" />
          <span className="text-sm">WiFi</span>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-orange-500" />
          <span className="text-sm">Computers</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleParking className="h-4 w-4 text-orange-500" />
          <span className="text-sm">Free Parking</span>
        </div>
      </>
    );
  };

  const renderReviews = () => {
    return mockReviews.map((review, index) => (
      <div key={index} className="flex items-start gap-2 mb-4">
        <Image
          src={review.userImage}
          alt={review.userName}
          width={100}
          height={100}
          className="rounded-full object-cover h-20 w-20"
        />
        <div className="max-w-sm max-h-32 overflow-hidden">
          <h3 className="text-sm font-semibold">{review.userName}</h3>
          <div className="flex items-center gap-2">
            <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
            <span className="text-sm text-gray-600">{review.rating}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{review.date}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-ellipsis">
            {review.comment}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <Suspense fallback={<Loading />}>
      <TopBar theme="light" />
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mt-6">
            <Image
              src="/assetlist.png"
              alt="Bhaumik Singh"
              width={300}
              height={300}
              className="h-10 w-10 mr-2 rounded-full object-cover"
            />
            <h1 className="text-xl font-semibold">Bhaumik Singh</h1>
          </div>

          <div className="flex justify-end items-end gap-x-4">
            <div className="mb-8 w-10/12">
              <div className="flex items-center justify-end mb-1">
                <div className="flex items-center">
                  <span className="text-md font-medium mr-1">4.5</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 4 ? 'text-orange-500 fill-orange-500' : star === 5 ? 'text-orange-500 half-fill' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <div className="aspect-[4/3] bg-gray-100 rounded-2xl">
                    <Image
                      src="/assetlist.png"
                      alt="Bhaumik Singh"
                      width={1000}
                      height={300}
                      className="rounded-lg h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2 col-span-1">
                  {[1, 2].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-[4/3] bg-gray-100 rounded-2xl"
                    >
                      <Image
                        src="/assetlist.png"
                        alt={`Bhaumik Singh ${index + 2}`}
                        width={1000}
                        height={300}
                        className="rounded-lg h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-8 w-full md:w-2/12 space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-10 w-10 text-orange-500" />
                <p className="text-sm text-gray-600">
                  <span className="text-black font-semibold">
                    424, Rajendra Nagar Colony Hariharganj
                  </span>
                  , Fatehpur, Uttar Pradesh 212601
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Clock10 className="h-5 w-5 text-orange-500" />
                <p className="text-sm text-gray-600">
                  7:00-6:00 <br />
                  (Mon - Sat)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Link2 className="h-5 w-5 text-orange-500 -rotate-45" />
                <Link
                  href="Bhaumic.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Visit Website
                </Link>
              </div>
            </div>
          </div>
          <Tabs defaultValue="machines" className="mb-8">
            <TabsList className="border-b w-full max-w-screen-md justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="machines"
                className="rounded-none data-[state=active]:text-black data-[state=active]:font-semibold border-b-2 px-20 py-3 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100 w-1/2"
              >
                Machines
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="rounded-none data-[state=active]:text-black data-[state=active]:font-semibold border-b-2 px-20 py-3 border-transparent data-[state=active]:border-black data-[state=active]:bg-gray-100 w-1/2"
              >
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="machines">
              <div className="flex justify-between gap-x-10 my-4">
                <div className="w-full">
                  <ScrollArea className="whitespace-nowrap my-4">
                    <div className="flex gap-2">
                      <Badge
                        variant="default"
                        className="rounded-md px-6 py-2 text-sm cursor-pointer"
                      >
                        All
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-md px-6 py-2 text-sm cursor-pointer"
                      >
                        3D Printer
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-md px-6 py-2 text-sm cursor-pointer"
                      >
                        Laser Cutter
                      </Badge>
                    </div>
                  </ScrollArea>
                  <Separator />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="flex justify-between gap-x-10 my-4">
                <div className="w-full">
                  <ScrollArea className="whitespace-nowrap my-4">
                    <div className="flex gap-2">
                      <Badge
                        variant="default"
                        className="rounded-md px-6 py-2 text-sm cursor-pointer"
                      >
                        All
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-md px-6 py-2 text-sm cursor-pointer"
                      >
                        Workshop
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-md px-6 py-2 text-sm cursor-pointer"
                      >
                        Training
                      </Badge>
                    </div>
                  </ScrollArea>
                  <Separator />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="max-w-3xl">
            <hr className="mb-4" />
            <div className="mb-4 ml-4">
              <h2 className="text-lg font-medium mb-4">About Bhaumik Singh</h2>
              <p className="text-sm text-gray-600 mb-4 ml-4">
                A state-of-the-art makerspace facility at Iter University.
              </p>
            </div>

            <hr className="mb-4" />
            <div className="mb-4 ml-4">
              <h2 className="text-lg font-medium mb-4">
                What this space offers
              </h2>
              <div className="grid grid-cols-3 gap-y-4 ml-4">
                {renderAmenities()}
              </div>
            </div>
          </div>
          <hr className="mb-4" />
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4 ml-4 ">
              <Star className="h-4 w-4" />
              <h2 className="text-lg font-semibold">4.5</h2>
              <span className="text-sm font-bold">Ratings and Reviews</span>
            </div>

            <div className="grid grid-cols-4 gap-4 my-8 ml-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Location</span>
                <span className="text-sm text-gray-600">4.5</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Value for money</span>
                <span className="text-sm text-gray-600">4.2</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Lab Experience</span>
                <span className="text-sm text-gray-600">4.7</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Machine Quality</span>
                <span className="text-sm text-gray-600">4.4</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-y-4 ml-4 p-4">
              {renderReviews()}
            </div>
          </div>
          <hr className="mb-4" />
          <div className="mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact the Lab</h2>
                <h3 className="text-md font-medium mb-2 flex gap-x-1 items-center">
                  <MapPin className="h-4 w-4 inline-block text-orange-500" />
                  <span>Location</span>
                </h3>
                <p className="text-sm text-gray-600 ml-8">
                  424, Rajendra Nagar Colony Hariharganj, Fatehpur, Uttar
                  Pradesh 212601
                </p>

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
                <Button variant="link" className="text-lg">
                  Find on Map →
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Suspense>
  );
}
