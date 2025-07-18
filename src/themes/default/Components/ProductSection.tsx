"use client";

import React, { useEffect, useState } from "react";
import ProductDetailsSection from "./ProductDetailsSection";
import ProductPurchaseSection from "./ProductPurchaseSection";
import { Product } from "@/types/products";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";

const ProductSection = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { navigateBack } = useNavigationState();
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    string[]
  >([]);
  const [selectedDosage, setSelectedDosage] = useState("");
  const [subscriptionDuration, setSubscriptionDuration] = useState("1");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  // Simulate consultation status check
  const [hasValidConsultation, setHasValidConsultation] = useState(false);

  const _handleRelatedProductToggle = (productId: string) => {
    setSelectedRelatedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const _handleProceedToCheckout = async () => {
    if (!selectedDosage) {
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
      `/eligibility-questionnaire/?productId=${product?._id}&dosage=${selectedDosage}&duration=${subscriptionDuration}${relatedProductsParam}`
    );

    // Note: setIsCheckoutLoading(false) is not needed here as we're navigating away
  };

  const selectedDosagePrice = 20;
  // product.dosages.find((d) => d.value === selectedDosage)?.price ||
  // product.basePrice;

  const relatedProductsTotal = 100;
  //   selectedRelatedProducts.reduce(
  //     (total, productId) => {
  //       const relatedProduct = relatedProducts.find(
  //         (p) => p.id.toString() === productId
  //       );
  //       return total + (relatedProduct?.price || 0);
  //     },
  //     0
  //   );

  const totalPrice =
    (selectedDosagePrice + relatedProductsTotal) *
    parseInt(subscriptionDuration);

  const _handleDosageChange = (value: string) => {
    setSelectedDosage(value);
  };

  const _handleBackClick = () => {
    // Use the navigation utility to go back with preserved state
    navigateBack(
      [
        NAVIGATION_KEYS.LAST_PRODUCTS_PAGE,
        NAVIGATION_KEYS.LAST_CATEGORIES_PAGE,
      ],
      "/products"
    );
  };

  useEffect(() => {
    // Check consultation status (mock implementation)
    const lastConsultation = localStorage.getItem("lastConsultation");
    if (lastConsultation) {
      const consultDate = new Date(lastConsultation);
      const expiryDate = new Date(
        consultDate.getTime() + 90 * 24 * 60 * 60 * 1000
      ); // 90 days
      const now = new Date();

      if (now < expiryDate) {
        setHasValidConsultation(true);
      }
    }
  }, []);

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={_handleBackClick}
          className="inline-flex items-center gap-2 theme-text-primary hover:theme-bg-muted transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          {/* Back to Products */}
          Back
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Product Image & Info */}
        <ProductDetailsSection
          product={product}
          selectedRelatedProducts={selectedRelatedProducts}
          handleRelatedProductToggle={_handleRelatedProductToggle}
        />

        {/* Right Column - Purchase Options */}
        <ProductPurchaseSection
          product={product}
          selectedRelatedProducts={selectedRelatedProducts}
          hasValidConsultation={hasValidConsultation}
          selectedDosage={selectedDosage}
          totalPrice={totalPrice}
          subscriptionDuration={subscriptionDuration}
          selectedDosagePrice={selectedDosagePrice}
          relatedProductsTotal={relatedProductsTotal}
          handleProceedToCheckout={_handleProceedToCheckout}
          handleDosageChange={_handleDosageChange}
          setSubscriptionDuration={setSubscriptionDuration}
          isCheckoutLoading={isCheckoutLoading}
        />
      </div>
    </>
  );
};

export default ProductSection;
