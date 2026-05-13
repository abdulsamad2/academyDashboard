'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  name: string;
  label?: string;
  control: any;
  /** Increment in minutes, default 15 */
  step?: 5 | 10 | 15 | 30 | 60;
  /** Hours range (inclusive), default 6 → 22 */
  fromHour?: number;
  toHour?: number;
  placeholder?: string;
  disabled?: boolean;
}

function formatLabel(hh: number, mm: number) {
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  const period = hh < 12 ? 'AM' : 'PM';
  return `${String(h12).padStart(2, '0')}:${String(mm).padStart(
    2,
    '0'
  )} ${period}`;
}

export function TimePickerField({
  name,
  label,
  control,
  step = 15,
  fromHour = 6,
  toHour = 22,
  placeholder = 'Pick a time',
  disabled
}: TimePickerProps) {
  const slots = React.useMemo(() => {
    const out: { value: string; label: string }[] = [];
    for (let h = fromHour; h <= toHour; h++) {
      for (let m = 0; m < 60; m += step) {
        const value = `${String(h).padStart(2, '0')}:${String(m).padStart(
          2,
          '0'
        )}`;
        out.push({ value, label: formatLabel(h, m) });
      }
    }
    return out;
  }, [fromHour, toHour, step]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const current = field.value as string | undefined;
        const display = current
          ? formatLabel(
              Number(current.split(':')[0]),
              Number(current.split(':')[1])
            )
          : null;

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
                      !display && 'text-muted-foreground'
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {display ?? placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="start">
                <ScrollArea className="h-64">
                  <div className="p-1">
                    {slots.map((s) => {
                      const selected = s.value === current;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => field.onChange(s.value)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors',
                            selected
                              ? 'bg-primary/10 font-medium text-primary'
                              : 'text-foreground hover:bg-muted'
                          )}
                        >
                          <span>{s.label}</span>
                          {selected ? (
                            <span className="text-xs text-primary">●</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
