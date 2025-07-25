"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export const useNavigationState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  // Store current page state before navigation
  const storeCurrentState = useCallback((key: string) => {
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    localStorage.setItem(key, currentUrl);
  }, []);

  // Navigate to a page and store current state with loading indicator
  const navigateWithState = useCallback(
    (targetUrl: string, stateKey: string) => {
      setIsNavigating(true);
      setNavigationTarget(targetUrl);
      storeCurrentState(stateKey);

      // Add a small delay to show loading state
      setTimeout(() => {
        router.push(targetUrl);
        // Reset loading state after navigation starts
        setTimeout(() => {
          setIsNavigating(false);
          setNavigationTarget(null);
        }, 100);
      }, 300);
    },
    [router, storeCurrentState]
  );

  // Navigate with loading state (for simple navigation without state storage)
  const navigateWithLoading = useCallback(
    (targetUrl: string) => {
      setIsNavigating(true);
      setNavigationTarget(targetUrl);

      // Add a small delay to show loading state
      setTimeout(() => {
        router.push(targetUrl);
        // Reset loading state after navigation starts
        setTimeout(() => {
          setIsNavigating(false);
          setNavigationTarget(null);
        }, 100);
      }, 300);
    },
    [router]
  );

  // Go back to a stored state or fallback URL
  const navigateBack = useCallback(
    (stateKeys: string[], fallbackUrl: string) => {
      setIsNavigating(true);

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
            setTimeout(() => {
              router.push(`${referrerUrl.pathname}${queryString}`);
              setTimeout(() => setIsNavigating(false), 100);
            }, 300);
            return;
          }

          // If referrer is from within app but not expected page, use browser back
          setTimeout(() => {
            router.back();
            setTimeout(() => setIsNavigating(false), 100);
          }, 300);
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
          setTimeout(() => {
            router.push(storedUrl);
            setTimeout(() => setIsNavigating(false), 100);
          }, 300);
          return;
        }
      }

      // Final fallback
      setTimeout(() => {
        router.push(fallbackUrl);
        setTimeout(() => setIsNavigating(false), 100);
      }, 300);
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

  // Check if currently navigating to a specific URL
  const isNavigatingTo = useCallback(
    (url: string) => {
      return isNavigating && navigationTarget === url;
    },
    [isNavigating, navigationTarget]
  );

  return {
    storeCurrentState,
    navigateWithState,
    navigateWithLoading,
    navigateBack,
    clearNavigationState,
    getNavigationState,
    isNavigating,
    navigationTarget,
    isNavigatingTo,
  };
};

// Predefined state keys for common navigation patterns
export const NAVIGATION_KEYS = {
  LAST_PRODUCTS_PAGE: "lastProductsPageUrl",
  LAST_CATEGORIES_PAGE: "lastCategoriesPageUrl",
  LAST_SEARCH_RESULTS: "lastSearchResultsUrl",
} as const;

export default useNavigationState;
