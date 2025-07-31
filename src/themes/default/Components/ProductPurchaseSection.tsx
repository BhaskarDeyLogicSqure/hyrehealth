"use client";

import { Card } from "@/components/ui/card";
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
import useProductPurchaseSection from "@/hooks/useProductPurchaseSection";
import { useNavigationState } from "@/hooks/useNavigationState";
const ProductPurchaseSection = ({
  product,
  selectedRelatedProducts,
  relatedProductsTotal,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  relatedProductsTotal: number;
}) => {
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
    product,
    selectedRelatedProducts,
    relatedProductsTotal,
  });
  const { isNavigatingTo } = useNavigationState();

  const isLoading = isCheckoutLoading || isNavigatingTo("/checkout");

  console.log({ isLoading, isCheckoutLoading });

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
                handleDosageAndSubscriptionDurationChange("dosage", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose dosage" />
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

          {/* Subscription Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium theme-text-primary mb-2">
              Subscription Duration
            </label>
            <Select
              value={subscriptionDuration}
              onValueChange={(value) =>
                handleDosageAndSubscriptionDurationChange(
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
                {generateSubscriptionDurationOptions?.map((option: any) => (
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

            {selectedRelatedProducts?.length > 0 &&
            (relatedProductsTotal || relatedProductsTotal === 0) ? (
              <div className="flex justify-between text-sm theme-text-muted">
                <span>Related products:</span>
                <span>${relatedProductsTotal}</span>
              </div>
            ) : null}

            <Separator />
            <div className="flex justify-between text-lg font-semibold theme-text-primary">
              <span>Total:</span>
              <span>${getTotalPrice}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full text-lg py-6"
            onClick={handleProceedToCheckout}
            disabled={!selectedDosageId || !subscriptionDuration || isLoading}
          >
            {isLoading ? (
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
