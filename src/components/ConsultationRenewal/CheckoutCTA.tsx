"use client";

import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
const CheckoutCTA = ({
  selectedPlanId,
  currentPlan,
}: {
  selectedPlanId: any;
  currentPlan: any;
}) => {
  const router = useRouter();

  const handleContinueToCheckout = () => {
    if (selectedPlanId) {
      const checkoutParams = new URLSearchParams({
        renewal: "true",
        planId: selectedPlanId,
        product: currentPlan.product,
        dosage: currentPlan.dosage,
      });

      router.push(`/checkout?${checkoutParams.toString()}`);
    }
  };
  return (
    <div className="text-center space-y-4">
      <Button
        size="lg"
        className="w-full md:w-auto px-8"
        disabled={!selectedPlanId}
        onClick={handleContinueToCheckout}
      >
        Confirm & Continue Subscription
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="flex items-center justify-center gap-4 text-sm theme-text-muted">
        <span>Need help?</span>
        <a
          href="#"
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
