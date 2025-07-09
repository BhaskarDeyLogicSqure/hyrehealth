"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statesConfig } from "@/configs/statesConfig";
import { countriesConfig } from "@/configs/countriesConfig";
import { GlobalAddress, GlobalAddressValidationErrors } from "@/types";

interface StateConfig {
  name: string;
  code: string;
  subdivision?: string;
}

interface CountryConfig {
  value: string;
  label: string;
}

interface AddressFormProps {
  value: GlobalAddress;
  onChange: (address: GlobalAddress) => void;
  onValidationChange?: (isValid: boolean) => void;
  required?: boolean;
  showValidation?: boolean;
}

export function AddressForm({
  value,
  onChange,
  onValidationChange,
  required = false,
  showValidation = false,
}: AddressFormProps) {
  const [validationErrors, setValidationErrors] =
    useState<GlobalAddressValidationErrors>({});

  // Add useEffect to validate when showValidation changes
  useEffect(() => {
    if (showValidation) {
      validateAddress(value);
    }
  }, [showValidation]);

  const validateAddress = (data: GlobalAddress): boolean => {
    const errors: GlobalAddressValidationErrors = {};

    // Address Line 1 validation
    if (required && !data.addressLine1.trim()) {
      errors.addressLine1 = "Address is required";
    } else if (data.addressLine1.trim()) {
      if (data.addressLine1.length > 100) {
        errors.addressLine1 = "Address cannot exceed 100 characters";
      } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(data.addressLine1)) {
        errors.addressLine1 =
          "Address can only contain letters, numbers, spaces, and basic punctuation";
      }
    }

    // City validation
    if (required && !data.city.trim()) {
      errors.city = "City is required";
    } else if (data.city.trim() && !/^[a-zA-Z\s.-]+$/.test(data.city)) {
      errors.city = "City can only contain letters, spaces, dots, and hyphens";
    }

    // State validation
    if (required && !data.state) {
      errors.state = "State is required";
    }

    // ZIP code validation
    if (required && !data.zip.trim()) {
      errors.zip = "ZIP code is required";
    } else if (data.zip.trim()) {
      // US ZIP code format (exactly 5 digits)
      if (!/^\d{5}$/.test(data.zip)) {
        errors.zip = "US ZIP code must be exactly 5 digits";
      }
    }

    // Country validation
    if (required && !data.country) {
      errors.country = "Country is required";
    }

    // Optional validations for filled fields
    if (data.addressLine2.trim() && data.addressLine2.length > 100) {
      errors.addressLine2 = "Address line 2 cannot exceed 100 characters";
    } else if (
      data.addressLine2.trim() &&
      !/^[a-zA-Z0-9\s,.-]+$/.test(data.addressLine2)
    ) {
      errors.addressLine2 =
        "Address can only contain letters, numbers, spaces, and basic punctuation";
    }

    setValidationErrors(showValidation ? errors : {});
    const isValid = Object.keys(errors).length === 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  const formatAddress = (data: GlobalAddress): string => {
    const parts = [
      data.addressLine1,
      data.addressLine2,
      data.city,
      data.state,
      data.zip,
      data.country,
    ].filter((part) => part.trim());

    return parts.join(", ");
  };

  const handleChange = (
    field: keyof Omit<GlobalAddress, "formattedAddress">,
    newValue: string
  ) => {
    const newData = {
      ...value,
      [field]: newValue,
    };

    // Validate and update
    validateAddress(newData);
    onChange(newData);
  };

  // Initial validation
  useEffect(() => {
    validateAddress(value);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress(value)) {
      onChange(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="addressLine1">
          Address Line 1 {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="addressLine1"
          value={value.addressLine1}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
          className={
            showValidation && validationErrors.addressLine1
              ? "border-red-500"
              : ""
          }
        />
        {showValidation && validationErrors.addressLine1 && (
          <p className="text-red-600 text-sm">
            {validationErrors.addressLine1}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input
          id="addressLine2"
          value={value.addressLine2}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          className={
            showValidation && validationErrors.addressLine2
              ? "border-red-500"
              : ""
          }
        />
        {showValidation && validationErrors.addressLine2 && (
          <p className="text-red-600 text-sm">
            {validationErrors.addressLine2}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            City {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className={
              showValidation && validationErrors.city ? "border-red-500" : ""
            }
          />
          {showValidation && validationErrors.city && (
            <p className="text-red-600 text-sm">{validationErrors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            Country {required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={value.country}
            onValueChange={(newValue) => handleChange("country", newValue)}
          >
            <SelectTrigger
              id="country"
              className={
                showValidation && validationErrors.country
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countriesConfig.map((country: CountryConfig) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showValidation && validationErrors.country && (
            <p className="text-red-600 text-sm">{validationErrors.country}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip">
            ZIP Code {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="zip"
            value={value.zip}
            onChange={(e) => handleChange("zip", e.target.value)}
            className={
              showValidation && validationErrors.zip ? "border-red-500" : ""
            }
          />
          {showValidation && validationErrors.zip && (
            <p className="text-red-600 text-sm">{validationErrors.zip}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">
            State {required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={value.state}
            onValueChange={(newValue) => handleChange("state", newValue)}
          >
            <SelectTrigger
              id="state"
              className={
                showValidation && validationErrors.state ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {value.country === "USA" ? (
                statesConfig.US.map((state: StateConfig) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No states available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {showValidation && validationErrors.state && (
            <p className="text-red-600 text-sm">{validationErrors.state}</p>
          )}
        </div>
      </div>
    </form>
  );
}
