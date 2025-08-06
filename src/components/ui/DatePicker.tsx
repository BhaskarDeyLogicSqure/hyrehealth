"use client";

import * as React from "react";
import { formatDate } from "@/lib/dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { US_SHORT_DATE_FORMAT } from "@/configs";
// Custom validation types
export interface DateValidation {
  // Specific dates to disable
  disabledDates?: Date[];
  // Date ranges to disable
  disabledRanges?: Array<{ from: Date; to: Date }>;
  // Days of week to disable (0 = Sunday, 1 = Monday, etc.)
  disabledDaysOfWeek?: number[];
  // Custom function for complex validation
  customValidator?: (date: Date) => boolean;
  // Disable past dates
  disablePast?: boolean;
  // Disable future dates
  disableFuture?: boolean;
  // Disable weekends
  disableWeekends?: boolean;
  // Disable weekdays
  disableWeekdays?: boolean;
}

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  yearRange?: { start: number; end: number };
  showClearButton?: boolean;
  clearButtonText?: string;
  format?: string;
  error?: boolean;
  errorMessage?: string;
  // New custom validation prop
  dateValidation?: DateValidation;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  label,
  required = false,
  minDate,
  maxDate,
  yearRange = { start: 1900, end: new Date().getFullYear() + 10 },
  showClearButton = false,
  clearButtonText = "Clear",
  format = US_SHORT_DATE_FORMAT,
  error = false,
  errorMessage,
  dateValidation,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Create disabled function for calendar
  const getDisabledDates = React.useCallback(
    (date: Date) => {
      if (!dateValidation) return false;

      const {
        disabledDates,
        disabledRanges,
        disabledDaysOfWeek,
        customValidator,
        disablePast,
        disableFuture,
        disableWeekends,
        disableWeekdays,
      } = dateValidation;

      // Check specific disabled dates
      if (
        disabledDates?.some(
          (disabledDate) =>
            date?.toDateString() === disabledDate?.toDateString()
        )
      ) {
        return true;
      }

      // Check disabled ranges
      if (
        disabledRanges?.some(
          (range) => date >= range?.from && date <= range?.to
        )
      ) {
        return true;
      }

      // Check disabled days of week
      if (disabledDaysOfWeek?.includes(date.getDay())) {
        return true;
      }

      // Check past dates
      if (disablePast && date < new Date(new Date()?.setHours(0, 0, 0, 0))) {
        return true;
      }

      // Check future dates
      if (
        disableFuture &&
        date > new Date(new Date().setHours(23, 59, 59, 999))
      ) {
        return true;
      }

      // Check weekends
      if (disableWeekends && (date?.getDay() === 0 || date?.getDay() === 6)) {
        return true;
      }

      // Check weekdays
      if (disableWeekdays && date?.getDay() >= 1 && date?.getDay() <= 5) {
        return true;
      }

      // Custom validator
      if (customValidator && !customValidator(date)) {
        return true;
      }

      return false;
    },
    [dateValidation]
  );

  const _handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    if (selectedDate) {
      setIsOpen(false);
    }
  };

  const _handleClear = () => {
    onDateChange?.(undefined);
  };

  return (
    <div className="w-full">
      {label && (
        <Label className="mb-2 block">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </Label>
      )}

      <div className="flex gap-2 items-center">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                error && "border-red-500 focus:ring-red-500",
                className
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date, format) : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={_handleDateSelect}
              disabled={disabled || getDisabledDates}
              initialFocus
              fromDate={minDate}
              toDate={maxDate}
              captionLayout="dropdown"
              fromYear={yearRange.start}
              toYear={yearRange.end}
            />
          </PopoverContent>
        </Popover>

        {showClearButton && date && (
          <Button
            variant="outline"
            size="sm"
            onClick={_handleClear}
            disabled={disabled}
            className="shrink-0"
          >
            {clearButtonText}
          </Button>
        )}
      </div>

      {error && errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

export default DatePicker;
