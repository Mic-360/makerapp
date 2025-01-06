'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, MapPin, Languages, X, Menu } from 'lucide-react';
import Image from 'next/image';
import { useCityStore } from '@/lib/store';
import { cities } from '@/lib/constants';
import { useSession } from "next-auth/react"

export default function TopBar({
  theme = 'dark',
  isBg = false,
  button = true,
}: {
  theme?: 'dark' | 'light';
  isBg?: boolean;
  button?: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { selectedCity, setSelectedCity } = useCityStore();
  const [searchTerm, setSearchTerm] = useState('');

  const isDark = theme === 'dark';

  const { data: session } = useSession()

  console.log(session)

  const MobileMenu = () => (
    <div
      className={`absolute top-full right-4 w-1/3 bg-white shadow-lg rounded-xl ${isDark ? 'text-black' : 'text-black'}`}
    >
      <div className="p-4 space-y-4">
        <Link href="/vendor-space" className="block">
          <button
            type="button"
            className={`w-full py-2 px-4 rounded-xl font-semibold ${isDark
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-white text-black hover:bg-gray-200'
              } border border-gray-300`}
          >
            List your Machines
          </button>
        </Link>
        <div className="flex items-center justify-between px-3">
          {
            session && session.user ? (
              <>
                <div className="flex gap-x-2 items-center justify-center">
                  <Link
                    href="/profile"
                    className={`${isDark ? 'text-white' : 'text-black'} font-medium text-md`}
                  >
                    {session.user.name}
                  </Link>
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={30}
                    height={30}
                    className={`rounded-full border-2 ${isDark ? 'border-gray-400' : 'border-black'}`}
                  />
                </div>
                </>
            ) : (
              <Link href="/auth" className="block text-center py-2 font-medium">
                Login | Sign Up
              </Link>)
          }
          {/* <Link href="/auth" className="block text-center py-2 font-medium">
            Login | Sign Up
          </Link> */}
          <Link href="/auth" className="flex items-center justify-center">
            <Languages className="h-4 w-4" />
            <span className="text-sm">EN</span>
            <ChevronDown className="w-4 h-4 cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`${isBg ? 'bg-white' : 'bg-transparent'} absolute z-50 top-0 left-0 w-full mx-auto p-4 lg:px-10 xl:px-24 ${isDark ? 'text-white' : 'text-black'}`}
    >
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/home" className="font-bold -mt-3">
            <svg
              width="116"
              height="35"
              viewBox="0 0 116 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.3979 25.2321C26.3979 23.9815 26.352 23.5646 26.0767 23.058C25.731 22.4332 25.2487 22.2243 23.9618 22.2243H18.7225V19.5752H24.2196C26.5629 19.5752 27.4143 19.9024 28.1495 21.0338C28.793 22.0193 29 23.058 29 25.3504V34.0752H22.9737C20.6987 34.0752 20.0777 33.9264 19.3425 33.2119C18.5614 32.4373 18.125 31.1866 18.125 29.7281C18.125 27.8822 18.7909 26.3339 19.8717 25.7091C20.3999 25.3819 21.227 25.2331 22.5138 25.2331L26.3979 25.2321ZM22.7443 27.8812C22.0549 27.8812 21.802 27.9107 21.5257 28.0596C21.0668 28.2981 20.7905 28.8933 20.7905 29.6975C20.7905 30.9481 21.3422 31.4241 22.7433 31.4241H26.3969V27.8812H22.7443Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M49.8194 25.0943L54.805 19.2523H58L52.8249 25.0943H53.8748C56.4506 25.0943 57.3322 26.4329 57.3322 30.3884V34.0749H54.6378V30.6362C54.6378 28.1714 54.1848 27.6849 52.0143 27.6849H49.8194V34.0749H47.125V13.7749H49.8194V25.0943Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M64.3613 19.2523H67.3651C71.2158 19.2523 72.5001 20.7732 72.5001 25.3068V34.0699H69.7628V25.5496C69.7628 22.6588 69.2298 21.9588 67.0502 21.9588H64.3613V34.0749H61.6251V13.7749H64.3613V19.2523Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M84.2315 25.2309C84.2315 23.9806 84.1825 23.5638 83.8887 23.0573C83.5209 22.4326 83.0051 22.2237 81.6318 22.2237H76.0407V19.5752H81.8986C84.3992 19.5752 85.3078 19.9023 86.0924 21.0335C86.779 22.0188 86.9999 23.0573 86.9999 25.3492V34.0752H80.5742C78.1465 34.0752 77.4849 33.9264 76.6992 33.2121C75.8657 32.4376 75.3999 31.1872 75.3999 29.7289C75.3999 27.8834 76.1116 26.3355 77.264 25.7108C77.8277 25.3837 78.7102 25.2349 80.0845 25.2349L84.2315 25.2309ZM80.3356 27.8795C79.6 27.8795 79.3302 27.909 79.0353 28.0588C78.5456 28.2963 78.2507 28.8914 78.2507 29.6954C78.2507 30.9458 78.8394 31.4217 80.3346 31.4217H84.2336V27.8746L80.3356 27.8795Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M96.2124 19.5752C98.0976 19.5752 99.052 19.992 99.8206 21.0926C100.472 22.0158 100.775 23.3854 100.775 25.3196V34.0752H98.1441V25.2644C98.1441 23.0613 97.5387 22.2277 95.9325 22.2277H93.256V34.0752H90.625V19.5752H96.2124Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M113.228 25.2309C113.228 23.9806 113.179 23.5638 112.886 23.0573C112.518 22.4326 112.003 22.2237 110.63 22.2237H105.038V19.5752H110.899C113.399 19.5752 114.308 19.9023 115.093 21.0335C115.779 22.0188 116 23.0573 116 25.3492V34.0752H109.575C107.147 34.0752 106.485 33.9264 105.7 33.2121C104.867 32.4376 104.4 31.1872 104.4 29.7289C104.4 27.8834 105.112 26.3355 106.264 25.7108C106.828 25.3837 107.711 25.2349 109.085 25.2349L113.228 25.2309ZM109.33 27.8795C108.594 27.8795 108.324 27.909 108.03 28.0588C107.539 28.2963 107.245 28.8914 107.245 29.6954C107.245 30.9458 107.833 31.4217 109.328 31.4217H113.228V27.8746L109.33 27.8795Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M37.971 19.5752C40.3416 19.5752 41.4522 19.8234 42.3591 20.5957C43.2074 21.3128 43.5 22.2782 43.5 24.3192V25.6431H40.3416V24.595C40.3416 22.6643 39.7555 22.0851 37.7955 22.0851H36.6556V34.0752H33.35V19.5752H37.971Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M5.07504 25.7952L7.19309 23.7744L7.39558 21.5687L9.1289 19.7773L11.8625 19.5752L9.66854 21.5849L11.7198 23.6532L13.6343 21.5526L13.775 24.1402L11.7501 26.0691L9.54097 25.9771L5.12364 30.4502L5.07504 25.7952Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M13.7609 31.797C12.3529 30.3816 10.9456 28.9659 9.53898 27.5498L7.25 29.8991L11.366 34.0748L13.7749 34.0669C13.7759 33.3109 13.7659 32.5529 13.7609 31.797ZM12.2369 33.2851C12.1064 33.2851 11.9788 33.2467 11.8703 33.1747C11.7617 33.1028 11.6771 33.0005 11.6272 32.8809C11.5772 32.7613 11.5642 32.6296 11.5896 32.5026C11.6151 32.3756 11.678 32.2589 11.7703 32.1673C11.8626 32.0757 11.9802 32.0134 12.1082 31.9881C12.2362 31.9629 12.3689 31.9758 12.4895 32.0254C12.6101 32.0749 12.7132 32.1589 12.7857 32.2665C12.8582 32.3742 12.8969 32.5008 12.8969 32.6303C12.8971 32.7164 12.8801 32.8016 12.847 32.8812C12.8139 32.9608 12.7653 33.0331 12.704 33.094C12.6427 33.1549 12.5699 33.2032 12.4897 33.2362C12.4096 33.2691 12.3237 33.2861 12.2369 33.2861V33.2851Z"
                fill={isDark ? 'white' : 'black'}
              />
              <path
                d="M0.0137643 0L4.35 4.48244V34.075H0C0.0255651 28.4029 0.039658 22.7304 0.04228 17.0576C0.0442466 11.3714 0.0347408 5.68554 0.0137643 0Z"
                fill={isDark ? 'white' : 'black'}
              />
            </svg>
          </Link>
        </div>

        <div className="flex-grow max-w-2xl mx-4 lg:mx-0 border rounded-xl">
          <div className="flex items-center bg-white rounded-xl">
            <div
              className="relative p-3 cursor-pointer flex items-center text-black rounded-xl"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span className="mr-8 text-sm hidden sm:inline">
                {selectedCity}
              </span>
              <ChevronDown className="w-4 h-4" />
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden">
                  {cities.map((loc) => (
                    <div
                      key={loc}
                      className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                      onClick={() => {
                        setSelectedCity(loc);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <button type="button">
              <Search className="h-4 w-4 text-black" />
              <span className="sr-only">Search</span>
            </button>
            <div className="h-6 w-px mx-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent border-none focus:outline-none cursor-text text-black w-full"
            />
            {searchTerm && (
              <X
                size={34}
                className="text-black font-light pr-2 cursor-pointer"
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
        </div>
        <button
          type="button"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className={`h-6 w-6 ${isDark ? 'text-white' : 'text-black'}`} />
        </button>
        <div className="hidden lg:flex items-center space-x-4">
          <div
            className={`flex items-center justify-center ${button ? 'block' : 'hidden'}`}
          >
            <Languages
              className={`h-4 w-4 ${isDark ? 'text-white' : 'text-black'}`}
            />
            <span className={`${isDark ? 'text-white' : 'text-black'} text-sm`}>
              EN
            </span>
            <ChevronDown
              className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'} cursor-pointer`}
            />
          </div>
          <Link
            href="/vendor-space"
            className={`${button ? 'block' : 'hidden'}`}
          >
            <button
              type="button"
              className={`py-2 px-4 rounded-xl font-semibold ${isDark
                  ? 'text-white border-white hover:bg-white hover:text-black'
                  : 'text-black border-black hover:bg-black hover:text-white'
                } border`}
            >
              List your Machines
            </button>
          </Link>
          {/* <div className="flex gap-x-2 items-center justify-center">
            <Link
              href="/auth"
              className={`${isDark ? 'text-white' : 'text-black'} font-medium text-md`}
            >
              Login | Sign Up
            </Link>
            <Image
              src="/favicon.ico"
              alt="Profile"
              width={30}
              height={30}
              className={`rounded-full border-2 ${isDark ? 'border-gray-400' : 'border-black'}`}
            />
          </div> */}
          {
            session && session.user ? (
              <>
                <div className="flex gap-x-2 items-center justify-center">
                  <Link
                    href="/profile"
                    className={`${isDark ? 'text-white' : 'text-black'} font-medium text-md`}
                  >
                    {session.user.name.split(' ')[0]}
                  </Link>
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={30}
                    height={30}
                    className={`rounded-full border-2 ${isDark ? 'border-gray-400' : 'border-black'}`}
                  />
                </div>
                </>
            ) : (
              <Link href="/auth" className="block text-center py-2 font-medium">
                Login | Sign Up
              </Link>)
          }
        </div>
      </div>
      {isMobileMenuOpen && <MobileMenu />}
    </header>
  );
}
