"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Trash2, Stethoscope } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { showErrorToast } from "../GlobalErrorHandler";
import { Separator } from "@/components/ui/separator";
import { useCheckoutQuestionnaire } from "@/hooks/useCheckoutQuestionnaire";
import useOrderCheckout from "@/hooks/useOrderCheckout";
import { useCheckout } from "@/hooks/useCheckout";
import { DIGITS_AFTER_DECIMALS } from "@/configs";
import useChekoutApi from "@/api/checkout/useChekoutApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/actions/authAction";
import { useCookies } from "@/hooks/useCookies";
import { isUserAuthenticated } from "@/utils/auth";
import CouponCodeSection from "./CouponCodeSection";
import ThemeLoader from "@/components/ThemeLoader";
import { RootState } from "@/store";

/** Poll invoice status while API returns `pending` (max window ~15s). */
// const INVOICE_STATUS_POLL_BUDGET_MS = 15_000;
// const INVOICE_STATUS_POLL_INTERVAL_MS = 2_000;

const OrderSummarySection = ({
  checkoutPaymentMethod,
  setBraintreeInit,
  handleGetPayload,
}: {
  checkoutPaymentMethod: string;
  setBraintreeInit: (init: {
    referenceId?: string;
    clientToken?: string;
    finalAmount?: number;
  } | null) => void;
  handleGetPayload: (e: React.FormEvent) => Promise<any>;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setCookie } = useCookies();
  // const { clearCheckout } = useCheckout();

  const {
    signUpWithPayment,
    loginOrderCheckout,
    // getInvoiceStatus,
    // initiateBraintreeCheckout,
  } =
    useChekoutApi();

  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );
  // console.log("merchantData", merchantData);

  // check if the user is logged in
  const isUserLoggedIn = isUserAuthenticated();

  // check for refId from query params
  const searchParams = useSearchParams();
  const refId = searchParams?.get("ref");

  const [isProcessing, setIsProcessing] = useState(
    () => Boolean(refId && refId.length > 0)
  );

  const {
    eligibleProducts,
    mainProductIfEligible,
    isFromQuestionnaire,
    selectedRelatedProducts,
    questionnaire,
  } = useCheckoutQuestionnaire();

  const {
    productConfigurations,
    selectedProducts,
    isCheckoutLoading,
    totalPrice,
    discountedTotalPrice,
    discountApplied,
    couponCode,
    appliedCoupon,
    isValidateCouponLoading,
    handleDosageAndSubscriptionDurationChange,
    generateDosageOptions,
    generateSubscriptionDurationOptions,
    getSelectedDosageWithDuration,
    handleApplyCoupon,
    handleClearCoupon,
    handleCouponCodeChange,
    handleDeleteProductAlert,
    setIsCheckoutLoading,
  } = useOrderCheckout({
    product: mainProductIfEligible ?? null, // it is the main product
    initialMainProductSelectedOption: eligibleProducts?.[0]?.selectedOption, // it is the initial selected option for the main product, can be changed later on user interaction
    selectedRelatedProducts, // it is the list of all related products (if any)
  });

  // console.log("1111", { fieldValidation });
  const _handleSubmit = async (e: React.FormEvent) => {
    try {
      if (e) e.preventDefault();

      // check if the payment method is supported
      if (checkoutPaymentMethod !== "braintree") {
        showErrorToast("Payment method not supported");
        return;
      }

      setIsCheckoutLoading(true);

      // get payload for payment details
      const { error, payload } = await handleGetPayload(e);

      // return if no payload present or no questionnaire responses are present or payment fields are not filled
      if (error || !payload) {
        return;
      }

      //  check if there's a valid questionnaire response
      // if (!questionnaire?.generalResponses?.length) {
      //   showErrorToast(
      //     "Please fill the questionnaire first from the previous step"
      //   );
      //   return;
      // }

      const invalidProducts = productConfigurations?.filter(
        (config) => !config?.dosageId || !config?.subscriptionDuration
      );

      if (invalidProducts?.length > 0) {
        showErrorToast(
          "Please select valid dosage and duration for all selected products"
        );
        return;
      }

      // add the price info to the payload
      payload["paymentInfo"]["finalAmount"] =
        discountedTotalPrice || totalPrice; // this will be the final amount after applying the coupon

      // ensure currency is set for payment initiation flows
      payload["paymentInfo"]["currency"] =
        payload?.paymentInfo?.currency || "USD";

      // add the coupon info to the payload
      if (appliedCoupon?.code) {
        payload["paymentInfo"]["couponCode"] = appliedCoupon?.code;
      }

      // if (generatedPaymentToken) {
      //   payload["paymentInfo"]["paymentToken"] = generatedPaymentToken;
      // }

      //  now update the payload with product configurations
      if (productConfigurations?.length > 0) {
        payload["paymentInfo"]["products"] = productConfigurations?.map(
          (config) => {
            return {
              isPrimary:
                config?.productId === mainProductIfEligible?._id || undefined,
              productId: config?.productId || undefined,
              strength: config?.strength || undefined,
              subscriptionOptionId: config?.dosageId || undefined,
            };
          }
        );
      }

      // now update the payload with questionnaire responses
      if (isFromQuestionnaire && questionnaire?.generalResponses?.length > 0) {
        const newQuestionnaireResponses = [
          ...questionnaire?.generalResponses,
          ...questionnaire?.productResponses,
        ];

        payload["questionnaireResponses"] = newQuestionnaireResponses?.map(
          (response) => {
            return {
              _question: response?.questionId || undefined,
              answer: response?.answer || undefined,
            };
          }
        );
      }

      // // Mock successful checkout
      // console.log("Final payload:", payload);

      // call the checkout api
      let response;

      if (isUserLoggedIn) {
        // call the login order checkout api for logged in users
        response = await loginOrderCheckout(payload);
      } else {
        // call the sign up with payment api for new users
        response = await signUpWithPayment(payload);
      }

      // Handle successful checkout - store token and user details
      if (response?.data?.token && response?.data?.customer) {
        // Store token in cookie
        setCookie("customer-token", response?.data?.token);

        // Update Redux store with user details (initiating login)
        dispatch(setUser(response?.data?.customer));

        // --- will be shown after payment success ---
        // showSuccessToast("Order Placed Successfully! Welcome to HyreHealth!"); 
        // clearCheckout(); // clear the checkout data after successful checkout
        // // Navigate to thank you page after successful checkout
        // router.replace(
        //   `/thank-you?orderId=${response?.data?.invoice?.invoiceNumber}`
        // );
        // --- will be shown after payment success ---
      }

      // if the response contains referenceId and clientToken, then set the braintree init data and show the braintree payment UI so that user can proceed to payment step
      if (response?.data?.referenceId && response?.data?.clientToken) {
        const referenceId = response?.data?.referenceId;
        const clientToken = response?.data?.clientToken;

        if (!referenceId?.trim()?.length || !clientToken?.trim()?.length) {
          showErrorToast("Could not initiate payment. Please try again.");
          return;
        }

        setBraintreeInit({
          referenceId,
          clientToken,
          finalAmount: payload?.paymentInfo?.finalAmount,
        });
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        (error as any)?.message || error || "Something went wrong"
      );
    } finally {
      //  no need to set isCheckoutLoading to false as we are moving to a new route from here after successful checkout
      setIsCheckoutLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!refId?.length || merchantData?.checkoutPaymentMethod !== "tycoon") return;

  //   let cancelled = false;

  //   const confirmPayment = async () => {
  //     try {
  //       setIsProcessing(true);

  //       const pollStartedAt = Date.now();

  //       while (!cancelled) {
  //         const response = await getInvoiceStatus(refId);
  //         if (cancelled) return;

  //         const envelope = response?.data;
  //         const status = envelope?.status;

  //         if (status === "completed" && envelope?.data) {
  //           const details = envelope.data;
  //           showSuccessToast("Order placed successfully.");
  //           clearCheckout();
  //           const invoiceNumber = details?.invoice?.invoiceNumber;
  //           if (invoiceNumber) {
  //             router.replace(
  //               `/thank-you?orderId=${encodeURIComponent(invoiceNumber)}`
  //             );
  //           }
  //           return;
  //         }

  //         if (status === "failed") {
  //           showErrorToast("Payment failed! Please try again.");
  //           return;
  //         }

  //         if (status !== "pending") {
  //           showErrorToast(
  //             "Could not confirm payment status. Please refresh or try again."
  //           );
  //           return;
  //         }

  //         const elapsed = Date.now() - pollStartedAt;
  //         if (elapsed >= INVOICE_STATUS_POLL_BUDGET_MS) {
  //           showErrorToast(
  //             "Payment is still processing. Please wait a moment, then refresh the page."
  //           );
  //           return;
  //         }

  //         const waitMs = Math.min(
  //           INVOICE_STATUS_POLL_INTERVAL_MS,
  //           INVOICE_STATUS_POLL_BUDGET_MS - elapsed
  //         );
  //         await new Promise<void>((resolve) => setTimeout(resolve, waitMs));
  //       }
  //     } catch (error) {
  //       if (!cancelled) {
  //         showErrorToast(
  //           (error as { message?: string })?.message ||
  //           "Could not confirm payment"
  //         );
  //       }
  //     } finally {
  //       setIsProcessing(false);
  //     }
  //   };

  //   void confirmPayment();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [refId]);

  return (
    <>
      {isProcessing ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <ThemeLoader
            variant="simple"
            message="Processing payment, please wait a moment."
            size="lg"
            className="flex-col gap-4"
          />
        </div>
      ) : null}
      <div>
        <Card className="sticky top-24 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Product Details Section */}
            {/* {productConfigurations?.map((config) => {
              const product = eligibleProducts?.find(
                (item) => item?.product?._id === config?.productId
              )?.product;

              if (!product) return null;

              const selectedOption = getSelectedDosageWithDuration(
                config?.productId
              );

              const isMainProduct =
                product?._id === eligibleProducts?.[0]?.product?._id;

              return (
                <Card
                  key={config?.productId}
                  className="border border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {product?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {isMainProduct
                            ? "Primary Product"
                            : "Add-on Product"}
                        </p>
                      </div>
                      <div className="text-right ml-4 flex items-center gap-2">
                        <p className="font-bold text-lg">
                          $
                          {selectedOption?.price?.toFixed(
                            DIGITS_AFTER_DECIMALS
                          ) || 0}
                        </p>
                        {selectedProducts?.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteProductAlert(
                                config?.productId,
                                product?.name
                              )
                            }
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 h-8 w-8 rounded-full"
                            type="button"
                            title="Remove product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Dosage
                        </label>
                        <Select
                          value={config?.dosageId}
                          onValueChange={(value) =>
                            handleDosageAndSubscriptionDurationChange(
                              config?.productId,
                              "dosage",
                              value
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {generateDosageOptions(config?.productId)?.map(
                              (option: any) => (
                                <SelectItem
                                  key={option?.id}
                                  value={option?.id}
                                >
                                  {`${option?.name}`}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Subscription Plan
                        </label>
                        <Select
                          value={config?.subscriptionDuration}
                          onValueChange={(value) =>
                            handleDosageAndSubscriptionDurationChange(
                              config?.productId,
                              "subscriptionDuration",
                              value
                            )
                          }
                          disabled={!config?.dosageId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {generateSubscriptionDurationOptions(
                              config?.productId
                            )?.map((option: any) => (
                              <SelectItem
                                key={option?._id}
                                value={option?.duration?.value?.toString()}
                              >
                                {`${option?.duration?.value} ${option?.duration?.unit}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })} */}


            {/* Monthly Wellness Program Info */}
            <Card className="bg-muted/30 border-muted/60">
              <CardHeader className="px-4 py-3 space-y-0">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-muted p-2">
                    <Stethoscope className="h-4 w-4 theme-text-primary" />
                  </div>

                  <div className="space-y-1">
                    <CardTitle className="text-base leading-6">
                      Monthly Wellness Program
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Includes access to licensed medical providers, consultations,
                      and personalized care plans.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-4 pt-0 pb-4">
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Treatment protocols are determined by a licensed provider when
                  appropriate.
                </div>
              </CardContent>
            </Card>

            {/* Coupon Code Section */}
            <CouponCodeSection
              couponCode={couponCode}
              isValidateCouponLoading={isValidateCouponLoading}
              appliedCoupon={appliedCoupon}
              handleCouponCodeChange={handleCouponCodeChange}
              handleApplyCoupon={handleApplyCoupon}
              handleClearCoupon={handleClearCoupon}
            />

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${totalPrice?.toFixed(DIGITS_AFTER_DECIMALS)}</span>
              </div>
              {appliedCoupon?.code ? (
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>${discountApplied?.toFixed(DIGITS_AFTER_DECIMALS)}</span>
                </div>
              ) : null}
              {/* <div className="flex justify-between text-sm">
              <span>Consultation fee:</span>
              <span>${CONSULTATION_FEE}</span>
            </div> */}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>
                  $
                  {discountedTotalPrice?.toFixed(DIGITS_AFTER_DECIMALS) ||
                    totalPrice?.toFixed(DIGITS_AFTER_DECIMALS)}
                </span>
              </div>
            </div>

            {/* Complete Purchase Button */}
            <Button
              onClick={_handleSubmit}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-lg font-medium"
              disabled={
                isCheckoutLoading ||
                isProcessing
              }
              style={{
                backgroundColor: merchantData?.customizeBranding?.accentColor,
              }}
            >
              {isCheckoutLoading || isProcessing
                ? "Processing..."
                : "Complete Payment"}
            </Button>

            {/* Security Information */}
            <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
              <Shield className="h-4 w-4 mr-2" />
              Secure 256-bit SSL encryption
            </div>
          </CardContent>
        </Card>
      </div >
    </>
  );
};

export default OrderSummarySection;