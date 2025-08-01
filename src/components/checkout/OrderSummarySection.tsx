"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Tag, Trash2, X, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "../GlobalErrorHandler";
import { Separator } from "@/components/ui/separator";
import { useCheckoutQuestionnaire } from "@/hooks/useCheckoutQuestionnaire";
import useOrderCheckout from "@/hooks/useOrderCheckout";
import { useCheckout } from "@/hooks/useCheckout";
import { DIGITS_AFTER_DECIMALS } from "@/configs";
import useChekoutApi from "@/api/checkout/useChekoutApi";
import ThemeLoader from "../ThemeLoader";

const OrderSummarySection = ({
  handleGetPayload,
}: {
  handleGetPayload: (e: React.FormEvent) => Promise<any>;
}) => {
  const router = useRouter();
  const { clearCheckout } = useCheckout();
  const { signUpWithPayment } = useChekoutApi();

  const {
    eligibleProducts,
    isFromQuestionnaire,
    selectedRelatedProducts,
    questionnaire,
  } = useCheckoutQuestionnaire();

  console.log({ eligibleProducts, questionnaire });

  const {
    productConfigurations,
    selectedProducts,
    isCheckoutLoading,
    totalPrice,
    discountedTotalPrice,
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
    product: eligibleProducts?.[0]?.product, // it is the main product
    initialMainProductSelectedOption: eligibleProducts?.[0]?.selectedOption, // it is the initial selected option for the main product, can be changed later on user interaction
    selectedRelatedProducts, // it is the list of all related products (if any)
  });

  const _handleSubmit = async (e: React.FormEvent) => {
    try {
      if (e) e.preventDefault();
      setIsCheckoutLoading(true);

      // get payload for payment details
      const { error, payload } = await handleGetPayload(e);

      // return if no payload present or no questionnaire responses are present
      if (error || !payload || !questionnaire?.generalResponses?.length) return;

      const invalidProducts = productConfigurations?.filter(
        (config) => !config?.dosageId || !config?.subscriptionDuration
      );

      if (invalidProducts?.length > 0) {
        alert(
          "Please select valid dosage and duration for all selected products"
        );
        return;
      }

      // add the price info to the payload
      payload["paymentInfo"]["finalAmount"] = totalPrice; // this will be the final amount after applying the coupon

      // add the coupon info to the payload
      if (appliedCoupon?.code) {
        payload["paymentInfo"]["couponCode"] = appliedCoupon?.code;
      }

      //  now update the payload with product configurations
      if (productConfigurations?.length > 0) {
        payload["paymentInfo"]["products"] = productConfigurations?.map(
          (config) => {
            return {
              productId: config?.productId || undefined,
              strength: config?.strength || undefined,
              subscriptionOptionId: config?.dosageId || undefined,
            };
          }
        );
      }

      // now update the payload with questionnaire responses
      if (questionnaire?.generalResponses?.length > 0) {
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
      const response = await signUpWithPayment(payload);

      showSuccessToast("Order Placed Successfully");

      // Navigate to thank you page after successful checkout
      router.push(`/thank-you?order=${response?.data?.invoice?.invoiceNumber}`);
      clearCheckout(); // clear the checkout data after successful checkout
    } catch (error) {
      console.error(error);
    } finally {
      //  no need to set isCheckoutLoading to false as we are moving to a new route from here after successful checkout
      setIsCheckoutLoading(false);
    }
  };

  // If not from questionnaire, show empty state or redirect
  if (
    !isFromQuestionnaire ||
    !eligibleProducts ||
    eligibleProducts?.length === 0
  ) {
    // redirect to products page after 5 seconds
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (seconds === 0) {
          router.push("/products");
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }, [seconds]);

    return (
      <div>
        <Card className="sticky top-24 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <p>No eligible products found.</p>
              <p className="text-sm mt-2">
                Please add products to your cart first.
              </p>

              <Button
                variant="outline"
                className="mt-4 theme-btn bg-brand-dark-blue text-white"
                onClick={() => router.push("/products")}
              >
                Explore Products
              </Button>

              <div className="mt-4">
                Redirecting to products page in{" "}
                <span className="font-bold">{seconds}</span> seconds...
                <span className="ml-2"></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              (item) => item?.product?._id === config.productId
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
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Coupon Code</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => handleCouponCodeChange(e)}
                  className="flex-1"
                  disabled={isValidateCouponLoading}
                  onKeyDown={(e) => {
                    console.log({ e });
                    if (e.key === "Enter") {
                      handleApplyCoupon();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  className="px-4"
                  disabled={isValidateCouponLoading}
                >
                  {isValidateCouponLoading ? (
                    <>
                      Applying <ThemeLoader type="inline" variant="simple" />
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {appliedCoupon?.code && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                    <Ticket className="h-3 w-3" />
                    <span>{appliedCoupon?.code}</span>
                    <button
                      onClick={handleClearCoupon}
                      className="ml-1 hover:bg-white rounded-full p-0.5 transition-colors"
                      title="Remove coupon"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${totalPrice?.toFixed(DIGITS_AFTER_DECIMALS)}</span>
            </div>
            {appliedCoupon?.code ? (
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>
                  ${appliedCoupon?.discount?.toFixed(DIGITS_AFTER_DECIMALS)}
                </span>
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
            disabled={isCheckoutLoading}
          >
            {isCheckoutLoading ? "Processing..." : "Complete Purchase"}
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
