"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CATEGORIES_PER_PAGE } from "@/configs";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
interface UrlParamsOptions {
  debounceMs?: number;
  preserveParams?: string[]; // Params to preserve when updating others
}

export const useUrlParams = <T extends Record<string, any>>(
  defaultValues: T,
  options: UrlParamsOptions = {}
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { debounceMs = 300, preserveParams = [] } = options;

  // Initialize state from URL params or default values
  const [params, setParams] = useState<T>(() => {
    const initialParams = { ...defaultValues };

    // Read from URL params
    for (const key in defaultValues) {
      const urlValue = searchParams.get(key);
      if (urlValue !== null) {
        // Try to parse as number if default value is number
        if (typeof defaultValues[key] === "number") {
          const numValue = parseInt(urlValue, 10);
          initialParams[key] = (
            isNaN(numValue) ? defaultValues[key] : numValue
          ) as T[typeof key];
        } else {
          initialParams[key] = urlValue as T[typeof key];
        }
      }
    }

    return initialParams;
  });

  // Debounce timer ref
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Update URL when params change
  const updateUrl = useCallback(
    (newParams: T) => {
      const url = new URLSearchParams();

      // Add preserved params first
      preserveParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          url.set(param, value);
        }
      });

      // Add new params
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Don't add default values to URL to keep it clean
          if (value !== defaultValues[key as keyof T]) {
            url.set(key, String(value));
          }
        }
      });

      const urlString = url.toString();
      const newUrl = urlString ? `${pathname}?${urlString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams, defaultValues, preserveParams]
  );

  // Update a single parameter
  const updateParam = useCallback(
    (key: keyof T, value: T[keyof T], immediate = false) => {
      const newParams = { ...params, [key]: value };

      // Reset page to 1 when filters change (except for page itself)
      if (key !== "page" && key in newParams && "page" in defaultValues) {
        (newParams as any).page = 1;
      }

      setParams(newParams);

      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (immediate || debounceMs === 0) {
        updateUrl(newParams);
      } else {
        // Debounce URL updates for search inputs
        const timer = setTimeout(() => {
          updateUrl(newParams);
        }, debounceMs);
        setDebounceTimer(timer);
      }
    },
    [params, updateUrl, debounceTimer, debounceMs, defaultValues]
  );

  // Update multiple parameters at once
  const updateParams = useCallback(
    (updates: Partial<T>, immediate = true) => {
      const newParams = { ...params, ...updates };
      setParams(newParams);

      if (immediate) {
        updateUrl(newParams);
      }
    },
    [params, updateUrl]
  );

  // Reset to default values
  const resetParams = useCallback(() => {
    setParams(defaultValues);
    updateUrl(defaultValues);
  }, [defaultValues, updateUrl]);

  // Get a specific parameter value
  const getParam = useCallback(
    (key: keyof T) => {
      return params[key];
    },
    [params]
  );

  // Check if a parameter has a non-default value
  const hasNonDefaultValue = useCallback(
    (key: keyof T) => {
      return params[key] !== defaultValues[key];
    },
    [params, defaultValues]
  );

  // Get query string for current params
  const getQueryString = useCallback(() => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== defaultValues[key as keyof T]
      ) {
        url.set(key, String(value));
      }
    });
    return url.toString();
  }, [params, defaultValues]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    params,
    updateParam,
    updateParams,
    resetParams,
    getParam,
    hasNonDefaultValue,
    getQueryString,

    // Convenience methods for common operations
    setSearch: (value: string) =>
      updateParam("search" as keyof T, value as T[keyof T]),
    setPage: (value: number) =>
      updateParam("page" as keyof T, value as T[keyof T], true),
    setSort: (value: string) =>
      updateParam("sort" as keyof T, value as T[keyof T], true),
    setCategory: (value: string) =>
      updateParam("category" as keyof T, value as T[keyof T], true),
  };
};

// Specialized hook for products page
export const useProductsUrlParams = (fdaApproved: boolean) => {
  return useUrlParams(
    {
      search: "",
      category: "",
      sort: "",
      page: 1,
      limit: 6,
      fdaApproved: fdaApproved,
    },
    {
      debounceMs: 500, // Longer debounce for search
      preserveParams: [], // No additional params to preserve
    }
  );
};

// Specialized hook for categories page
export const useCategoriesUrlParams = () => {
  return useUrlParams(
    {
      search: "",
      page: 1,
      limit: CATEGORIES_PER_PAGE,
    },
    {
      debounceMs: 500,
      preserveParams: [],
    }
  );
};

export default useUrlParams;
