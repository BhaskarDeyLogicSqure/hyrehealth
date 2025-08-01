import { REGEX_CONFIG } from "@/configs/regexConfig";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isValidDate as isValidDateWithDayjs } from "@/lib/dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidEmail = (email: string) => {
  return REGEX_CONFIG?.email?.test(email);
};

export const isValidPhone = (phone: string) => {
  return REGEX_CONFIG?.phone?.test(phone);
};

export const isValidDate = (date: string) => {
  return isValidDateWithDayjs(date);
};

export const isValidPassword = (password: string) => {
  return REGEX_CONFIG?.password?.test(password);
};

// prevent non-numeric characters in zipCode
export const preventNonNumericInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
};

export const getFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
  }
};
