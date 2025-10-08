"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Star, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Product } from "@/types/products";
// import RelatedProductsSection from "../Components/RelatedProductsSection";
import ImageVideoCarousel from "@/components/ImageVideoCarousel";
import { removeHtmlTags } from "@/lib/utils";
import RelatedProductsSection from "@/themes/default/Components/RelatedProductsSection";

const ProductDetailsSection = ({
  product,
  selectedRelatedProducts,
  handleRelatedProductToggle,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  handleRelatedProductToggle: (productId: string) => void;
}) => {
  // Combine images and videos for the carousel
  const allMedia = [
    ...(product?.media?.images || [])?.map((img) => ({
      ...img,
      type: "image",
    })),
    ...(product?.media?.videos || [])?.map((video) => ({
      ...video,
      type: "video",
    })),
  ];

  const _getFaqsWithAnswer = useMemo(() => {
    return product?.contentAndDescription?.faqs?.filter((faq: any) => {
      if (faq?.answer && faq?.answer?.trim() !== "") {
        return faq;
      }
      return null;
    });
  }, [product?.contentAndDescription?.faqs]);

  console.log({ product });
  return (
    <div>
      {/* Product Info Header Section */}
      <div className="mb-4">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-gray-700 font-semibold text-2xl">
              {product?.name?.charAt(0)?.toUpperCase() || "C"}
            </span>
          </div>

          <div className="flex-1">
            {/* Category Badge */}
            {product?.category?.[0]?.name ? (
              <div className="mb-3">
                <Badge className="bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {product?.category?.[0]?.name}
                </Badge>
              </div>
            ) : null}

            {/* Star Rating */}
            {product?.statistics?.averageRating &&
            product?.statistics?.averageRating > 0 ? (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(product?.statistics?.averageRating || 0)]?.map(
                    (star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <=
                          Math.floor(product?.statistics?.averageRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : star ===
                                Math.ceil(
                                  product?.statistics?.averageRating || 0
                                ) &&
                              (product?.statistics?.averageRating || 0) % 1 !==
                                0
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    )
                  )}
                </div>

                {product?.statistics?.reviewCount ? (
                  <span
                    className="ml-2 text-sm text-gray-600"
                    title={`${product?.statistics?.reviewCount} reviews`}
                  >
                    ({product?.statistics?.reviewCount || 0} reviews)
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500">No rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Title */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-800 font-serif">
            {product?.name || "N/A"}
          </h1>
        </div>
      </div>

      {/* Media Carousel */}
      <ImageVideoCarousel allMedia={allMedia} product={product} />

      {/* Product Description */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold theme-text-primary mb-4">
            About This Treatment
          </h2>
          <p className="theme-text-muted mb-4">
            {removeHtmlTags(product?.contentAndDescription?.description || "")}
          </p>
          <p className="theme-text-muted text-sm">
            {removeHtmlTags(
              product?.contentAndDescription?.longDescription || ""
            )}
          </p>
        </CardContent>
      </Card>

      {/* Ingredients & Composition */}
      {product?.contentAndDescription?.ingredientsOrComposition &&
      product?.contentAndDescription?.ingredientsOrComposition?.length > 0 ? (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold theme-text-primary mb-4">
              Ingredients & Composition
            </h2>

            <div className="space-y-4">
              {product?.contentAndDescription?.ingredientsOrComposition?.map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b last:border-b-0 py-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      {item?.name && (
                        <h3 className="text-base font-medium text-primary">
                          {removeHtmlTags(item?.name)}
                        </h3>
                      )}
                    </div>
                    {item?.amount && item?.unit ? (
                      <div className="flex items-baseline space-x-1">
                        <span className="text-base font-semibold text-primary">
                          {item?.amount}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {removeHtmlTags(item?.unit)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Benefits & Side Effects */}
      {/* <div className="grid md:grid-cols-2 gap-6 mb-8">
          {product?.contentAndDescription?.benefits?.length ? (
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
                        {removeHtmlTags(benefit)}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {product?.contentAndDescription?.sideEffects?.length ? (
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
                        {removeHtmlTags(effect)}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div> */}

      {/* Shipping and Return Policy */}
      {product?.contentAndDescription?.shippingAndReturnPolicy && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold theme-text-primary mb-4">
              Shipping & Return Policy
            </h2>
            <div className="theme-text-muted whitespace-pre-line">
              {removeHtmlTags(
                product?.contentAndDescription?.shippingAndReturnPolicy
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How to Use */}
      {product?.contentAndDescription?.howToUse && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold theme-text-primary mb-4">
              How to Use
            </h2>
            <div className="theme-text-muted whitespace-pre-line">
              {removeHtmlTags(product?.contentAndDescription?.howToUse)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frequently Asked Questions */}
      {_getFaqsWithAnswer && _getFaqsWithAnswer?.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold theme-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {_getFaqsWithAnswer?.map((faq: any, index: number) => (
                <Collapsible
                  key={index}
                  className="border border-gray-200 rounded-lg"
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left theme-text-primary hover:theme-bg-muted font-medium transition-colors">
                    <span>{removeHtmlTags(faq?.question)}</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="theme-text-muted whitespace-pre-line border-t border-gray-100 pt-3">
                      {removeHtmlTags(faq?.answer)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
