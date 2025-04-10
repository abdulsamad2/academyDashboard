'use client';

import * as React from 'react';
import { Slot as RadixSlot } from '@radix-ui/react-slot';

// This is a wrapper around Radix UI's Slot component that handles ref forwarding properly in React 19
export const Slot = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof RadixSlot>
>((props, ref) => {
  return <RadixSlot {...props} ref={ref} />;
});
Slot.displayName = 'Slot'; 