"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "../GlobalErrorHandler";
import { Separator } from "@/components/ui/separator";
import { useCheckoutQuestionnaire } from "@/hooks/useCheckoutQuestionnaire";
import useOrderCheckout from "@/hooks/useOrderCheckout";
import { useCheckout } from "@/hooks/useCheckout";
import { DIGITS_AFTER_DECIMALS } from "@/configs";
import useChekoutApi from "@/api/checkout/useChekoutApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/actions/authAction";
import { useCookies } from "@/hooks/useCookies";
import { isUserAuthenticated } from "@/utils/auth";
import CouponCodeSection from "./CouponCodeSection";
const OrderSummarySection = ({
  isProcessing,
  fieldValidation,
  handleGetPayload,
  generateToken,
}: {
  isProcessing: boolean;
  handleGetPayload: (e: React.FormEvent) => Promise<any>;
  generateToken: any;
  fieldValidation: {
    ccnumber: boolean;
    ccexp: boolean;
    cvv: boolean;
  };
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setCookie } = useCookies();
  const { clearCheckout } = useCheckout();
  const { signUpWithPayment, loginOrderCheckout } = useChekoutApi();

  // check if the user is logged in
  const isUserLoggedIn = isUserAuthenticated();

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

  console.log("1111", { fieldValidation });
  const _handleSubmit = async (e: React.FormEvent) => {
    try {
      if (e) e.preventDefault();
      setIsCheckoutLoading(true);

      // if (
      //   !fieldValidation?.ccnumber ||
      //   !fieldValidation?.ccexp ||
      //   !fieldValidation?.cvv
      // ) {
      //   showErrorToast("Please fill all the payment fields");
      // }

      // handle payment - generate payment token and wait for it
      const generatedPaymentToken = await generateToken();
      console.log("generatedPaymentToken", generatedPaymentToken);

      // get payload for payment details
      const { error, payload } = await handleGetPayload(e);

      // return if no payload present or no questionnaire responses are present or payment fields are not filled
      if (
        error ||
        !payload ||
        !fieldValidation?.ccnumber ||
        !fieldValidation?.ccexp ||
        !fieldValidation?.cvv ||
        !generatedPaymentToken
      )
        return;

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

      // add the coupon info to the payload
      if (appliedCoupon?.code) {
        payload["paymentInfo"]["couponCode"] = appliedCoupon?.code;
      }

      if (generatedPaymentToken) {
        payload["paymentInfo"]["paymentToken"] = generatedPaymentToken;
      }

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

      // Mock successful checkout
      console.log("Final payload:", payload);

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
        setCookie("token", response?.data?.token);

        // Update Redux store with user details (initiating login)
        dispatch(setUser(response?.data?.customer));

        showSuccessToast("Order Placed Successfully! Welcome to HyreHealth!");
      } else {
        showSuccessToast("Order Placed Successfully");
      }

      clearCheckout(); // clear the checkout data after successful checkout
      // Navigate to thank you page after successful checkout
      router.replace(
        `/thank-you?orderId=${response?.data?.invoice?.invoiceNumber}`
      );
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

  return (
    <div>
      <Card className="sticky top-24 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Details Section */}
          {productConfigurations?.map((config) => {
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
              <Card key={config?.productId} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {product?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isMainProduct ? "Primary Product" : "Add-on Product"}
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
                              <SelectItem key={option?.id} value={option?.id}>
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
          })}

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
            disabled={isCheckoutLoading || isProcessing}
          >
            {isCheckoutLoading || isProcessing
              ? "Processing..."
              : "Complete Purchase"}
          </Button>

          {/* Security Information */}
          <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
            <Shield className="h-4 w-4 mr-2" />
            Secure 256-bit SSL encryption
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummarySection;
