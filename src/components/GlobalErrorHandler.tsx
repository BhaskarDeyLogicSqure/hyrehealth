"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";

interface ErrorToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "warning" | "info";
  duration?: number;
}

export default function GlobalErrorHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const errorType = searchParams.get("error_type");

    if (error) {
      showErrorToast(error, errorType);

      // Clean up URL by removing error params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("error");
      newSearchParams.delete("error_type");

      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      // Replace current URL without the error params
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  const showErrorToast = (message: string, type: string | null) => {
    const options = getToastOptions(type);

    toast.error(message, {
      duration: options.duration,
      style: {
        background: "#ef4444",
        color: "#fff",
        fontSize: "16px",
        padding: "16px",
        borderRadius: "10px",
      },
    });
  };

  const getToastOptions = (errorType: string | null) => {
    switch (errorType) {
      case "network":
        return {
          description: "Please check your internet connection and try again.",
          duration: 6000,
          icon: <AlertTriangle className="h-4 w-4" />,
        };
      case "not_found":
        return {
          description: "The requested resource could not be found.",
          duration: 5000,
          icon: <Info className="h-4 w-4" />,
        };
      case "unauthorized":
        return {
          description: "Please log in to access this resource.",
          duration: 5000,
          icon: <XCircle className="h-4 w-4" />,
        };
      case "forbidden":
        return {
          description: "You don't have permission to access this resource.",
          duration: 5000,
          icon: <XCircle className="h-4 w-4" />,
        };
      case "server":
        return {
          description: "A server error occurred. Please try again later.",
          duration: 6000,
          icon: <AlertCircle className="h-4 w-4" />,
        };
      default:
        return {
          description: "Something went wrong. Please try again.",
          duration: 5000,
          icon: <AlertCircle className="h-4 w-4" />,
        };
    }
  };

  // This component doesn't render anything visible
  return null;
}

// Utility functions for manual error handling
export const showErrorToast = (
  message: string,
  options: ErrorToastOptions = {}
) => {
  toast.error(message, {
    duration: options.duration || 5000,
    style: {
      background: "#ef4444",
      color: "#fff",
      fontSize: "16px",
      padding: "16px",
      borderRadius: "10px",
    },
  });
};

export const showSuccessToast = (
  message: string,
  description?: string,
  duration: number = 4000
) => {
  toast.success(message, {
    duration,
    style: {
      background: "#2E6141",
      color: "#fff",
      fontSize: "16px",
      padding: "16px",
      borderRadius: "10px",
    },
  });
};

export const showInfoToast = (
  message: string,
  description?: string,
  duration: number = 4000
) => {
  toast(message, {
    duration,
    style: {
      background: "#3b82f6",
      color: "#fff",
      fontSize: "16px",
      padding: "16px",
      borderRadius: "10px",
    },
  });
};
