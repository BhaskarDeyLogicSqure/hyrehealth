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
