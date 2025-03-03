import TopBar from '@/components/top-bar';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Suspense } from 'react';
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <div className="min-h-screen min-w-screen bg-white mx-auto">
        <TopBar theme="light" isBg />
        <div className="relative h-screen">
          <Image
            src="/assetlist.png"
            alt="Background"
            fill
            className="z-0 object-cover opacity-80"
          />
          <div className="relative z-10 max-w-3xl h-screen flex justify-center items-center pt-20 mx-auto text-center">
            {children}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/50 backdrop-blur-lg dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/50 backdrop-blur-lg dark:from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 backdrop-blur-lg dark:from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 backdrop-blur-lg dark:from-background"></div>
      </div>
    </Suspense>
  );
}
