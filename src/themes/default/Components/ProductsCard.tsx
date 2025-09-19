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

const ProductsCard = ({
  product,
  isFeatured = false,
}: {
  product: any;
  isFeatured?: boolean;
}) => {
  const { navigateWithState, isNavigatingTo } = useNavigationState();
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

  return isFeatured ? (
    <Card
      key={product?._id}
      className="hover:shadow-lg transition-shadow duration-300"
    >
      <CardContent className="p-6">
        {product?.category?.length ? (
          <div className="flex justify-between items-start mb-4">
            <Badge variant="secondary">{product?.category?.[0]?.name}</Badge>
          </div>
        ) : null}

        <div className="flex gap-2 items-center">
          <h3 className="text-xl font-semibold">{product?.name}</h3>

          {/* Rating */}
          {product?.statistics?.averageRating ? (
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">
                {product?.statistics?.averageRating}
              </span>
              {product?.statistics?.reviewCount ? (
                <span
                  className="ml-1 text-sm theme-text-muted"
                  title={`${product?.statistics?.reviewCount} reviews`}
                >
                  ({product?.statistics?.reviewCount})
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <p className="text-gray-600 mb-4">
          {product?.contentAndDescription?.shortDescription}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${product?.pricing?.lowestPrice}/mo
          </span>
          <Button
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
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card
      key={product?._id}
      className="hover:shadow-lg transition-shadow cursor-pointer h-full"
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl mb-4 text-center h-48 flex items-center justify-center p-0 overflow-hidden">
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

        {/* Category Badge */}
        {product?.category?.length > 0 ? (
          <Badge variant="secondary" className="mb-3 w-fit">
            {product?.category?.[0]?.name}
          </Badge>
        ) : null}

        {/* Product Info */}
        <h3
          className="text-xl font-semibold theme-text-primary mb-2"
          onClick={() => _handleProductClick(product?._id)}
        >
          {product?.name}
        </h3>
        {product?.contentAndDescription?.shortDescription ? (
          <p className="theme-text-muted text-sm mb-4 line-clamp-2 flex-grow">
            {product?.contentAndDescription?.shortDescription}
          </p>
        ) : null}

        {/* Rating */}
        {product?.statistics?.averageRating ? (
          <div className="flex items-center mb-4">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">
              {product?.statistics?.averageRating}
            </span>
            {product?.statistics?.reviewCount ? (
              <span
                className="ml-1 text-sm theme-text-muted"
                title={`${product?.statistics?.reviewCount} reviews`}
              >
                ({product?.statistics?.reviewCount})
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          {product?.pricing?.lowestPrice ? (
            <div>
              <span className="text-2xl font-bold theme-text-primary">
                ${product?.pricing?.lowestPrice}
              </span>
              {/* <span className="theme-text-muted text-sm">/month</span> */}
            </div>
          ) : (
            "-"
          )}
        </div>

        {/* CTA */}
        <Button
          className="w-full mt-auto"
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
      </CardContent>
    </Card>
  );
};
export default ProductsCard;
