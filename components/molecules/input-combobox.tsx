"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TSelectOption } from "@/types/types";

interface InputComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  isDisabled?: boolean;
  required?: boolean;
  options: TSelectOption[];
}

export function InputCombobox<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isDisabled,
  required = true,
  options,
}: InputComboboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="flex items-center gap-1">
            <FormLabel>{label}</FormLabel>
            {required && <p className="text-red-500">*</p>}
          </div>
          <Popover>
            <PopoverTrigger asChild disabled={isDisabled} className="w-full">
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between w-full",
                    !field.value && "text-muted-foreground"
                  )}>
                  {field.value
                    ? options.find((opt) => opt.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full">
              <Command className="w-full">
                <CommandInput
                  placeholder={placeholder}
                  className="w-full h-9"
                />
                <CommandList className="w-full">
                  <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => {
                          field.onChange(opt.value);
                        }}>
                        {opt.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            opt.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
