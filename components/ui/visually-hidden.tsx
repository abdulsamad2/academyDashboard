'use client';

import * as React from 'react';
import { Slot } from '@/components/ui/slot';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const hiddenStyles = {
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      margin: '-1px',
    };
    
    if (asChild && React.isValidElement(children)) {
      return (
        <Slot
          ref={ref}
          className="absolute h-[1px] w-[1px] overflow-hidden whitespace-nowrap p-0 border-0"
          style={hiddenStyles}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <span
        ref={ref}
        className="absolute h-[1px] w-[1px] overflow-hidden whitespace-nowrap p-0 border-0"
        style={hiddenStyles}
        {...props}
      >
        {children}
      </span>
    );
  }
);
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden }; 