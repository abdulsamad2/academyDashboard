import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface InputformFieldProps {
  loading: boolean;
  label: string;
  placeholder: string;
  type: string;
  name: string;
  className?: string;
  control: any;
}

const InputformField: React.FC<InputformFieldProps> = ({
  loading,
  label,
  placeholder,
  type,
  name,
  className,
  control
}) => {
  // Function to format date value for display in input
  const formatDateForInput = (value: any): string => {
    if (!value) return '';
    
    // If it's not a date input, return the value as is
    if (type !== 'date') return value;

    try {
      // Handle both Date objects and ISO strings
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return ''; // Invalid date
      
      // Format as YYYY-MM-DD for input display
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Function to parse date string to Date object
  const parseDateValue = (dateStr: string): Date | '' => {
    if (!dateStr) return '';
    
    try {
      // Create date at noon UTC to avoid timezone issues
      const date = new Date(dateStr + 'T12:00:00Z');
      return isNaN(date.getTime()) ? '' : date;
    } catch {
      return '';
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              disabled={loading}
              placeholder={placeholder}
              type={type}
              {...field}
              value={formatDateForInput(field.value)}
              onChange={(e) => {
                if (type === 'date') {
                  // For date inputs, convert to Date object before updating form
                  const dateValue = parseDateValue(e.target.value);
                  field.onChange(dateValue);
                } else {
                  // For non-date inputs, use the value as is
                  field.onChange(e.target.value);
                }
              }}
              // Ensure proper date formatting on blur
              onBlur={(e) => {
                if (type === 'date' && e.target.value) {
                  const dateValue = parseDateValue(e.target.value);
                  field.onChange(dateValue);
                }
                field.onBlur();
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputformField;