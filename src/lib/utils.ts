import { REGEX_CONFIG } from "@/configs/regexConfig";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  return REGEX_CONFIG?.isoDate?.test(date);
};
