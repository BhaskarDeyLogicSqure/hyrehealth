"use client";

import { Card } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Clock, Truck, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/products";
import ThemeLoader from "@/components/ThemeLoader";
import router from "next/router";

const ProductPurchaseSection = ({
  product,
  selectedRelatedProducts,
  relatedProductsTotal,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  relatedProductsTotal: number;
}) => {
  const [selectedDosageId, setSelectedDosageId] = useState<string>("");
  const [subscriptionDuration, setSubscriptionDuration] = useState<string>("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const _generateDosageOptions = useMemo(() => {
    // Extract unique strength options from subscriptionOptions
    const seenStrengths = new Set();
    const dosageOptions = product?.pricing?.subscriptionOptions
      // filter out options with the same strength
      ?.filter((option) => {
        if (!option?.strength || seenStrengths?.has(option?.strength))
          return false;
        seenStrengths?.add(option?.strength);
        return true;
      })
      ?.sort((a, b) => a?.strength - b?.strength) // sort by strength in ascending order
      ?.map((option) => ({
        id: option?.id,
        name: `${option?.strength}mg`,
      }));

    return dosageOptions;
  }, [product]);

  const _generateSubscriptionDurationOptions = useMemo(() => {
    const selectedDosageOptionStrength =
      product?.pricing?.subscriptionOptions?.find(
        (option) => option?._id === selectedDosageId
      )?.strength;

    const durationOptions = product?.pricing?.subscriptionOptions
      ?.filter((option) => option?.strength === selectedDosageOptionStrength)
      ?.sort((a, b) => a?.duration?.value - b?.duration?.value);

    return durationOptions;
  }, [selectedDosageId, product]);

  const selectedDosageWithDuration = useMemo(() => {
    if (!selectedDosageId || !subscriptionDuration) return null;

    // get the strength of the selected dosage as this is used to filter the duration options
    const selectedDosageStrength = product?.pricing?.subscriptionOptions?.find(
      (option) => option?._id === selectedDosageId
    )?.strength;

    // find the dosage that matches the selected dosage strength and duration
    return product?.pricing?.subscriptionOptions?.find(
      (option) =>
        option?.strength === selectedDosageStrength &&
        option?.duration?.value === Number(subscriptionDuration)
    );
  }, [selectedDosageId, subscriptionDuration, product]);

  const _getTotalPrice = useMemo(() => {
    // total price = price of selected dosage * duration + total price of related products
    const totalPrice =
      selectedDosageWithDuration?.price + relatedProductsTotal || 0;

    return totalPrice;
  }, [selectedDosageWithDuration, relatedProductsTotal]);

  const _handleDosageAndSubscriptionDurationChange = (
    type: "dosage" | "subscriptionDuration",
    value: any
  ) => {
    if (type === "dosage") {
      setSelectedDosageId(value);
      setSubscriptionDuration("");
    } else if (type === "subscriptionDuration") {
      setSubscriptionDuration(value);
    }
  };

  const _handleProceedToCheckout = async () => {
    if (!selectedDosageId || !subscriptionDuration) {
      alert("Please select a dosage first");
      return;
    }

    setIsCheckoutLoading(true);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Build URL with selected products
    const relatedProductsParam =
      selectedRelatedProducts.length > 0
        ? `&relatedProducts=${selectedRelatedProducts.join(",")}`
        : "";

    router.push(
      `/eligibility-questionnaire/?productId=${product?._id}&dosage=${selectedDosageWithDuration?.strength}&duration=${selectedDosageWithDuration?.duration?.value}${relatedProductsParam}`
    );

    // Note: setIsCheckoutLoading(false) is not needed here as we're navigating away
  };

  return (
    <div>
      <Card className="sticky top-24">
        <CardContent className="p-8">
          {/* Consultation Status - only show if no valid consultation */}

          {/* Price Header */}
          {/* <div className="text-center mb-6">
            <div className="text-3xl font-bold theme-text-primary">
              ${product?.pricing?.basePrice}
            </div>
            <div className="theme-text-muted">per month</div>
          </div> */}

          {/* Dosage Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium theme-text-primary mb-2">
              Select Dosage*
            </label>
            <Select
              value={selectedDosageId}
              onValueChange={(value) =>
                _handleDosageAndSubscriptionDurationChange("dosage", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose dosage" />
              </SelectTrigger>
              <SelectContent>
                {_generateDosageOptions?.map((option) => (
                  <SelectItem key={option?.id} value={option?.id}>
                    {`${option?.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium theme-text-primary mb-2">
              Subscription Duration
            </label>
            <Select
              value={subscriptionDuration}
              onValueChange={(value) =>
                _handleDosageAndSubscriptionDurationChange(
                  "subscriptionDuration",
                  value
                )
              }
              disabled={!selectedDosageId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {_generateSubscriptionDurationOptions?.map((option) => (
                  <SelectItem
                    key={option?._id}
                    value={option?.duration?.value.toString()}
                  >
                    {`${option?.duration?.value} ${option?.duration?.unit}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-6" />

          {/* Pricing */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm theme-text-muted">
              <span>Monthly price:</span>
              <span>
                {selectedDosageWithDuration?.price
                  ? `$${selectedDosageWithDuration?.price}`
                  : "-"}
              </span>
            </div>

            {selectedRelatedProducts.length > 0 && (
              <div className="flex justify-between text-sm theme-text-muted">
                <span>Related products:</span>
                <span>${relatedProductsTotal}</span>
              </div>
            )}
            <div className="flex justify-between text-sm theme-text-muted">
              <span>Duration:</span>
              <span>
                {subscriptionDuration
                  ? `${subscriptionDuration} month${
                      subscriptionDuration > "2" ? "s" : ""
                    }`
                  : "-"}
              </span>
            </div>

            <Separator />
            <div className="flex justify-between text-lg font-semibold theme-text-primary">
              <span>Total:</span>
              <span>${_getTotalPrice}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full text-lg py-6"
            onClick={_handleProceedToCheckout}
            disabled={
              !selectedDosageId || !subscriptionDuration || isCheckoutLoading
            }
          >
            {isCheckoutLoading ? (
              <ThemeLoader
                type="inline"
                variant="simple"
                size="sm"
                message="Proceeding to checkout..."
                className="gap-2"
              />
            ) : (
              "Proceed to Checkout"
            )}
          </Button>

          {/* Trust Indicators */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm theme-text-muted">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              FDA approved ingredients
            </div>
            <div className="flex items-center text-sm theme-text-muted">
              <Truck className="h-4 w-4 mr-2 text-blue-600" />
              Free shipping & discrete packaging
            </div>
            <div className="flex items-center text-sm theme-text-muted">
              <Clock className="h-4 w-4 mr-2 text-purple-600" />
              Licensed physician consultation
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs theme-text-muted">
              <strong>Important:</strong> This medication requires a valid
              prescription. Our licensed physicians will review your health
              information and determine if this treatment is appropriate for
              you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPurchaseSection;
