"use client";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import React from "react";
import { CardContent } from "@/components/ui/card";
import { AlertDescription } from "@/components/ui/alert";
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

const ProductPurchaseSection = ({
  product,
  selectedRelatedProducts,
  hasValidConsultation,
  selectedDosage,
  totalPrice,
  subscriptionDuration,
  selectedDosagePrice,
  relatedProductsTotal,
  handleDosageChange,
  setSubscriptionDuration,
  handleProceedToCheckout,
  isCheckoutLoading = false,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  hasValidConsultation: boolean;
  selectedDosage: string;
  totalPrice: number;
  subscriptionDuration: string;
  selectedDosagePrice: number;
  relatedProductsTotal: number;
  handleDosageChange: (value: string) => void;
  setSubscriptionDuration: (value: string) => void;
  handleProceedToCheckout: () => void;
  isCheckoutLoading?: boolean;
}) => {
  return (
    <div>
      <Card className="sticky top-24">
        <CardContent className="p-8">
          {/* Consultation Status - only show if no valid consultation */}
          {!hasValidConsultation && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Consultation required before purchase</strong>
                <br />
                Complete our questionnaire and medical intake form to proceed
              </AlertDescription>
            </Alert>
          )}

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
            <Select value={selectedDosage} onValueChange={handleDosageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose dosage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.25mg">0.25mg - Starter Dose</SelectItem>
                <SelectItem value="0.5mg">0.5mg - Standard Dose</SelectItem>
                <SelectItem value="1mg">1mg - Maintenance Dose</SelectItem>
                <SelectItem value="2.4mg">2.4mg - Maximum Dose</SelectItem>
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
              onValueChange={setSubscriptionDuration}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="3">3 Months (5% discount)</SelectItem>
                <SelectItem value="6">6 Months (10% discount)</SelectItem>
                <SelectItem value="12">12 Months (15% discount)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-6" />

          {/* Pricing */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm theme-text-muted">
              <span>Monthly price:</span>
              <span>${selectedDosagePrice}</span>
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
                {subscriptionDuration} month
                {subscriptionDuration !== "1" ? "s" : ""}
              </span>
            </div>
            {!hasValidConsultation && (
              <div className="flex justify-between text-sm theme-text-muted">
                <span>Consultation fee:</span>
                <span>$49</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold theme-text-primary">
              <span>Total:</span>
              <span>${totalPrice + (hasValidConsultation ? 0 : 49)}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full text-lg py-6"
            onClick={handleProceedToCheckout}
            disabled={!selectedDosage || isCheckoutLoading}
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
