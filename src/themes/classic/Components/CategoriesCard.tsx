"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";

const imageUrl =
  "https://upstatemdweightloss.com/wp-content/uploads/2025/05/ED73BFCA-F7BA-47F7-8002-35C933682505-200x300.png";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, Star, ArrowRight, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const CategoriesCard = ({
  category,
  featuredCard = false,
  index,
}: {
  category: any;
  featuredCard?: boolean;
  index: number;
}) => {
  const { navigateWithState, isNavigatingTo } = useNavigationState();
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );
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

  // Returns a light background color based on brandColor/accentColor for better contrast and visibility
  const _getCardStylesAccordingToCategoryColor = useCallback(
    (index: number) => {
      // Helper to add opacity to hex color (returns rgba)
      const hexToRgba = (hex: string, alpha: number) => {
        let c = hex?.replace("#", "");
        if (c?.length === 3)
          c = c
            ?.split("")
            ?.map((x) => x + x)
            ?.join("");
        const num = parseInt(c, 16);
        return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${
          num & 255
        }, ${alpha})`;
      };

      const brandColor =
        merchantData?.customizeBranding?.brandColor || "#2563eb"; // fallback blue-600
      const accentColor =
        merchantData?.customizeBranding?.accentColor || "#f59e42"; // fallback orange-400

      if (index % 2 === 0) {
        return {
          borderColor: brandColor,
          // backgroundColor: hexToRgba(brandColor, 0.1), // 10% opacity for light bg
        };
      } else {
        return {
          borderColor: accentColor,
          // backgroundColor: hexToRgba(accentColor, 0.1), // 10% opacity for light bg
        };
      }
    },
    [index, merchantData]
  );

  const categoryUrl = `/products?category=${category?._id}`;
  const isLoading = isNavigatingTo(categoryUrl);

  return (
    <>
      {featuredCard ? (
        <Card
          key={category?._id}
          className={`bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300 relative ${
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
                {!imageFailed && category?.image ? (
                  <Image
                    src={category?.image || imageUrl}
                    alt={category?.name}
                    fill
                    className="rounded-full object-cover"
                    onError={_handleImageError}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    {category?.name ? (
                      category?.name?.charAt(0)
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {category?.name || "N/A"}

              {/* {category?.isPopular && (
                <span
                  className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5"
                  title="Popular category"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 mr-1" />
                  <span className="text-xs font-medium text-yellow-700">
                    Popular
                  </span>
                </span>
              )} */}
            </h3>
            <p className="text-gray-600">{category?.description || "N/A"}</p>
          </CardContent>
        </Card>
      ) : (
        <Card
          key={category?._id || category?.id}
          className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 relative hover:scale-105  ${
            isLoading ? "opacity-75 pointer-events-none scale-100" : ""
          }`}
          style={_getCardStylesAccordingToCategoryColor(index)}
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
                  {!imageFailed && category?.image ? (
                    <Image
                      src={category?.image || imageUrl}
                      alt={category?.name}
                      fill
                      className="rounded-lg object-cover"
                      onError={_handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      {/* <ImageIcon className="h-5 w-5 text-gray-400" /> */}
                      <span className="text-2xl font-bold text-blue-600">
                        {category?.name ? (
                          category?.name?.charAt(0)
                        ) : (
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {category?.products?.length > 0 ? (
                <span className="text-sm theme-text-muted bg-gray-100 px-2 py-1 rounded-full shadow-sm">
                  {category?.products?.length}{" "}
                  {category?.products?.length === 1 ? "product" : "products"}
                </span>
              ) : (
                <span className="text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded-full shadow-sm italic">
                  No products available
                </span>
              )}
            </div>

            <h3 className="text-xl font-semibold text-black mb-2 break-words line-clamp-2 h-15 flex items-center gap-2">
              {category?.name}{" "}
              {category?.isPopular && (
                <span
                  className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5"
                  title="Popular category"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 mr-1" />
                  <span className="text-xs font-medium text-yellow-700">
                    Popular
                  </span>
                </span>
              )}
            </h3>
            <p className="theme-text-muted text-sm leading-relaxed">
              {category?.description}
            </p>

            
              <div
                 className="w-full mt-4 bg-white border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-gray-50 hover:border-gray-400 font-semibold text-sm h-10 px-3 group items-center"
                
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading treatments...
                  </>
                ) : (
                  <>
                    
                    Explore Treatments
                    <ChevronRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CategoriesCard;
