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
import { CONSULTATION_FEE, DIGITS_AFTER_DECIMALS } from "@/configs";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAllowPatientSelectDosage from "@/hooks/useAllowPatientSelectDosage";
import { formatPriceRange, getProductPriceRange } from "@/lib/utils";

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
  const allowPatientSelectDosage = useAllowPatientSelectDosage();
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
    allowPatientSelectDosage,
  });
  const { isNavigatingTo } = useNavigationState();

  const isCurrentFlow = !allowPatientSelectDosage;
  const priceRange = getProductPriceRange(product);

  const isLoading = isCheckoutLoading || isNavigatingTo("/checkout");

  return (
    <div>
      <Card className="sticky top-24">
        <CardContent className="p-8">
          {/* Price Display — "current" flow shows the range (like the products page) */}
          {isCurrentFlow ? (
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold theme-text-primary">
                  {priceRange ? formatPriceRange(priceRange) : "-"}
                </span>
                <span className="text-sm theme-text-muted">per month</span>
              </div>
            </div>
          ) : null}

          {/* Dosage Selection — hidden in the "current" flow (final dosage is
              set by the provider during the consultation) */}
          {!isCurrentFlow ? (
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
          ) : null}

          {/* Subscription Duration (only when patient selects: pay exact combo price) */}
          {allowPatientSelectDosage ? (
            <div className="mb-6">
              <label className="block text-sm font-medium theme-text-primary mb-2">
                Subscription Duration*
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
                      value={option?.duration?.value?.toString()}
                    >
                      {`${option?.duration?.value} ${option?.duration?.unit}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <Separator className="my-6" />

          {/* Pricing */}
          <div className="space-y-3 mb-6">
            {isCurrentFlow ? (
              <>
                <div className="flex justify-between text-sm theme-text-muted">
                  <span>Consultation Fee:</span>
                  <span>
                    ${CONSULTATION_FEE?.toFixed(DIGITS_AFTER_DECIMALS)}
                  </span>
                </div>

                <Separator />
                <div className="flex justify-between text-lg font-semibold theme-text-primary">
                  <span>Total:</span>
                  <span>
                    ${CONSULTATION_FEE?.toFixed(DIGITS_AFTER_DECIMALS)}
                  </span>
                </div>

                <p className="text-xs text-red-600 leading-relaxed">
                  This ${CONSULTATION_FEE} is for your medical consultation only.
                  Your medication is billed separately after the consultation,
                  based on the dosage your provider prescribes.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm theme-text-muted">
                  <span>Price:</span>
                  <span>
                    {selectedDosageWithDuration?.price
                      ? `$${selectedDosageWithDuration?.price?.toFixed(
                          DIGITS_AFTER_DECIMALS
                        )}`
                      : "-"}
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
                <div className="flex justify-between text-lg font-semibold theme-text-primary">
                  <span>Total:</span>
                  <span>
                    {getTotalPrice
                      ? `$${getTotalPrice?.toFixed(DIGITS_AFTER_DECIMALS)}`
                      : "-"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* CTA Button */}
          <Button
            className="w-full text-lg py-6"
            onClick={handleProceedToCheckout}
            disabled={
              (!isCurrentFlow && (!selectedDosageId || !subscriptionDuration)) ||
              isLoading
            }
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
