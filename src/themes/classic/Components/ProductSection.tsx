"use client";

import React, { useState } from "react";
import ProductDetailsSection from "../Components/ProductDetailsSection";
import ProductPurchaseSection from "../Components/ProductPurchaseSection";
import { Product } from "@/types/products";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";
import ThemeLoader from "@/components/ThemeLoader";

// Define interface for related product selections with default dosage/duration
interface RelatedProductSelection {
  productId: string;
  product: Product;
  selectedOption: {
    dosageId: string;
    dosageStrength: number;
    duration: number;
    price: number;
  };
}

const ProductSection = ({ product }: { product: Product }) => {
  const { navigateBack, isNavigating } = useNavigationState();
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    RelatedProductSelection[]
  >([]);

  // Function to auto-select default dosage and duration for a related product
  const getDefaultSelectionForProduct = (
    relatedProduct: any
  ): RelatedProductSelection["selectedOption"] | null => {
    if (!relatedProduct?.pricing?.subscriptionOptions) {
      return {
        dosageId: "",
        dosageStrength: 0,
        duration: 1,
        price: relatedProduct?.pricing?.basePrice || 0,
      };
    }

    // Find the default dosage option
    const defaultDosageOption = relatedProduct.pricing.subscriptionOptions.find(
      (option: any) => option?.isDefault === true
    );

    if (!defaultDosageOption) {
      // Fallback to first available option
      const firstOption = relatedProduct.pricing.subscriptionOptions[0];
      return {
        dosageId: firstOption?._id || firstOption?.id || "",
        dosageStrength: firstOption?.strength || 0,
        duration: firstOption?.duration?.value || 1,
        price: firstOption?.price || relatedProduct?.pricing?.basePrice || 0,
      };
    }

    // Find default duration for the selected dosage
    const defaultDurationOption =
      relatedProduct.pricing.subscriptionOptions.find(
        (option: any) =>
          option?.strength === defaultDosageOption.strength &&
          option?.isDefault === true
      );

    return {
      dosageId: defaultDosageOption._id || defaultDosageOption.id,
      dosageStrength: defaultDosageOption.strength,
      duration:
        defaultDurationOption?.duration?.value ||
        defaultDosageOption?.duration?.value ||
        1,
      price:
        defaultDurationOption?.price ||
        defaultDosageOption?.price ||
        relatedProduct?.pricing?.basePrice ||
        0,
    };
  };

  const _handleRelatedProductToggle = (productId: string) => {
    setSelectedRelatedProducts((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex >= 0) {
        // Remove the product
        return prev.filter((item) => item.productId !== productId);
      } else {
        // Add the product with default selections
        const relatedProduct = product?.similarProducts?.find(
          (p: any) => p._id === productId
        );

        if (!relatedProduct) return prev;

        const defaultSelection = getDefaultSelectionForProduct(relatedProduct);

        if (!defaultSelection) return prev;

        const newSelection: RelatedProductSelection = {
          productId,
          product: relatedProduct,
          selectedOption: defaultSelection,
        };

        return [...prev, newSelection];
      }
    });
  };

  // Calculate total price for related products
  const relatedProductsTotal = selectedRelatedProducts?.reduce(
    (total, selection) => {
      return total + (selection?.selectedOption?.price || 0);
    },
    0
  );

  // Convert to simple product ID array for compatibility with existing components
  const selectedRelatedProductIds = selectedRelatedProducts?.map(
    (item) => item?.productId
  );

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
          disabled={isNavigating}
        >
          {isNavigating ? (
            <ThemeLoader
              type="inline"
              variant="simple"
              size="sm"
              message="Going back..."
              className="gap-2"
            />
          ) : (
            <>
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Backasfasd
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Product Image & Info */}
        <ProductDetailsSection
          product={product}
          selectedRelatedProducts={selectedRelatedProductIds}
          handleRelatedProductToggle={_handleRelatedProductToggle}
        />

        {/* Right Column - Purchase Options */}
        <ProductPurchaseSection
          product={product}
          selectedRelatedProducts={selectedRelatedProductIds}
          relatedProductsTotal={relatedProductsTotal}
        />
      </div>
    </>
  );
};

export default ProductSection;
