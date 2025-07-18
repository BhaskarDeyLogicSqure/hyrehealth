"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Star, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Product } from "@/types/products";
import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_IMAGE_URL } from "@/configs";

const ProductDetailsSection = ({
  product,
  selectedRelatedProducts,
  handleRelatedProductToggle,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  handleRelatedProductToggle: (productId: string) => void;
}) => {
  // Mock related products data
  const relatedProducts = [
    {
      id: 2,
      name: "B12 Injection",
      description: "Energy boost and metabolic support",
      price: 99,
      image: "💉",
      requiresConsultation: false,
    },
    {
      id: 3,
      name: "Tirzepatide",
      description: "Advanced dual-action weight loss treatment",
      price: 399,
      image: "💊",
      requiresConsultation: true,
    },
  ];

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
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold theme-text-primary mb-6">
            You Might Also Benefit From
          </h2>

          <div className="space-y-4">
            {relatedProducts?.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{relatedProduct.image}</div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm theme-text-muted">
                      {relatedProduct.description}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      ${relatedProduct.price}/month
                    </p>
                    {relatedProduct.requiresConsultation && (
                      <p className="text-xs text-orange-600">
                        Additional consultation required
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedRelatedProducts?.includes(
                      relatedProduct.id.toString()
                    )}
                    onCheckedChange={() =>
                      handleRelatedProductToggle(relatedProduct.id.toString())
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleRelatedProductToggle(relatedProduct.id.toString())
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsSection;
