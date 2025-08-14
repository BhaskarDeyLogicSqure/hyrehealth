import { REGEX_CONFIG } from "@/configs/regexConfig";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isValidDate as isValidDateWithDayjs } from "@/lib/dayjs";
import { DIGITS_AFTER_DECIMALS } from "@/configs";

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

export const formatCurrency = (amount: number) => {
  return amount != null
    ? amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "$0.00";
};

export const extractQueryParams = (): Record<string, string> => {
  const {
    location: { search: queryParamString },
  } = window;
  const params: Record<string, string> = {};
  if (queryParamString.length > 1 && queryParamString.indexOf("?") > -1) {
    let queryStr = queryParamString.replace("?", "");
    queryStr = decodeURIComponent(queryStr);
    if (queryStr?.indexOf("&") === -1) {
      // Contains only one param
      const paramParts = queryStr?.split("=");
      params[paramParts[0]] = paramParts[1];
    } else {
      // Contains multiple params
      const queryParams = queryStr?.split("&");
      queryParams?.forEach((queryParam) => {
        const paramParts = queryParam?.split("=");
        params[paramParts[0]] = paramParts[1];
      });
    }
  }
  return params;
};

export const removeHtmlTags = (text: string) => {
  if (!text) return "";
  return text.replace(/<[^>]*>?/g, "");
};

export const removeHtmlTagsAndTrim = (text: string) => {
  if (!text) return "";
  return removeHtmlTags(text)?.trim();
};

export const getCurrentDomain = (headersList: Headers) => {
  // Get origin from headers
  const origin =
    headersList?.get("x-forwarded-proto") && headersList?.get("host")
      ? `${headersList?.get("x-forwarded-proto")}://${headersList?.get("host")}`
      : headersList?.get("referer")
      ? new URL(headersList?.get("referer")!).origin
      : "";
  return origin;
};

export const formatPriceInDollars = (price: number) => {
  return `$${price?.toFixed(DIGITS_AFTER_DECIMALS)}`;
};
