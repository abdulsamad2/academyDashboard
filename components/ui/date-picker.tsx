'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  name: string;
  label?: string;
  description?: string;
  control: any;
  disabled?: boolean;
  /** Restrict to N months before today (admin override = unlimited) */
  fromDate?: Date;
  toDate?: Date;
  placeholder?: string;
}

export function DatePicker({
  name,
  label,
  description,
  control,
  disabled,
  fromDate,
  toDate,
  placeholder = 'Pick a date'
}: DatePickerProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value
          ? field.value instanceof Date
            ? field.value
            : new Date(field.value)
          : undefined;
        return (
          <FormItem className="flex flex-col">
            {label ? (
              <FormLabel className="text-sm font-medium text-foreground">
                {label}
              </FormLabel>
            ) : null}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      'h-10 w-full justify-start font-normal',
                      !value && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {value ? format(value, 'EEE, dd MMM yyyy') : placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(d) => field.onChange(d ?? null)}
                  fromDate={fromDate}
                  toDate={toDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
