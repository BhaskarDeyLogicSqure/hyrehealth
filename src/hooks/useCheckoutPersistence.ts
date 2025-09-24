"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/useCheckout";

/**
 * Custom hook to handle checkout data persistence
 * - Persists data on refresh (same page)
 * - Clears data when navigating away from checkout page
 */
export const useCheckoutPersistence = () => {
  const router = useRouter();
  const { setOnCheckoutPage, clearFormData, clearCheckout } = useCheckout();
  const isOnCheckoutPageRef = useRef(false);

  useEffect(() => {
    // Set that we're on the checkout page
    setOnCheckoutPage(true);
    isOnCheckoutPageRef.current = true;

    // Handle page refresh - keep data persisted
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // On refresh, we want to keep the data, so we don't clear it here
      // The data will be persisted by Redux persist
    };

    // Handle navigation away from checkout
    const handleRouteChange = () => {
      if (isOnCheckoutPageRef.current) {
        // We're navigating away from checkout, clear all data
        clearCheckout();
        setOnCheckoutPage(false);
        isOnCheckoutPageRef.current = false;
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Check if we're actually leaving the checkout page
      const currentPath = window.location.pathname;
      const isLeavingCheckout = !currentPath.includes("/checkout");

      if (isLeavingCheckout && isOnCheckoutPageRef.current) {
        // Clear all checkout data when navigating away
        clearCheckout();
      }

      // Mark that we're no longer on checkout page
      setOnCheckoutPage(false);
      isOnCheckoutPageRef.current = false;
    };
  }, []);

  return {
    isOnCheckoutPage: isOnCheckoutPageRef.current,
  };
};

export default useCheckoutPersistence;
