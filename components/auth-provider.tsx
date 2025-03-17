'use client';

import { useEffect } from 'react';
import { useAuthenticationStore } from '@/lib/store';
import { usePathname, useRouter } from 'next/navigation';

const publicPaths = ['/auth/login', '/auth/signup', '/home', '/']; // Add other public paths
const protectedPaths = ['/home/onboarding']; // Add other protected paths
const authPaths = ['/auth']; // Auth paths that should be inaccessible when logged in

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, reauth, isLoading } = useAuthenticationStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Initial authentication check
    reauth();

    // Set up periodic reauth (e.g., every 15 minutes)
    const interval = setInterval(() => {
      if (token) {
        reauth();
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [reauth, token]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthPath = authPaths.some(path => pathname.startsWith(path));

    if (!token && isProtectedPath) {
      // Redirect to login if trying to access protected route without auth
      router.push('/auth/login');
    } else if (token && isAuthPath) {
      // Redirect to home if trying to access auth routes while logged in
      router.push('/home');
    }
  }, [token, pathname, router, isLoading]);

  if (isLoading) {
    // You can create a proper loading component
    return <div>Loading...</div>;
  }

  return children;
}