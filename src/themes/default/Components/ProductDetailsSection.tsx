"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Star, CheckCircle, AlertCircle } from "lucide-react";
import { Product } from "@/types/products";
import { DEFAULT_IMAGE_URL } from "@/configs";
import RelatedProductsSection from "./RelatedProductsSection";

const ProductDetailsSection = ({
  product,
  selectedRelatedProducts,
  handleRelatedProductToggle,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  handleRelatedProductToggle: (productId: string) => void;
}) => {
  console.log({ product });
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-8 text-center">
        <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
          {product?.media?.images?.[0]?.url ? (
            <img
              src={
                product?.media?.images?.[0]?.url &&
                !product?.media?.images?.[0]?.url.includes("example")
                  ? product?.media?.images?.[0]?.url
                  : DEFAULT_IMAGE_URL
              }
              alt={product?.name || "Product Image"}
              className="w-28 h-28 object-cover rounded-full"
            />
          ) : (
            <span className="text-4xl font-bold text-blue-600">
              {product?.name?.charAt(0)}
            </span>
          )}
        </div>
        <Badge className="mb-4">{product?.category?.[0]?.name}</Badge>
        <h1 className="text-3xl font-bold theme-text-primary mb-2">
          {product?.name}
        </h1>
        <div className="flex items-center justify-center mb-4">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 font-semibold">
            {product?.statistics?.averageRating}
          </span>
          <span className="ml-1 theme-text-muted">
            ({product?.statistics?.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Product Description */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold theme-text-primary mb-4">
            About This Treatment
          </h2>
          <p className="theme-text-muted mb-4">
            {product?.contentAndDescription?.description}
          </p>
          <p className="theme-text-muted text-sm">
            {product?.contentAndDescription?.longDescription}
          </p>
        </CardContent>
      </Card>

      {/* Benefits & Side Effects */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-700 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Benefits
            </h3>
            <ul className="space-y-2">
              {product?.contentAndDescription?.benefits?.map(
                (benefit: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm theme-text-muted flex items-start"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {benefit}
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-orange-700 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Possible Side Effects
            </h3>
            <ul className="space-y-2">
              {product?.contentAndDescription?.sideEffects?.map(
                (effect: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm theme-text-muted flex items-start"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {effect}
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Related Products Section */}
      {product?.similarProducts?.length ? (
        <RelatedProductsSection
          product={product}
          selectedRelatedProducts={selectedRelatedProducts}
          handleRelatedProductToggle={handleRelatedProductToggle}
        />
      ) : null}
    </div>
  );
};

export default ProductDetailsSection;
