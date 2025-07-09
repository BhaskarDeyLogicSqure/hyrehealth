"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { useThemeContext } from "@/contexts/ThemeContext";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { primaryColor } = useThemeContext();

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        " h-[15px] w-[15px]  rounded-[4px] border    overflow-hidden  disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={
        {
          borderColor: primaryColor,
          "--tw-ring-color": primaryColor,
        } as React.CSSProperties
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center rounded-[4px] justify-center text-current"
        )}
        style={{
          backgroundColor: primaryColor,
          color: "white",
        }}
      >
        <Check className="h-[15px] w-[15px] rounded-[4px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
