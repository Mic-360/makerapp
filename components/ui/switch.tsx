'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
  statusLabels?: {
    checked: string;
    unchecked: string;
  };
  showStatus?: boolean;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      label,
      statusLabels = { checked: 'Open', unchecked: 'Closed' },
      showStatus = false,
      ...props
    },
    ref
  ) => (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-sm text-gray-500 mb-1">{label}</span>}
      <SwitchPrimitives.Root
        ref={ref}
        className={cn(
          'relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border border-gray-200 bg-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block h-6 w-6 rounded-full bg-green-500 shadow-md transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-[32px] data-[state=unchecked]:translate-x-1 data-[state=unchecked]:bg-red-500'
          )}
        />
      </SwitchPrimitives.Root>
      {showStatus && (
        <span className="text-xs mt-1">
          Status:{' '}
          <span
            className={cn(
              'font-medium',
              props.checked ? 'text-green-500' : 'text-red-500'
            )}
          >
            {props.checked ? statusLabels.checked : statusLabels.unchecked}
          </span>
        </span>
      )}
    </div>
  )
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
