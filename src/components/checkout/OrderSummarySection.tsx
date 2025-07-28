import React, { useMemo, useState } from "react";
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
import { X, Shield, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CONSULTATION_FEE } from "@/configs";
import { useCheckoutQuestionnaire } from "@/hooks/useCheckoutQuestionnaire";
import { Product } from "@/types/products";
import useProductPurchaseSection from "@/hooks/useProductPurchaseSection";
const OrderSummarySection = ({ formFields }: { formFields: any }) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const {
    eligibleProducts,
    isFromQuestionnaire,
    selectedRelatedProducts,
    relatedProductsTotalCost,
  } = useCheckoutQuestionnaire();

  console.log({ eligibleProducts });

  const {
    selectedDosageId,
    subscriptionDuration,
    selectedDosageWithDuration,
    handleDosageAndSubscriptionDurationChange,
    generateDosageOptions,
    generateSubscriptionDurationOptions,
    getTotalPrice,
    handleProceedToCheckout,
    isCheckoutLoading,
  } = useProductPurchaseSection({
    product: eligibleProducts?.[0]?.product,
    selectedRelatedProducts,
    relatedProductsTotal: relatedProductsTotalCost,
  });

  const totalPrice = getTotalPrice;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      setCouponCode("");
    }
  };

  // If not from questionnaire, show empty state or redirect
  if (
    !isFromQuestionnaire ||
    !eligibleProducts ||
    eligibleProducts.length === 0
  ) {
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
                Please complete the questionnaire first.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = eligibleProducts?.reduce(
    (sum, product) => sum + (product?.selectedOption?.price || 0),
    0
  );

  return (
    <div>
      <Card className="sticky top-24 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Details Section */}
          {eligibleProducts?.map((productItem) => (
            <Card
              key={productItem?.product?._id}
              className="border border-gray-200"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {productItem?.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {productItem?.type === "main"
                        ? "Primary Product"
                        : "Add-on Product"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${productItem?.selectedOption?.price || 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${productItem?.selectedOption?.price} x{" "}
                      {productItem?.selectedOption?.duration} month
                      {productItem?.selectedOption?.duration !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Dosage
                    </label>
                    <Select
                      value={selectedDosageId}
                      onValueChange={(value) =>
                        handleDosageAndSubscriptionDurationChange(
                          "dosage",
                          value
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateDosageOptions?.map((option: any) => (
                          <SelectItem key={option?.id} value={option?.id}>
                            {`${option?.name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Subscription Plan
                    </label>
                    <Select
                      defaultValue={subscriptionDuration}
                      onValueChange={(value) =>
                        handleDosageAndSubscriptionDurationChange(
                          "subscriptionDuration",
                          value
                        )
                      }
                      disabled={!selectedDosageId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateSubscriptionDurationOptions?.map(
                          (option: any) => (
                            <SelectItem
                              key={option?._id}
                              value={option?.duration?.value.toString()}
                            >
                              {`${option?.duration?.value} ${option?.duration?.unit}`}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Remove button for add-on products */}
                {productItem?.type === "related" && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement remove functionality for related products
                        console.log(
                          "Remove product:",
                          productItem?.product?._id
                        );
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

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
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  className="px-4"
                >
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 text-sm text-green-600">
                  Coupon "{appliedCoupon}" applied
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Treatment cost:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Consultation fee:</span>
              <span>${CONSULTATION_FEE}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          {/* Complete Purchase Button */}
          <Button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-lg font-medium"
            disabled={!formFields?.acceptTerms}
          >
            Complete Purchase
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
