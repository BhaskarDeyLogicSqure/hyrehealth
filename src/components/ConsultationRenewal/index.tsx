"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsultationRenewalComponent from "./ConsultationRenewalComponent";
import { useRenewalDetails } from "@/api/postCheckout/useRenewalDetails";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { showErrorToast } from "@/components/GlobalErrorHandler";

const RenewalPage = ({ subscriptionId }: { subscriptionId: string }) => {
  const router = useRouter();
  const {
    renewalDetails,
    isRenewalDetailsLoading,
    isRenewalDetailsError,
    renewalDetailsError,
    refetchRenewalDetails,
  } = useRenewalDetails(subscriptionId);
  // Handle errors with toast and redirect
  useEffect(() => {
    if (isRenewalDetailsError) {
      const errorMessage =
        renewalDetailsError?.message ||
        "Failed to load renewal details. Redirecting back...";
      showErrorToast(errorMessage);

      // Redirect to previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  }, [isRenewalDetailsError, renewalDetailsError, router]);

  // Handle no data case
  useEffect(() => {
    if (!isRenewalDetailsLoading && !isRenewalDetailsError && !renewalDetails) {
      showErrorToast("No renewal details found. Redirecting back...");

      // Redirect to previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  }, [isRenewalDetailsLoading, isRenewalDetailsError, renewalDetails, router]);

  // Loading state
  if (isRenewalDetailsLoading) {
    return (
      <div className="min-h-screen theme-bg">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-8">
            {/* Loading Header */}
            <div className="text-center space-y-4">
              <Skeleton className="h-8 w-96 mx-auto" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>

            {/* Loading Card */}
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state - show simplified error message since toast will handle the error and redirect
  if (isRenewalDetailsError) {
    return (
      <div className="min-h-screen theme-bg">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold theme-text-primary mb-2">
              Error Loading Renewal Details
            </h1>
            <p className="theme-text-muted mb-4">
              Redirecting back to previous page...
            </p>
            <Button
              onClick={() => refetchRenewalDetails()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // No data state - show simplified message since toast will handle the error and redirect
  if (!renewalDetails) {
    return (
      <div className="min-h-screen theme-bg">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold theme-text-primary mb-2">
              No Renewal Details Found
            </h1>
            <p className="theme-text-muted">
              Redirecting back to previous page...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ConsultationRenewalComponent
      currentTreatment={renewalDetails?.currentTreatment}
      extensionPlans={renewalDetails?.extensionPlans}
    />
  );
};

export default RenewalPage;
