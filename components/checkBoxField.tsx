"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"


interface CheckBoxFieldProps {
    name: string;
    label: string;
    options: {
        id: | null | undefined, label: string; value: string 
}[];
    control: any;
    placeholder?: string;
    className?: string;
    loading?: boolean;
    form :any;
}

const CheckBoxField: React.FC<CheckBoxFieldProps> =({
    name,
    label,
    options,
    control,
    placeholder,
    className,
    loading = false,
    form :any,
})=> {
  

  return (
   
        <FormField
          control={control}
          name={name}
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{label}</FormLabel>
              </div>
              {options.map((item) => (
                <FormField
                  key={item.id}
                  control={control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                        <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value||[], item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      value => value !== item.id
                                    )
                                  )
                            }}
                          />
                
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </FormItem>
          )}
        />
      
  )
}
export default CheckBoxField;