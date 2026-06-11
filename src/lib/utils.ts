import { REGEX_CONFIG } from "@/configs/regexConfig";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isValidDate as isValidDateWithDayjs } from "@/lib/dayjs";
import { DIGITS_AFTER_DECIMALS } from "@/configs";
import { Address } from "@/types";
import { Product } from "@/types/products";

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
  e: React.KeyboardEvent<HTMLInputElement>,
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

/**
 * Picks the price of a dosage (strength) at a preferred plan duration.
 * Falls back to the lowest/highest available duration for that strength when
 * the preferred duration is not offered.
 */
const _getDosagePriceAtDuration = (
  options: any[],
  strength: number,
  preferredDuration: number,
  fallback: "lowest" | "highest",
): number | undefined => {
  const forStrength = options
    ?.filter((option: any) => option?.strength === strength)
    ?.sort(
      (a: any, b: any) => (a?.duration?.value || 0) - (b?.duration?.value || 0),
    );

  if (!forStrength?.length) return undefined;

  const preferred = forStrength?.find(
    (option: any) => option?.duration?.value === preferredDuration,
  );
  if (preferred) return preferred?.price;

  return fallback === "lowest"
    ? forStrength?.[0]?.price
    : forStrength[forStrength?.length - 1]?.price;
};

/**
 * Computes the 1-month dosage price range from a product's subscription options.
 * - Multiple dosages: min = lowest dosage's 1-month price, max = highest
 *   dosage's 2-month price (falling back to its nearest available plan).
 * - Single dosage: just its 1-month price (min === max).
 * Returns null when there is no usable pricing data.
 */
export const getProductPriceRange = (
  product: Product,
): { min: number; max: number } | null => {
  const options = product?.pricing?.subscriptionOptions?.filter(
    (option: any) => option?.price > 0,
  );

  if (options?.length) {
    const strengths = Array.from(
      new Set(options?.map((option: any) => option?.strength || 0)),
    )?.sort((a, b) => a - b);

    const minStrength = strengths?.[0];
    const maxStrength = strengths[strengths?.length - 1];

    // Single dosage -> only its 1-month price.
    if (strengths?.length === 1) {
      const price = _getDosagePriceAtDuration(options, minStrength, 1, "lowest");
      if (price != null) return { min: price, max: price };
    } else {
      // Multiple dosages -> lowest dosage @ 1 month, highest dosage @ 2 month.
      const min = _getDosagePriceAtDuration(options, minStrength, 1, "lowest");
      const max = _getDosagePriceAtDuration(options, maxStrength, 2, "highest");
      if (min != null && max != null) return { min, max };
    }
  }

  // Fallback to the backend-provided lowest price when options are unavailable.
  const lowest = product?.pricing?.lowestPrice;
  return lowest ? { min: lowest, max: lowest } : null;
};

/**
 * Formats a monthly price range for display, e.g. "$180.00 - $320.00" or a
 * single "$180.00" when the min and max are equal.
 */
export const formatPriceRange = (
  range: {
    min: number;
    max: number;
  } | null,
) => {
  if (!range) return "-";
  return range.min === range.max
    ? formatPriceInDollars(range.min)
    : `${formatPriceInDollars(range.min)} - ${formatPriceInDollars(range.max)}`;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getFullName = (user: { firstName: string; lastName: string }) => {
  if (!user) return "";

  return `${user?.firstName} ${user?.lastName}`?.trim();
};

export const formatAddress = (address: Address) => {
  if (!address) return "";
  const capitalize = (str: string) =>
    str
      ? str
          ?.toLowerCase()
          ?.replace(/\b\w/g, (char) => char?.toUpperCase())
          ?.trim()
      : "";

  const parts = [
    capitalize(address?.street || ""),
    capitalize(address?.city || ""),
    capitalize(address?.state || ""),
    address?.zipCode || "",
    capitalize(address?.country || ""),
  ]?.filter(Boolean);

  return parts?.join(", ");
};
