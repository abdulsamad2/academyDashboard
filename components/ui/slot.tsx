'use client';

import * as React from 'react';

// Simple type for the Slot component that works with React 19
type SlotProps = {
  children?: React.ReactNode;
  [key: string]: any;
};

/**
 * A component that projects its children's props onto its immediate child
 * Compatible with React 19's ref handling
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;
    
    if (!React.isValidElement(children)) {
      return null;
    }

    // Use type assertion to handle ref forwarding
    return React.cloneElement(children, {
      ...slotProps,
      // @ts-expect-error - This is needed to handle React 19's ref changes
      ref: forwardedRef
        ? (node: any) => {
            // Handle React 19's ref API properly
            if (forwardedRef) {
              if (typeof forwardedRef === 'function') {
                forwardedRef(node);
              } else {
                (forwardedRef as React.MutableRefObject<any>).current = node;
              }
            }
            
            // Also handle the child's ref if it has one
            const { ref } = children as any;
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
          }
        : undefined
    });
  }
);

Slot.displayName = 'Slot'; 