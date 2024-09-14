import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Textarea } from './ui/textarea';
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
  return (
    <FormField
      className={cn(className)}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              disabled={loading}
              placeholder={placeholder}
              {...field}
              type={type}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputformField;
