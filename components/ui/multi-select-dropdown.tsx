"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Option {
  value: string
  label: string
}

interface MultiSelectSearchDropdownProps {
  options: Option[]
  value?: string[] // Controlled value for form integration
  placeholder?: string
  emptyMessage?: string
  onChange: (selectedValues: string[]) => void
  name?: string // For form registration
}

export default function MultiSelectSearchDropdown({
  options,
  value = [], // Default to an empty array for controlled input
  placeholder = "Select items...",
  emptyMessage = "No results found.",
  onChange,
  name, // Name prop for form registration
}: MultiSelectSearchDropdownProps) {
  const [open, setOpen] = React.useState(false)
  
  // Map value (controlled) to the selected options from the options array
  const selected = options.filter(option => value.includes(option.value))

  const handleSelect = (option: Option) => {
    const isSelected = value.includes(option.value)
    const newSelected = isSelected
      ? value.filter((val) => val !== option.value)
      : [...value, option.value]

    onChange(newSelected) // Pass the updated selection to the parent component
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((item) => (
                <Badge variant="secondary" key={item.value}>
                  {item.label}
                </Badge>
              ))}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
