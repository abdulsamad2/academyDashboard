// components/AdminRestrictedDateField.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface AdminRestrictedDateFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: any;
  isAdmin: boolean;
  loading?: boolean;
}

const AdminRestrictedDateField = ({
  name,
  label,
  placeholder,
  control,
  isAdmin,
  loading = false
}: AdminRestrictedDateFieldProps) => {
  // Get current month's constraints
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const now = new Date();

    if (isAdmin) {
      // Admin can go back up to 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      setMinDate(format(threeMonthsAgo, 'yyyy-MM-dd'));

      // Admin can schedule ahead for up to 6 months
      const sixMonthsAhead = new Date();
      sixMonthsAhead.setMonth(now.getMonth() + 6);
      setMaxDate(format(sixMonthsAhead, 'yyyy-MM-dd'));
    } else {
      // Regular users can only choose dates from the current month
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setMinDate(format(firstDayOfMonth, 'yyyy-MM-dd'));

      // Last day of current month
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setMaxDate(format(lastDayOfMonth, 'yyyy-MM-dd'));
    }
  }, [isAdmin]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}{' '}
            {!isAdmin && (
              <span className="text-xs text-muted-foreground">
                (Current month only)
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder={placeholder}
              disabled={loading}
              min={minDate}
              max={maxDate}
              {...field}
              // Convert Date object to string format for date input
              value={
                field.value instanceof Date
                  ? format(field.value, 'yyyy-MM-dd')
                  : field.value
              }
              // Handle date input change
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  // Parse the string date back to a Date object
                  const parsedDate = new Date(dateValue);
                  field.onChange(parsedDate);
                } else {
                  field.onChange(null);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AdminRestrictedDateField;
