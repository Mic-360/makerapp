'use client';

import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Makerspace } from '@/lib/api';
import { BASE_URL, autoLoginUser } from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EventsPage from './(pages)/events';
import MachinesPage from './(pages)/machines';
import MySpacePage from './(pages)/my-space';
import RevenuePage from './(pages)/revenue';
import DashboardPage from './(pages)/dashboard';
import MembershipsPage from '@/app/dashboard/(pages)/membership';
import MessagesPage from './(pages)/messages';

export default function Page() {
  const [activePage, setActivePage] = useState('My Space');
  const [makerspace, setMakerspace] = useState<Makerspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState<
    'notifications' | 'profile' | null
  >(null);

  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuthenticationStore();

  useEffect(() => {
    const fetchMakerspace = async () => {
      try {
        const id = params.id as string;
        if (!id) {
          router.replace('/vendor-space');
          return;
        }

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

        if (!data) {
          router.replace('/vendor-space');
          return;
        }

        if ((!user || !token) && data.vendormail) {
          try {
            const loginResponse = await autoLoginUser(data.vendormail);
            if (loginResponse.user && loginResponse.token) {
              useAuthenticationStore
                .getState()
                .login(loginResponse.user, loginResponse.token);
            }
          } catch (error) {
            console.error('Auto-login failed:', error);
            router.replace('/vendor-space');
            return;
          }
        }

        setMakerspace(data);
      } catch (error) {
        console.error('Error fetching makerspace:', error);
        router.replace('/vendor-space');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMakerspace();
  }, [user, token, router, params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!makerspace) {
    return null;
  }

  const navItems = [
    '',
    'Dashboard',
    'Machines',
    'Events',
    'Memberships',
    'My Space',
    'Revenue',
    'Messages',
    '',
  ];

  const utilityItems = ['Help Desk', 'Settings', 'Log Out'];

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Machines':
        return (
          <MachinesPage makerspace={makerspace} setMakerspace={setMakerspace} />
        );
      case 'Events':
        return (
          <EventsPage makerspace={makerspace} setMakerspace={setMakerspace} />
        );
      case 'Memberships':
        return <MembershipsPage />;
      case 'My Space':
        return (
          <MySpacePage makerspace={makerspace} setMakerspace={setMakerspace} />
        );
      case 'Revenue':
        return <RevenuePage />;
      case 'Messages':
        return <MessagesPage />;
      default:
        return (
          <MySpacePage makerspace={makerspace} setMakerspace={setMakerspace} />
        );
    }
  };

  // const notifications = [
  //   {
  //     title: 'Simran Arora sent you a message.',
  //     time: '4 hrs ago',
  //   },
  //   {
  //     title: 'You have a new booking request',
  //     time: '4 hrs ago',
  //   },
  // ];

  // const menuItems = [
  //   { label: 'Dashboard', icon: LayoutDashboard },
  //   { label: 'All Bookings', icon: LayoutDashboard },
  //   { label: 'Profile', icon: User },
  //   { label: 'Account', icon: User },
  //   { label: 'Language', icon: Globe },
  //   { label: 'INR', icon: CreditCard },
  //   { label: 'Help Centre', icon: HelpCircle },
  //   { label: 'Settings', icon: Settings },
  // ];

  return (
    <div className="min-h-screen bg-white">
      <TopBar search={false} button={false} theme="light" />
      <main className="flex gap-x-2 p-4 items-start pt-20">
        <aside className="bg-blue-600 w-52 rounded-3xl py-4 pl-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-x-4 my-6">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={makerspace.logoImageLinks[0] || '/placeholder.svg'}
                  alt={makerspace.name}
                />
                <AvatarFallback>
                  {makerspace.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {makerspace.name}
                </h2>
                <p className="text-white">
                  {makerspace.rating}{' '}
                  <Star className="h-2.5 w-2.5 text-orange-500 fill-orange-500 inline-block" />
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-0 -my-4 relative">
            {navItems.map((item, index) => {
              const isActive = item === activePage;
              const isPrevious = index === navItems.indexOf(activePage) - 1;
              const isNext = index === navItems.indexOf(activePage) + 1;
              const isDisabled = index === 0 || index === navItems.length - 1;

              return (
                <div key={item} className="relative">
                  {isPrevious && (
                    <div className="absolute bottom-0 right-0 t-0 h-6 w-6 bg-white">
                      <div className="absolute bottom-0 right-0 h-6 w-6 bg-blue-600 rounded-br-3xl" />
                    </div>
                  )}
                  {isNext && (
                    <div className="absolute top-0 right-0 h-6 w-6 bg-white">
                      <div className="absolute top-0 right-0 h-6 w-6 bg-blue-600 rounded-tr-3xl" />
                    </div>
                  )}
                  <p
                    onClick={() => !isDisabled && setActivePage(item)}
                    className={`block p-4 text-md font-medium transition-colors relative ${
                      isActive
                        ? 'bg-white rounded-l-3xl text-black'
                        : isDisabled
                          ? ''
                          : 'hover:bg-white/50 rounded-l-3xl text-white'
                    } ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {item}
                  </p>
                </div>
              );
            })}
          </nav>

          <div className="mt-16 px-2">
            <Separator />
            <div className="space-y-1">
              {utilityItems.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block py-2 px-4 text-sm rounded-l-3xl hover:bg-white/50 transition-colors text-white font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="w-4/5 max-w-6xl mx-auto">
          <div className="h-full scrollbar-hide overflow-y-scroll px-8">
            {renderPage()}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
