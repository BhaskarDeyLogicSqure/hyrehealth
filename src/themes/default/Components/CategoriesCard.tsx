"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DEFAULT_IMAGE_URL } from "@/configs";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const CategoriesCard = ({
  category,
  featuredCard = false,
}: {
  category: any;
  featuredCard?: boolean;
}) => {
  const router = useRouter();
  const { navigateWithState, isNavigatingTo } = useNavigationState();

  const _handleCategoryClick = (categoryId: string) => {
    // Use navigation utility to store current state and navigate
    navigateWithState(
      `/products?category=${categoryId}`,
      NAVIGATION_KEYS.LAST_CATEGORIES_PAGE
    );
  };

  const _getRandomCategoryColor = () => {
    const colors = [
      "bg-blue-50 text-blue-600 border-blue-200",
      "bg-purple-50 text-purple-600 border-purple-200",
      "bg-green-50 text-green-600 border-green-200",
      "bg-red-50 text-red-600 border-red-200",
      "bg-orange-50 text-orange-600 border-orange-200",
      "bg-orange-50 text-orange-600 border-orange-200",
      "bg-indigo-50 text-indigo-600 border-indigo-200",
    ];
    return colors[Math.floor(Math?.random() * colors?.length)];
  };

  const categoryColor = useMemo(() => {
    return _getRandomCategoryColor();
  }, [category]);

  const categoryUrl = `/products?category=${category?._id}`;
  const isLoading = isNavigatingTo(categoryUrl);

  return (
    <>
      {featuredCard ? (
        <Card
          key={category?._id}
          className={`cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
            isLoading ? "opacity-75 pointer-events-none" : ""
          }`}
          onClick={() => _handleCategoryClick(category?._id)}
        >
          <CardContent className="p-8 text-center">
            <div
              className={`w-16 h-16 rounded-full 
                ${category?.name} 
                flex items-center justify-center mx-auto mb-4 relative`}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
              <div
                className={`w-12 h-12 rounded-lg ${categoryColor} flex items-center justify-center`}
              >
                <Image
                  src={DEFAULT_IMAGE_URL}
                  alt={category?.name}
                  width={36}
                  height={36}
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {category?.name || "N/A"}
            </h3>
            <p className="text-gray-600">{category?.description || "N/A"}</p>
          </CardContent>
        </Card>
      ) : (
        <Card
          key={category.id}
          className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${categoryColor} hover:scale-105  ${
            isLoading ? "opacity-75 pointer-events-none scale-100" : ""
          }`}
          onClick={() => _handleCategoryClick(category?._id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg ${categoryColor} flex items-center justify-center relative`}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  </div>
                )}
                <Image
                  src={DEFAULT_IMAGE_URL}
                  alt={category?.name}
                  width={36}
                  height={36}
                />
              </div>

              <span className="text-sm theme-text-muted bg-white px-2 py-1 rounded-full shadow-sm">
                {category?.statistics?.productCount
                  ? category?.statistics?.productCount
                  : 0}{" "}
                products
              </span>
            </div>

            <h3 className="text-xl font-semibold text-black mb-2 break-words">
              {category?.name}
            </h3>
            <p className="theme-text-muted text-sm leading-relaxed">
              {category?.description}
            </p>

            <div className="mt-4 pt-4 border-t theme-border">
              <span className="text-sm font-medium theme-text-primary flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading treatments...
                  </>
                ) : (
                  "Explore treatments →"
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CategoriesCard;
