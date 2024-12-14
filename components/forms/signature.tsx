'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
  name: string;
  control: any;
  label?: string;
  description?: string;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  name,
  control,
  label = 'Signature',
  description = 'Please sign in the box below',
  className
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    signatureRef.current?.clear();
    setIsEmpty(true);
  };

  const handleEnd = () => {
    setIsEmpty(signatureRef.current?.isEmpty() ?? true);
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('space-y-2', className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="rounded-md border p-2">
                <SignatureCanvas
                  ref={signatureRef}
                  onEnd={handleEnd}
                  canvasProps={{
                    className: 'w-full h-40'
                  }}
                  backgroundColor="rgb(255, 255, 255)"
                />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleClear}>
                  Clear
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const dataUrl = signatureRef.current?.toDataURL();
                    field.onChange(dataUrl);
                  }}
                  disabled={isEmpty}
                >
                  Save Signature
                </Button>
              </div>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
