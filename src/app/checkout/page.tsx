"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import BasicInfoCard from "@/components/checkout/BasicInfoCard";
import BillingAddressCard from "@/components/checkout/BillingAddressCard";
import OrderSummarySection from "@/components/checkout/OrderSummarySection";
import AccountCreationCard from "@/components/checkout/AccountCreationCard";
import useCheckoutDetails from "@/hooks/useCheckoutDetails";
import { useCheckout } from "@/hooks/useCheckout";
import { useCheckoutQuestionnaire } from "@/hooks/useCheckoutQuestionnaire";
import { showErrorToast, showSuccessToast } from "@/components/GlobalErrorHandler";
import useCheckoutPersistence from "@/hooks/useCheckoutPersistence";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useOrderCheckout from "@/hooks/useOrderCheckout";
import Link from "next/link";
import { CHECKOUT_PAYMENT_METHOD } from "@/configs";
import BraintreePaymentFields, { BraintreePaymentMethodPayload } from "@/components/checkout/BraintreePaymentFields";
import useChekoutApi from "@/api/checkout/useChekoutApi";

const CheckoutPage = () => {
  const router = useRouter();
  const { clearCheckout } = useCheckout();
  const { completePayment } = useChekoutApi();
  // Get merchant data for dynamic content
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const [braintreePaymentMethod, setBraintreePaymentMethod] =
    useState<BraintreePaymentMethodPayload | null>(null);
  const checkoutPaymentMethod = merchantData?.checkoutPaymentMethod || CHECKOUT_PAYMENT_METHOD || "";


  const [braintreeInit, setBraintreeInit] = useState<{
    referenceId?: string;
    clientToken?: string;
    finalAmount?: number;
  } | null>(null);


  const { eligibleProducts, mainProductIfEligible, selectedRelatedProducts } =
    useCheckoutQuestionnaire();
  const {
    isLoggedIn,
    formFields,
    errors,
    loading,
    handleOnChange,
    handleGetPayload,
    manageLoading,
  } = useCheckoutDetails();

  // Get order checkout data for pricing and product info
  const { totalPrice, discountedTotalPrice, selectedProducts } =
    useOrderCheckout({
      product: mainProductIfEligible ?? null,
      initialMainProductSelectedOption: eligibleProducts?.[0]?.selectedOption,
      selectedRelatedProducts,
    });

  // Handle checkout data persistence
  useCheckoutPersistence();

  const shouldShowBraintreePaymentUi =
    checkoutPaymentMethod === "braintree" &&
    Boolean(braintreeInit?.referenceId && braintreeInit?.clientToken);

  const handleBackFromBraintreePayment = () => {
    setBraintreeInit(null);
  };

  const handleBraintreePaymentMethod = async (
    payload: BraintreePaymentMethodPayload
  ) => {
    try {
      manageLoading("braintreePaymentProcessing", true);

      setBraintreePaymentMethod(payload);

      const referenceId = braintreeInit?.referenceId;
      if (!referenceId?.trim()?.length) {
        showErrorToast("Missing payment reference. Please try again.");
        return;
      }

      const response = await completePayment({
        referenceId,
        paymentMethodNonce: payload?.nonce,
        deviceData: payload?.deviceData,
      });

      const invoiceNumber = response?.data?.invoice?.invoiceNumber;
      if (!invoiceNumber) {
        showErrorToast(
          "Payment completed, but invoice number is missing. Please contact support."
        );
        return;
      }

      showSuccessToast("Order placed successfully.");
      clearCheckout();
      router.replace(`/thank-you?orderId=${encodeURIComponent(invoiceNumber)}`);
    } catch (e) {
      showErrorToast(
        (e as { message?: string })?.message || "Could not complete payment."
      );
    } finally {
      manageLoading("braintreePaymentProcessing", false);
    }
  };

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

      // // Clear checkout data when component unmounts (navigating away)
      // const isLeavingCheckout = !window.location.pathname.includes("/checkout");
      // if (isLeavingCheckout) {
      //   clearCheckout();
      // }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowBraintreePaymentUi ? (
        <BraintreePaymentFields
          clientToken={braintreeInit?.clientToken || ""}
          finalAmount={braintreeInit?.finalAmount || 0}
          onBack={handleBackFromBraintreePayment}
          onPaymentMethod={handleBraintreePaymentMethod}
          isBraintreePaymentProcessing={loading?.braintreePaymentProcessing}
        />
      ) :
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">
              Complete your order to start your wellness program
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
                  <div className="space-y-4 flex bg-muted/50 rounded-lg p-5">
                    {/* Vertical grey line */}
                    <div
                      className="w-px bg-gray-200 mr-6"
                      style={{ minHeight: 80 }}
                    />
                    <div className="flex-1 space-y-4">
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
                          I accept the{" "}
                          <Link
                            href="https://hyrtechnology.com/terms-of-use"
                            className="text-sky-600 underline underline-offset-4 hover:text-sky-500 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Terms of Service
                          </Link>
                          ,{" "}
                          <Link
                            href="/privacy-policy"
                            className="text-sky-600 underline underline-offset-4 hover:text-sky-500 transition-colors"
                          >
                            Privacy Policy
                          </Link>
                          , and{" "}
                          <Link
                            href="/return-policy"
                            className="text-sky-600 underline underline-offset-4 hover:text-sky-500 transition-colors"
                          >
                            Return Policy
                          </Link>
                          . I understand this wellness program requires a valid
                          authorization from a licensed physician.
                        </Label>
                      </div>

                      {/* Order Confirmation Text */}
                      {/* <div className="space-y-4">
                        <p className="text-sm leading-relaxed text-gray-700">
                          By placing your monthly recurring order of{" "}
                          <span className="font-semibold">
                            {selectedProducts?.length || 1} x{" "}
                            {mainProductIfEligible?.name || "Product"}
                          </span>
                          {" "} - you will be charged{" "}
                          <span className="font-semibold">
                            $
                            {(discountedTotalPrice || totalPrice || 0).toFixed(2)}
                          </span>{" "}
                          Now and every 30 days thereafter until you cancel your subscription. You will receive an electronic notification 5 to 7 days prior to your transaction and receipt after each successful transaction.
                        </p>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <OrderSummarySection
              checkoutPaymentMethod={checkoutPaymentMethod}
              setBraintreeInit={setBraintreeInit}
              handleGetPayload={handleGetPayload}
            />
          </div>
        </div>}
    </div>
  );
};

export default CheckoutPage;

// test comment