'use client';
import { Clock } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

interface TimePickerProps {
  className?: string;
  control: any;
  name: string;
  label?: string;
}

export function TimePicker({
  className,
  control,
  name,
  label = 'Time'
}: TimePickerProps) {
  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return { value: hour.toString().padStart(2, '0'), label: hour.toString() };
  });

  // Generate minutes (00-55 in 5-minute increments)
  const minutes = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5;
    return {
      value: minute.toString().padStart(2, '0'),
      label: minute.toString().padStart(2, '0')
    };
  });

  // AM/PM options
  const periods = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Parse the time value (if it exists)
        const timeValue = field.value
          ? new Date(`2000-01-01T${field.value}`)
          : null;

        // Extract hours, minutes, and period from the time value
        const hour = timeValue
          ? (timeValue.getHours() > 12
              ? timeValue.getHours() - 12
              : timeValue.getHours() === 0
              ? 12
              : timeValue.getHours()
            )
              .toString()
              .padStart(2, '0')
          : '12';

        const minute = timeValue
          ? timeValue.getMinutes().toString().padStart(2, '0')
          : '00';

        const period = timeValue
          ? timeValue.getHours() >= 12
            ? 'PM'
            : 'AM'
          : 'AM';

        // Handle time changes
        const handleTimeChange = (
          type: 'hour' | 'minute' | 'period',
          value: string
        ) => {
          let newHour =
            type === 'hour' ? Number.parseInt(value) : Number.parseInt(hour);
          const newMinute =
            type === 'minute'
              ? Number.parseInt(value)
              : Number.parseInt(minute);
          const newPeriod = type === 'period' ? value : period;

          // Convert hour to 24-hour format for the field value
          if (newPeriod === 'PM' && newHour < 12) {
            newHour += 12;
          } else if (newPeriod === 'AM' && newHour === 12) {
            newHour = 0;
          }

          // Format the time string (HH:MM)
          const timeString = `${newHour.toString().padStart(2, '0')}:${newMinute
            .toString()
            .padStart(2, '0')}`;
          field.onChange(timeString);
        };

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-1">
                {/* Hour Select */}
                <Select
                  value={hour}
                  onValueChange={(value) => handleTimeChange('hour', value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-muted-foreground">:</span>

                {/* Minute Select */}
                <Select
                  value={minute}
                  onValueChange={(value) => handleTimeChange('minute', value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute.value} value={minute.value}>
                        {minute.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* AM/PM Select */}
                <Select
                  value={period}
                  onValueChange={(value) => handleTimeChange('period', value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
