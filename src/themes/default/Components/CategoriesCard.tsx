"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const imageUrl =
  "https://upstatemdweightloss.com/wp-content/uploads/2025/05/ED73BFCA-F7BA-47F7-8002-35C933682505-200x300.png";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { DEFAULT_THEME_CATEGORIES_COLORS } from "@/configs";

const CategoriesCard = ({
  category,
  featuredCard = false,
  index,
}: {
  category: any;
  featuredCard?: boolean;
  index: number;
}) => {
  const router = useRouter();
  const { navigateWithState, isNavigatingTo } = useNavigationState();
  const [imageFailed, setImageFailed] = useState(false);

  const _handleCategoryClick = (categoryId: string) => {
    // Use navigation utility to store current state and navigate
    navigateWithState(
      `/products?category=${categoryId}`,
      NAVIGATION_KEYS.LAST_CATEGORIES_PAGE
    );
  };

  const _handleImageError = () => {
    setImageFailed(true);
  };

  const _getRandomCategoryColor = (index: number) => {
    const colors = DEFAULT_THEME_CATEGORIES_COLORS;
    return colors[index % colors?.length]; // Use modulo to cycle through colors
  };

  const categoryColor = useMemo(() => {
    return _getRandomCategoryColor(index);
  }, [category, index]);

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
              className={`w-14 h-14 rounded-full  bg-stone-100 overflow-hidden
               
                flex items-center justify-center mx-auto mb-4 relative`}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
              <div
                className={`w-full h-full rounded-full flex items-center justify-center`}
              >
                {!imageFailed ? (
                  <Image
                    src={category?.image || imageUrl}
                    alt={category?.name}
                    fill
                    className="rounded-full object-cover"
                    onError={_handleImageError}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
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
                className={`w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center relative overflow-hidden`}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  </div>
                )}
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center`}
                >
                  {!imageFailed ? (
                    <Image
                      src={category?.image || imageUrl}
                      alt={category?.name}
                      fill
                      className="rounded-lg object-cover"
                      onError={_handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <span className="text-sm theme-text-muted bg-white px-2 py-1 rounded-full shadow-sm">
                {category?.statistics?.productCount
                  ? category?.statistics?.productCount
                  : 0}{" "}
                products
              </span>
            </div>

            <h3 className="text-xl font-semibold text-black mb-2 break-words line-clamp-2 h-15">
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
