"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useNavigationState = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Store current page state before navigation
  const storeCurrentState = useCallback((key: string) => {
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    localStorage.setItem(key, currentUrl);
  }, []);

  // Navigate to a page and store current state
  const navigateWithState = useCallback(
    (targetUrl: string, stateKey: string) => {
      storeCurrentState(stateKey);
      router.push(targetUrl);
    },
    [router, storeCurrentState]
  );

  // Go back to a stored state or fallback URL
  const navigateBack = useCallback(
    (stateKeys: string[], fallbackUrl: string) => {
      // First try to use document.referrer if it's from the same origin
      if (
        document.referrer &&
        document.referrer.includes(window.location.origin)
      ) {
        try {
          const referrerUrl = new URL(document.referrer);

          // Check if referrer matches any of the expected paths
          const expectedPaths = ["/products", "/categories"];
          if (expectedPaths.includes(referrerUrl.pathname)) {
            const queryString = referrerUrl.search;
            router.push(`${referrerUrl.pathname}${queryString}`);
            return;
          }

          // If referrer is from within app but not expected page, use browser back
          router.back();
          return;
        } catch (error) {
          // Continue to localStorage fallback
        }
      }

      // Try to restore from localStorage
      for (const key of stateKeys) {
        const storedUrl = localStorage.getItem(key);
        if (storedUrl) {
          localStorage.removeItem(key); // Clean up after use
          router.push(storedUrl);
          return;
        }
      }

      // Final fallback
      router.push(fallbackUrl);
    },
    [router]
  );

  // Clear stored navigation state
  const clearNavigationState = useCallback((keys: string[]) => {
    keys.forEach((key) => localStorage.removeItem(key));
  }, []);

  // Get stored navigation state without removing it
  const getNavigationState = useCallback((key: string) => {
    return localStorage.getItem(key);
  }, []);

  return {
    storeCurrentState,
    navigateWithState,
    navigateBack,
    clearNavigationState,
    getNavigationState,
  };
};

// Predefined state keys for common navigation patterns
export const NAVIGATION_KEYS = {
  LAST_PRODUCTS_PAGE: "lastProductsPageUrl",
  LAST_CATEGORIES_PAGE: "lastCategoriesPageUrl",
  LAST_SEARCH_RESULTS: "lastSearchResultsUrl",
} as const;

export default useNavigationState;
