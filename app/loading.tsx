import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white">
      <Loader2 className="h-12 w-12 animate-spin text-black" />
      <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
    </div>
  );
}
