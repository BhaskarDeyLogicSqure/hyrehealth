"use client";

import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";
import { useNavigationState } from "@/hooks/useNavigationState";
import ThemeLoader from "@/components/ThemeLoader";
import { SUPPORT_EMAIL } from "@/configs";

const CheckoutCTA = ({
  selectedPlanId,
  currentPlan,
  selectedDosageAndDuration,
}: {
  selectedPlanId: any;
  currentPlan: any;
  selectedDosageAndDuration?: {
    dosage: number | null;
    duration: number | null;
  };
}) => {
  const { navigateWithLoading, isNavigating } = useNavigationState();

  const handleContinueToCheckout = () => {
    if (selectedPlanId) {
      const checkoutParams = new URLSearchParams({
        renewal: "true",
        planId: selectedPlanId,
        product: currentPlan?.product || "",
        dosage: selectedDosageAndDuration?.dosage
          ? `${selectedDosageAndDuration?.dosage}mg`
          : currentPlan?.dosage || "",
      });

      navigateWithLoading(`/checkout?${checkoutParams.toString()}`);
    }
  };

  return (
    <div className="text-center space-y-4">
      <Button
        size="lg"
        className="w-full md:w-auto px-8"
        disabled={!selectedPlanId || isNavigating}
        onClick={handleContinueToCheckout}
      >
        {isNavigating ? (
          <ThemeLoader
            type="inline"
            variant="simple"
            size="sm"
            message="Proceeding to checkout..."
            className="gap-2"
          />
        ) : (
          <>
            Confirm & Continue Subscription
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-sm theme-text-muted">
        <span>Need help?</span>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="theme-text-accent hover:underline flex items-center gap-1"
        >
          <HelpCircle className="w-4 h-4" />
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default CheckoutCTA;
