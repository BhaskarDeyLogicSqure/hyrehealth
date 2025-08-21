"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import BasicInfoCard from "@/components/checkout/BasicInfoCard";
import BillingAddressCard from "@/components/checkout/BillingAddressCard";
import OrderSummarySection from "@/components/checkout/OrderSummarySection";
import NMIPaymentInfoCard from "@/components/checkout/NMIPaymentInfoCard";
import AccountCreationCard from "@/components/checkout/AccountCreationCard";
import useCheckoutDetails from "@/hooks/useCheckoutDetails";
import { useCheckout } from "@/hooks/useCheckout";
import { useCheckoutQuestionnaire } from "@/hooks/useCheckoutQuestionnaire";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import useNMIPayments from "@/hooks/useNMIPayments";

const CheckoutPage = () => {
  const router = useRouter();
  const { clearCheckout } = useCheckout();
  const { eligibleProducts } = useCheckoutQuestionnaire();
  const {
    isLoggedIn,
    formFields,
    errors,
    handleOnChange,
    handleGetPayload,
    setErrors,
  } = useCheckoutDetails();

  useEffect(() => {
    // Check if we have valid checkout data, if not redirect to products page
    const hasValidCheckoutData = eligibleProducts?.length;

    if (!hasValidCheckoutData) {
      showErrorToast("No valid checkout data found");
      router.replace("/products");
      return;
    }

    // Handle browser back button - redirect to product page instead of questionnaire
    const handlePopState = () => {
      // if (questionnaire?.productEligibilities?.[0]?.productId) {
      //   router.replace(
      //     `/products/${questionnaire.productEligibilities[0].productId}`
      //   );
      // } else {
      router.replace("/products"); // for now redirect to products page in all cases
      // }
    };

    // Add event listeners
    window.addEventListener("popstate", handlePopState);

    // Override browser back behavior
    window.history.pushState(null, "", window.location.href);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);

      // Clear checkout data when component unmounts (navigating away)
      const isLeavingCheckout = !window.location.pathname.includes("/checkout");
      if (isLeavingCheckout) {
        clearCheckout();
      }
    };
  }, []);

  const {
    isCollectJSLoaded,
    isProcessing,
    paymentError,
    fieldValidation,
    generateToken,
  } = useNMIPayments(setErrors);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete your order to start your treatment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            {!isLoggedIn ? (
              <BasicInfoCard
                formFields={formFields}
                errors={errors}
                handleInputChange={handleOnChange}
              />
            ) : null}

            {/* Billing Address */}
            <BillingAddressCard
              formFields={formFields}
              errors={errors}
              handleOnChange={handleOnChange}
            />

            {/* Payment Information */}
            <NMIPaymentInfoCard
              formFields={formFields}
              errors={errors}
              isCollectJSLoaded={isCollectJSLoaded}
              paymentError={paymentError}
              handleOnChange={handleOnChange}
            />

            {/* Account Creation (if not logged in) */}
            {!isLoggedIn ? (
              <AccountCreationCard
                formFields={formFields}
                errors={errors}
                handleOnChange={handleOnChange}
              />
            ) : null}

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      className="h-5 w-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
                      id="acceptTerms"
                      checked={formFields?.acceptTerms}
                      onCheckedChange={(checked: boolean) =>
                        handleOnChange("acceptTerms", !!checked)
                      }
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-sm leading-relaxed text-gray-600 cursor-pointer"
                    >
                      I accept the Terms of Service, Privacy Policy, and HIPAA
                      Consent. I understand this medication requires a valid
                      prescription from a licensed physician.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <OrderSummarySection
            isProcessing={isProcessing}
            fieldValidation={fieldValidation}
            handleGetPayload={handleGetPayload}
            generateToken={generateToken}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
