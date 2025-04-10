"use client"

import { cn } from "@/lib/utils"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface SelectFormFieldProps {
  name: string
  label: string
  options: ReadonlyArray<{ value: string; label: string }>;
  control:any
  placeholder?: string
  className?: string
  loading?: boolean
  form?: any
}

const SelectFormField: React.FC<SelectFormFieldProps> = ({
  name,
  label,
  options,
  control,
  placeholder,
  className,
  loading = false,
  form :any,
}) => {

  return (
    <FormField
    //@ts-ignore
    className={cn(className)}
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
            <SelectValue placeholder={placeholder ?`${placeholder}`:'Select...' } />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            
          </SelectContent>
        </Select>
       
        <FormMessage />
      </FormItem>
    )}
  />
  )
}

export default SelectFormField