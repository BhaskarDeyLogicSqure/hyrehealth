"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";

const NavigationLoader = () => {
  const { showLoader, progress, startLoading } = useNavigationLoader();
  const router = useRouter();

  useEffect(() => {
    // console.log("🔧 NavigationLoader mounted");

    // Intercept router navigation methods
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args: Parameters<typeof router.push>) => {
      // console.log("🔀 Router.push intercepted:", args[0]);
      startLoading();
      return originalPush.apply(router, args);
    };

    router.replace = (...args: Parameters<typeof router.replace>) => {
      // console.log("🔀 Router.replace intercepted:", args[0]);
      startLoading();
      return originalReplace.apply(router, args);
    };

    // Also intercept Link clicks
    const _handleLinkClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;

      if (link && link?.href) {
        const url = new URL(link?.href);
        const currentUrl = new URL(window?.location?.href);

        // Only trigger for internal navigation (pathname or search params change)
        if (
          url.origin === currentUrl?.origin &&
          (url?.pathname !== currentUrl?.pathname ||
            url?.search !== currentUrl?.search)
        ) {
          // console.log(
          //   "🔗 Link click intercepted:",
          //   url?.pathname + url?.search
          // );
          startLoading();
        }
      }
    };

    // Add global click listener for links
    document.addEventListener("click", _handleLinkClick, true);

    return () => {
      // console.log("🔧 NavigationLoader unmounting");
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      document.removeEventListener("click", _handleLinkClick, true);
    };
  }, [router, startLoading]);

  // console.log("🎨 NavigationLoader render:", { showLoader, progress });

  if (!showLoader) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      {/* Background track */}
      <div className="w-full h-full bg-gray-200/50 backdrop-blur-sm">
        {/* Progress bar */}
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-300 ease-out shadow-sm"
          style={{
            width: `${progress}%`,
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
          }}
        >
          {/* Animated shimmer effect */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Loading text (optional, appears only for very long loads) */}
      {/* {progress > 50 && (
        <div className="absolute top-2 right-4">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600 font-medium">
              Loading...
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default NavigationLoader;
