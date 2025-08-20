"use client";

import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";
import { useNavigationState } from "@/hooks/useNavigationState";
import ThemeLoader from "@/components/ThemeLoader";
import { SUPPORT_EMAIL } from "@/configs";
import { useCheckout } from "@/hooks/useCheckout";
import { setCheckoutStep } from "@/store/slices/checkoutSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useRouter } from "next/navigation";

const CheckoutCTA = ({
  selectedPlanId,
  currentPlan,
  selectedDosageAndDuration,
  extensionPlans,
}: {
  selectedPlanId: any;
  currentPlan: any;
  selectedDosageAndDuration?: {
    dosage: number | null;
    duration: number | null;
  };
  extensionPlans?: any[];
}) => {
  const { isNavigating } = useNavigationState();
  const {
    clearCheckout,
    setMainProduct,
    calculateTotal,
    setProductEligibility,
  } = useCheckout();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const _handleContinueToCheckout = () => {
    if (
      !selectedDosageAndDuration?.dosage ||
      !selectedDosageAndDuration?.duration
    ) {
      return;
    }

    console.log({ extensionPlans, selectedDosageAndDuration });

    // Find the selected extension plan
    const selectedPlan = extensionPlans?.find(
      (plan) =>
        plan?.strength === selectedDosageAndDuration?.dosage &&
        plan?.duration?.value === selectedDosageAndDuration?.duration
    );

    if (!selectedPlan) {
      console.error("Selected plan not found");
      return;
    }

    try {
      // Clear any existing checkout data if present
      clearCheckout();

      // Create a mock Product object from current treatment data
      // Since we don't have full product details, we'll create a minimal product object

      // Create main product data for checkout slice
      const mainProductData = {
        product: currentPlan?.product,
        selectedOption: {
          dosageId: selectedPlan?._id,
          dosageStrength: selectedPlan.strength,
          duration: selectedPlan.duration?.value || selectedPlan.duration,
          price: selectedPlan.price,
        },
      };

      // Set main product in checkout slice
      setMainProduct(mainProductData);

      // Set product eligibility in checkout slice
      setProductEligibility({
        productId: currentPlan?._id,
        productName: currentPlan?.product?.name,
        isEligible: true,
        responses: [],
      });
      // Set checkout step to "review" to skip questionnaire
      dispatch(setCheckoutStep("review"));

      // Calculate total
      calculateTotal();

      // Navigate to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Error setting up checkout:", error);
    }
  };

  return (
    <div className="text-center space-y-4">
      <Button
        size="lg"
        className="w-full md:w-auto px-8"
        disabled={
          !selectedDosageAndDuration?.dosage ||
          !selectedDosageAndDuration?.duration ||
          isNavigating
        }
        onClick={_handleContinueToCheckout}
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
