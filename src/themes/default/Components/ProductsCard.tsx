"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_IMAGE_URL } from "@/configs";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNavigationState,
  NAVIGATION_KEYS,
} from "@/hooks/useNavigationState";

const ProductsCard = ({
  product,
  isFeatured = false,
}: {
  product: any;
  isFeatured?: boolean;
}) => {
  const { navigateWithState } = useNavigationState();

  const _handleProductClick = (productId: string) => {
    // Use navigation utility to store current state and navigate
    navigateWithState(
      `/products/${productId}`,
      NAVIGATION_KEYS.LAST_PRODUCTS_PAGE
    );
  };

  return isFeatured ? (
    <Card
      key={product?._id}
      className="hover:shadow-lg transition-shadow duration-300"
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary">{product?.category?.[0]?.name}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">
              {product?.statistics?.averageRating}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{product?.name}</h3>
        <p className="text-gray-600 mb-4">
          {product?.contentAndDescription?.shortDescription}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${product?.pricing?.basePrice}/mo
          </span>
          <Button onClick={() => _handleProductClick(product?._id)}>
            Learn More
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
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-4 text-center h-48 flex items-center justify-center">
          {product?.media?.images[0]?.url ? (
            <Image
              // src={product?.media?.images[0]?.url}
              src={DEFAULT_IMAGE_URL}
              alt={product?.name}
              width={48}
              height={48}
              className="rounded-xl"
            />
          ) : (
            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-blue-600">
                {product?.name?.charAt(0)}
              </span>
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
        <h3 className="text-xl font-semibold theme-text-primary mb-2">
          {product?.name}
        </h3>
        {product?.contentAndDescription?.shortDescription ? (
          <p className="theme-text-muted text-sm mb-4 line-clamp-2 flex-grow">
            {product?.contentAndDescription?.shortDescription}
          </p>
        ) : null}

        {/* Rating */}
        <div className="flex items-center mb-4">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-sm font-medium">
            {product?.statistics?.averageRating}
          </span>
          <span className="ml-1 text-sm theme-text-muted">
            ({product?.statistics?.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold theme-text-primary">
              ${product?.pricing?.basePrice}
            </span>
            <span className="theme-text-muted text-sm">/month</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          className="w-full mt-auto"
          onClick={() => _handleProductClick(product?._id)}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};
export default ProductsCard;
