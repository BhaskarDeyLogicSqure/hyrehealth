"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ThemeLoader from "@/components/ThemeLoader";
import { showErrorToast } from "@/components/GlobalErrorHandler";

// Dynamic import for the shared renewal component
const ConsultationRenewalComponent = dynamic(
  () => import("@/components/ConsultationRenewal"),
  {
    loading: () => <ThemeLoader variant="full-page" message="Loading..." />,
  }
);

interface ConsultationRenewalProps {
  searchParams: { subscriptionId: string };
}

const Renewal = ({ searchParams }: ConsultationRenewalProps) => {
  const { subscriptionId } = searchParams;
  const router = useRouter();

  useEffect(() => {
    if (!subscriptionId) {
      showErrorToast("No subscription ID provided. Redirecting back...");
      // Redirect to previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  }, [subscriptionId, router]);

  if (!subscriptionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Missing Subscription ID
          </h1>
          <p className="text-gray-600">Redirecting back to previous page...</p>
        </div>
      </div>
    );
  }

  return <ConsultationRenewalComponent subscriptionId={subscriptionId} />;
};

export default Renewal;
