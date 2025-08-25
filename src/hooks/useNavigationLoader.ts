"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

export const useNavigationLoader = () => {
  const pathname = usePathname();

  const progressTimerRef = useRef<NodeJS.Timeout>(); // ref to track the progress timer
  const prevPathnameRef = useRef(pathname); // ref to track the previous pathname

  const [isLoading, setIsLoading] = useState(false); // state to track if the page is loading
  const [showLoader, setShowLoader] = useState(false); // state to track if the loader is shown
  const [progress, setProgress] = useState(0); // state to track the progress of the loader

  const _startLoading = useCallback(() => {
    console.log("🚀 Navigation loading started");

    // Clear any existing timers
    if (progressTimerRef?.current) clearInterval(progressTimerRef?.current);

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
  }, []);

  const _stopLoading = useCallback(() => {
    console.log("🛑 Navigation loading stopped");

    // Clear progress timer
    if (progressTimerRef?.current) clearInterval(progressTimerRef?.current);

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

  // Monitor pathname changes to stop loading
  useEffect(() => {
    if (pathname !== prevPathnameRef?.current) {
      console.log(
        "📍 Pathname changed:",
        prevPathnameRef.current,
        "->",
        pathname
      );
      prevPathnameRef.current = pathname; // Update the previous pathname to the current one

      // If the page is still loading, stop the loading
      if (isLoading) {
        _stopLoading();
      }
    }
  }, [pathname, isLoading, _stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef?.current) clearInterval(progressTimerRef?.current);
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
