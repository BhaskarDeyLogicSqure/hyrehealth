"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";
import ThemeLoader from "@/components/ThemeLoader";
import { useRouter } from "next/navigation";

const BackButton = ({
  categoryName,
  categoryId,
  productName,
}: {
  categoryName: string;
  categoryId: string;
  productName: string;
}) => {
  const router = useRouter();
  const { navigateBack, isNavigating } = useNavigationState();

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

  const _handleCategoryClick = (categoryId: string) => {
    if (!categoryId) return;

    router.push(`/products?category=${categoryId}`);
  };

  const _moveToAllTreatments = () => {
    router.push("/products");
  };

  return (
    <div className="mb-6 border-b border-gray-200 py-4">
      {/* Back to Treatments Button */}
      <div className="mb-4 container mx-auto">
        <Button
          variant="outline"
          onClick={_handleBackClick}
          className="inline-flex items-center gap-2 bg-white border-none text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors group rounded-lg px-4 py-2 shadow-none"
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
              Back to Treatments
            </>
          )}
        </Button>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto text-sm text-gray-600">
        <span
          className="hover:text-gray-800 cursor-pointer"
          onClick={() => _moveToAllTreatments()}
        >
          All Treatments
        </span>
        {categoryName ? (
          <>
            <span className="mx-2">/</span>
            <span
              className="hover:text-gray-800 cursor-pointer"
              onClick={() => _handleCategoryClick(categoryId)}
            >
              {categoryName}
            </span>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium cursor-pointer">
          {productName}
        </span>
      </div>
    </div>
  );
};

export default BackButton;
