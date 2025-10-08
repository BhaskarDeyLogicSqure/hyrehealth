"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_IMAGE_URL } from "@/configs";
import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";
import ThemeLoader from "@/components/ThemeLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ProductsCard = ({
  product,
  isFeatured = false,
}: {
  product: any;
  isFeatured?: boolean;
}) => {
  const { navigateWithState, isNavigatingTo } = useNavigationState();
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const [imageFailed, setImageFailed] = useState(false);

  const _handleProductClick = (productId: string) => {
    // Use navigation utility to store current state and navigate
    navigateWithState(
      `/products/${productId}`,
      NAVIGATION_KEYS.LAST_PRODUCTS_PAGE
    );
  };

  const _handleImageError = () => {
    setImageFailed(true);
  };

  const productUrl = `/products/${product?._id}`;
  const isLoading = isNavigatingTo(productUrl);

  return (
    <Card
      key={product?._id}
      className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full"
    >
      {/* Category badge - top right */}
      {product?.category?.[0]?.name ? (
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-green-800">
            {product?.category?.[0]?.name}
          </Badge>
        </div>
      ) : null}

      {/* Product Image - top left */}
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {product?.media?.images[0]?.url && !imageFailed ? (
          <div
            className="w-full h-full relative cursor-pointer"
            onClick={() => _handleProductClick(product?._id)}
          >
            <Image
              src={product?.media?.images[0]?.url || DEFAULT_IMAGE_URL}
              alt={product?.name}
              fill
              className="object-cover rounded-xl"
              onError={_handleImageError}
              sizes="100vw"
              priority={false}
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
            {imageFailed ? (
              <span title="Image failed to load">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </span>
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                {product?.name?.charAt(0)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 mb-3 text-lg">{product?.name}</h3>

      {/* Description */}
      {product?.contentAndDescription?.shortDescription ? (
        <p className="text-gray-600 text-sm mb-4">
          {product?.contentAndDescription?.shortDescription}
        </p>
      ) : null}

      {/* Rating */}
      {product?.statistics?.averageRating ? (
        <div className="flex items-center gap-1 mb-3">
          {[...Array(product?.statistics?.averageRating || 0)]?.map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          {product?.statistics?.reviewCount ? (
            <span
              className="text-sm text-gray-600 ml-1"
              title={`${product?.statistics?.reviewCount} reviews`}
            >
              ({product?.statistics?.reviewCount} reviews)
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Price */}
      {product?.pricing?.lowestPrice ? (
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${product?.pricing?.lowestPrice}
          </span>
          <span className="text-sm text-gray-600 ml-1">per month</span>
        </div>
      ) : null}

      {/* Tags */}
      {/* <div className="flex flex-wrap gap-1 mb-4">
          {treatment.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div> */}

      {/* Spacer to push button to bottom */}
      <div className="flex-grow"></div>

      {/* Learn More button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full bg-white font-normal text-sm h-8 px-3 mt-4"
        style={{
          borderColor:
            merchantData?.customizeBranding?.accentColor || "#1e40af",
          color: merchantData?.customizeBranding?.accentColor || "#1e40af",
        }}
        onClick={() => _handleProductClick(product?._id)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ThemeLoader
            type="inline"
            variant="simple"
            size="sm"
            message="Loading..."
            className="gap-2"
          />
        ) : (
          "View Details"
        )}
      </Button>
    </Card>
  );
};
export default ProductsCard;
