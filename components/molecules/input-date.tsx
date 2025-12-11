"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface InputDateProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isDisabled?: boolean;
  required?: boolean;
  dateStart?: Date;
  dateEnd?: Date;
  placeholder?: string;
}

export function InputDate<T extends FieldValues>({
  control,
  name,
  label,
  isDisabled,
  required = true,
  dateStart,
  dateEnd,
  placeholder = "Pilih tanggal",
}: InputDateProps<T>) {
  const formatDateForInput = (date: unknown): string => {
    if (!date) return "";

    try {
      let dateObj: Date;

      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === "string") {
        dateObj = new Date(date);
      } else if (typeof date === "number") {
        dateObj = new Date(date);
      } else {
        return "";
      }

      if (isNaN(dateObj.getTime())) {
        return "";
      }

      const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const localISOTime = new Date(dateObj.getTime() - timezoneOffset)
        .toISOString()
        .split("T")[0];
      return localISOTime;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const parseDateFromInput = (value: string): Date | null => {
    if (!value) return null;

    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  const getMinDate = (): string | undefined => {
    if (!dateStart) return undefined;
    return formatDateForInput(dateStart);
  };

  const getMaxDate = (): string | undefined => {
    if (!dateEnd) return undefined;
    return formatDateForInput(dateEnd);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-1">
            <FormLabel>{label}</FormLabel>
            {required && <p className="text-red-500">*</p>}
          </div>
          <FormControl>
            <Input
              type="date"
              {...field}
              className="w-full"
              disabled={isDisabled}
              value={formatDateForInput(field.value)}
              onChange={(e) => {
                const date = parseDateFromInput(e.target.value);
                field.onChange(date);
              }}
              onBlur={field.onBlur}
              min={getMinDate()}
              max={getMaxDate()}
              required={required}
              placeholder={placeholder}
            />
          </FormControl>

          {(dateStart || dateEnd) && (
            <p className="mt-1 text-muted-foreground text-xs">
              {dateStart && dateEnd
                ? `Tanggal tersedia: ${new Date(dateStart).toLocaleDateString(
                    "id-ID"
                  )} - ${new Date(dateEnd).toLocaleDateString("id-ID")}`
                : dateStart
                ? `Tanggal mulai dari: ${new Date(dateStart).toLocaleDateString(
                    "id-ID"
                  )}`
                : `Tanggal maksimal: ${new Date(dateEnd!).toLocaleDateString(
                    "id-ID"
                  )}`}
            </p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
