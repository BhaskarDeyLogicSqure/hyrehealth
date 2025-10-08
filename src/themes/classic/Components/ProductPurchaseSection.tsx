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
import { DIGITS_AFTER_DECIMALS } from "@/configs";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ProductPurchaseSection = ({
  product,
  selectedRelatedProducts,
  relatedProductsTotal,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  relatedProductsTotal: number;
}) => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );
  const {
    selectedDosageId,
    subscriptionDuration,
    selectedDosageWithDuration,
    generateDosageOptions,
    generateSubscriptionDurationOptions,
    getTotalPrice,
    isCheckoutLoading,
    handleProceedToCheckout,
    handleDosageAndSubscriptionDurationChange,
  } = useProductPurchaseSection({
    product,
    selectedRelatedProducts,
    relatedProductsTotal,
  });
  const { isNavigatingTo } = useNavigationState();

  const isLoading = isCheckoutLoading || isNavigatingTo("/checkout");

  return (
    <div>
      <Card className="sticky top-24">
        
        <CardContent className="p-8">
          {/* Price Display at Top */}
          <div className="mb-8">
            <div className="flex items-baseline justify-start gap-2 mb-2">
              <span className="text-4xl font-bold theme-text-primary">
                {selectedDosageWithDuration?.price
                  ? `$${selectedDosageWithDuration?.price?.toFixed(
                      DIGITS_AFTER_DECIMALS
                    )}`
                  : "$89"}
              </span>
              <span className="text-lg theme-text-muted">per month</span>
            </div>
            <p className="text-sm theme-text-muted">
              Subscription includes medical consultation and ongoing support
            </p>
          </div>

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

          {/* Cost Breakdown */}
          <div className="space-y-3 mb-6 bg-muted/90 p-4 rounded-lg">
            <div className="flex justify-between text-sm theme-text-muted">
              <span>Subtotal:</span>
              <span>
                {selectedDosageWithDuration?.price
                  ? `$${selectedDosageWithDuration?.price?.toFixed(
                      DIGITS_AFTER_DECIMALS
                    )}`
                  : "$89"}
              </span>
            </div>

            <div className="flex justify-between text-sm theme-text-muted">
              <span>Consultation Fee:</span>
              <span>Included</span>
            </div>

            {selectedRelatedProducts?.length > 0 &&
            (relatedProductsTotal || relatedProductsTotal === 0) ? (
              <div className="flex justify-between text-sm theme-text-muted">
                <span>Related products:</span>
                <span>
                  ${relatedProductsTotal?.toFixed(DIGITS_AFTER_DECIMALS)}
                </span>
              </div>
            ) : null}

            <Separator />
            <div className="flex justify-between text-lg font-bold theme-text-primary">
              <span>Total:</span>
              <span>
                {getTotalPrice
                  ? `$${getTotalPrice?.toFixed(DIGITS_AFTER_DECIMALS)}`
                  : "$89"}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full text-lg py-6"
            onClick={handleProceedToCheckout}
            disabled={!selectedDosageId || !subscriptionDuration || isLoading}
            style={{
              backgroundColor: merchantData?.customizeBranding?.accentColor,
            }}
          >
            {isLoading ? (
              <ThemeLoader
                type="inline"
                variant="simple"
                size="sm"
                message="Proceeding to checkout..."
                className="gap-2"
                inlineSimpleVariantStyles={{
                  color: "white",
                }}
              />
            ) : (
              "Proceed to Checkout"
            )}
          </Button>

          {/* Trust Indicators */}
          {/* <div className="mt-6 space-y-3">
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
          </div> */}

          {/* Important Disclaimers */}
          <div className="mt-6 space-y-2">
            <div className="flex items-start text-xs theme-text-muted">
              <Shield className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span>Prescription required. Medical consultation included with purchase.</span>
            </div>
            <div className="flex items-start text-xs theme-text-muted">
              <Shield className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span>All treatments are FDA-approved and sourced from licensed pharmacies.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPurchaseSection;
