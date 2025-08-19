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

  const handleContinueToCheckout = () => {
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
      const mockProduct = {
        type: "main",
        _id: currentPlan?._id, // Use product id
        name: currentPlan?.product || "Treatment", // product name
        isPopular: false,
        category: [
          {
            _id: "prescription-category",
            name: "prescription",
          },
        ],
        contentAndDescription: {
          shortDescription: `${currentPlan?.product} renewal prescription`,
          longDescription: `Renewal prescription for ${currentPlan?.product}`,
          description: `Continue your ${currentPlan?.product} treatment`,
          benefits: [],
          sideEffects: [],
          requiresPrescription: true,
          isFdaApproved: true,
          isFreeShipping: true,
          isLicensedPhysician: true,
          ingredientsOrComposition: [],
          faqs: [],
          extraInformations: [],
        },
        media: {
          images: [],
          videos: [],
          documents: [],
        },
        pricing: {
          basePrice: selectedPlan.price,
          compareAtPrice: selectedPlan.originalPrice || selectedPlan.price,
          subscriptionOptions: [],
        },
        dosages: [
          {
            _id: `dosage-${selectedPlan.strength}`,
            strength: selectedPlan.strength,
            strengthUnit: "mg",
            durations: [
              {
                _id: `duration-${
                  selectedPlan.duration?.value || selectedPlan.duration
                }`,
                value: selectedPlan.duration?.value || selectedPlan.duration,
                unit: "month",
                price: selectedPlan.price,
              },
            ],
          },
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create main product data for checkout slice
      const mainProductData = {
        product: mockProduct,
        selectedOption: {
          dosageId: `dosage-${selectedPlan.strength}`, // TODO: replace with the actual subscription option id
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
        productName: currentPlan?.product,
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
