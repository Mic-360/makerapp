'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { fetchMachinesByMakerspaces, fetchMakerspaces } from '@/lib/api';
import { cities } from '@/lib/constants';
import {
  useAuthenticationStore,
  useCityDataStore,
  useCityStore,
} from '@/lib/store';
import {
  ChevronDown,
  Languages,
  LogOut,
  MapPin,
  Menu,
  Search,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TopBar({
  theme = 'dark',
  isBg = false,
  button = true,
  search = true,
}: {
  theme?: 'dark' | 'light';
  isBg?: boolean;
  button?: boolean;
  search?: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { selectedCity, setSelectedCity } = useCityStore();
  const { setMachines, setEvents } = useCityDataStore();
  const { user, token, logout, activeMakerspaceId } = useAuthenticationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const isDark = isScrolled ? false : theme === 'dark';
  const router = useRouter();

  const handleCitySelect = async (city: string) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
    if (city === 'Location') return;

    try {
      // First fetch makerspaces for the selected city
      const makerspaces = await fetchMakerspaces(city);

      // Then fetch both machines and events for those makerspaces
      const machines = await fetchMachinesByMakerspaces(makerspaces);
      setMachines(machines);

      if (window.location.pathname === '/home') {
        router.refresh();
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error('Failed to fetch city data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/home');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const MobileMenu = () => (
    <div
      className={`absolute top-full right-4 w-56 bg-white shadow-lg rounded-xl ${
        isDark ? 'text-black' : 'text-black'
      }`}
    >
      <div className="p-4 space-y-4">
        <Link href="/vendor-space" className="block">
          <Button
            variant="outline"
            className="w-full py-2 px-4 rounded-xl font-semibold border border-gray-300"
          >
            List your Machines
          </Button>
        </Link>
        <div className="flex items-center justify-between px-3">
          {user ? (
            <>
              <div className="flex gap-x-2 items-center">
                <Link href="/profile" className="font-medium text-md">
                  {user.name.split(' ')[0]}
                </Link>
                {user.image && (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={30}
                    height={30}
                    className="rounded-full border-2 border-black"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="ml-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="block text-center py-2 font-medium"
            >
              Login | Sign Up
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`${
        isScrolled || isBg ? 'bg-white' : 'bg-transparent'
      } fixed z-50 top-0 left-0 w-full p-4 lg:px-8 transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <Link href="/home" className="font-bold -mt-3">
            {isDark ? (
              <Image src="/logo-light.svg" alt="Logo" width={160} height={80} />
            ) : (
              <Image src="/logo-dark.svg" alt="Logo" width={160} height={80} />
            )}
          </Link>
        </div>

        {search && (
          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="flex items-center bg-white rounded-xl border">
              <div
                className="relative p-3 cursor-pointer flex items-center text-black rounded-xl shrink-0"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-4 h-4 ml-1" />

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-48 mt-2 bg-white rounded-xl shadow-lg border">
                    {cities.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="h-6 w-px bg-gray-300 mx-2" />
              <div className="flex items-center flex-1 min-w-0">
                <Search className="h-4 w-4 text-black shrink-0 mx-2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-black w-full min-w-0"
                />
                {searchTerm && (
                  <X
                    size={24}
                    className="text-black shrink-0 cursor-pointer mx-2"
                    onClick={() => setSearchTerm('')}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            {button && (
              <>
                <div className="flex items-center">
                  <Languages
                    className={`h-4 w-4 ${isDark ? 'text-white' : 'text-black'}`}
                  />
                  <span
                    className={`${isDark ? 'text-white' : 'text-black'} text-sm mx-1`}
                  >
                    EN
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`}
                  />
                </div>
                <Link href="/vendor-space">
                  <Button
                    variant="outline"
                    className={`p-4 rounded-lg font-semibold ${
                      isDark
                        ? 'text-white border-white hover:bg-white hover:text-black'
                        : 'text-black border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    List your Machines
                  </Button>
                </Link>
              </>
            )}
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href={
                  activeMakerspaceId
                    ? `/vendor-space/${activeMakerspaceId}/dashboard`
                    : '/vendor-space'
                }
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/user.png" alt="@maker" />
                  <AvatarFallback className="bg-green-400 text-sm">
                    {user.name.split(' ')[0].charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className={`${isDark ? 'text-white' : 'text-black'} hover:opacity-80`}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/auth/login"
                className={`${isDark ? 'text-white' : 'text-black'} font-medium`}
              >
                Login
              </Link>
              {' | '}
              <Link
                href="/auth/signup"
                className={`${isDark ? 'text-white' : 'text-black'} font-medium`}
              >
                Sign Up
              </Link>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu
              className={`h-6 w-6 ${isDark ? 'text-white' : 'text-black'}`}
            />
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="sm:hidden mt-4">
        <div className="flex items-center bg-white rounded-xl border">
          <div
            className="relative p-3 cursor-pointer flex items-center text-black rounded-xl shrink-0"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <MapPin className="w-4 h-4" />
            <ChevronDown className="w-4 h-4 ml-1" />
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50">
                {cities.map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <div className="flex items-center flex-1 min-w-0">
            <Search className="h-4 w-4 text-black shrink-0 mx-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-black w-full min-w-0"
            />
            {searchTerm && (
              <X
                size={24}
                className="text-black shrink-0 cursor-pointer mx-2"
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && <MobileMenu />}
    </header>
  );
}
