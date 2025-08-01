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
  format = "MM/DD/YYYY",
  error = false,
  errorMessage,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

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
              disabled={disabled}
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
