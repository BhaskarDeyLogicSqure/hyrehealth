"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const useNavigationLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const progressTimerRef = useRef<NodeJS.Timeout>(); // ref to track the progress timer
  const timeoutTimerRef = useRef<NodeJS.Timeout>(); // ref to track the timeout timer
  const prevPathnameRef = useRef(pathname); // ref to track the previous pathname
  const prevSearchParamsRef = useRef(searchParams?.toString()); // ref to track the previous search params

  const [isLoading, setIsLoading] = useState(false); // state to track if the page is loading
  const [showLoader, setShowLoader] = useState(false); // state to track if the loader is shown
  const [progress, setProgress] = useState(0); // state to track the progress of the loader

  const _startLoading = useCallback(() => {
    console.log("🚀 Navigation loading started");

    // Clear any existing timers
    if (progressTimerRef?.current) clearInterval(progressTimerRef?.current);
    if (timeoutTimerRef?.current) clearTimeout(timeoutTimerRef?.current);

    setIsLoading(true);
    setProgress(0);
    setShowLoader(true); // Show immediately

    // Start progress animation immediately
    let currentProgress = 0;
    progressTimerRef.current = setInterval(() => {
      // Increment the progress by a random value between 0 and 15 for simulation
      currentProgress += Math.random() * 15;
      if (currentProgress >= 90) {
        currentProgress = 90;
        if (progressTimerRef?.current) clearInterval(progressTimerRef?.current);
      }
      setProgress(currentProgress);
    }, 200);

    // Set timeout to automatically stop loading after 15 seconds, doing this in case of same route navigation
    timeoutTimerRef.current = setTimeout(() => {
      console.log(
        "⏰ Navigation loading timeout reached (15s), stopping automatically"
      );
      _stopLoading();
    }, 12000);
  }, []);

  const _stopLoading = useCallback(() => {
    console.log("🛑 Navigation loading stopped");

    // Clear all timers
    if (progressTimerRef?.current) clearInterval(progressTimerRef?.current);
    if (timeoutTimerRef?.current) clearTimeout(timeoutTimerRef?.current);

    if (showLoader) {
      setProgress(100);

      // Stop the loading after 300ms, having extra time to show the progress bar
      setTimeout(() => {
        setIsLoading(false);
        setShowLoader(false);
        setProgress(0);
      }, 300);
    } else {
      setIsLoading(false);
      setShowLoader(false);
      setProgress(0);
    }
  }, [showLoader]);

  // Monitor pathname and search params changes to stop loading
  useEffect(() => {
    const currentSearchParams = searchParams?.toString();
    const hasPathnameChanged = pathname !== prevPathnameRef?.current;
    const hasSearchParamsChanged =
      currentSearchParams !== prevSearchParamsRef?.current;

    if (hasPathnameChanged || hasSearchParamsChanged) {
      console.log(
        "📍 Navigation changed:",
        hasPathnameChanged
          ? `Pathname: ${prevPathnameRef.current} -> ${pathname}`
          : "Pathname unchanged",
        hasSearchParamsChanged
          ? `Search: ${prevSearchParamsRef.current} -> ${currentSearchParams}`
          : "Search unchanged"
      );

      // Update refs
      prevPathnameRef.current = pathname;
      prevSearchParamsRef.current = currentSearchParams;

      // If the page is still loading, stop the loading
      if (isLoading) {
        _stopLoading();
      }
    }
  }, [pathname, searchParams, isLoading, _stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef?.current) clearInterval(progressTimerRef?.current);
      if (timeoutTimerRef?.current) clearTimeout(timeoutTimerRef?.current);
    };
  }, []);

  return {
    isLoading,
    showLoader,
    progress,
    startLoading: _startLoading,
    stopLoading: _stopLoading,
  };
};
