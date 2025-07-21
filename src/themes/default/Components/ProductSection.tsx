"use client";

import React, { useState } from "react";
import ProductDetailsSection from "./ProductDetailsSection";
import ProductPurchaseSection from "./ProductPurchaseSection";
import { Product } from "@/types/products";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";

const ProductSection = ({ product }: { product: Product }) => {
  const { navigateBack } = useNavigationState();
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    string[]
  >([]);

  const _handleRelatedProductToggle = (productId: string) => {
    setSelectedRelatedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const relatedProductsTotal = 0;

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
          relatedProductsTotal={relatedProductsTotal}
        />
      </div>
    </>
  );
};

export default ProductSection;
