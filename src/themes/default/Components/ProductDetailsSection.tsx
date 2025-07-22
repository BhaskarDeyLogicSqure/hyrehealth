"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { Product } from "@/types/products";
import { DEFAULT_IMAGE_URL } from "@/configs";
import RelatedProductsSection from "./RelatedProductsSection";
import ImageVideoViewFullScreenModal from "./ImageVideoViewFullScreenModal";

const ProductDetailsSection = ({
  product,
  selectedRelatedProducts,
  handleRelatedProductToggle,
}: {
  product: Product;
  selectedRelatedProducts: string[];
  handleRelatedProductToggle: (productId: string) => void;
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Combine images and videos for the carousel
  const allMedia = [
    ...(product?.media?.images || [])?.map((img, idx, arr) =>
      idx === arr?.length - 1
        ? {
            ...img,
            type: "video",
            ...(product?.media?.videos?.[0] || {}),
          }
        : {
            ...img,
            type: "image",
          }
    ),
    ...(product?.media?.videos || [])
      .slice((product?.media?.images?.length || 0) > 0 ? 1 : 0)
      .map((video) => ({
        ...video,
        type: "video",
      })),
  ];

  console.log({ allMedia });

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + allMedia.length) % allMedia.length
    );
  };

  const goToMedia = (index: number) => {
    setCurrentMediaIndex(index);
  };

  console.log({ product });
  return (
    <div>
      {/* Media Carousel */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Main Media Display */}
            <div className="relative h-80 flex items-center justify-center p-4">
              {allMedia.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {allMedia[currentMediaIndex]?.type === "image" ? (
                    <img
                      src={
                        allMedia[currentMediaIndex]?.url &&
                        !allMedia[currentMediaIndex]?.url.includes("example")
                          ? allMedia[currentMediaIndex]?.url
                          : DEFAULT_IMAGE_URL
                      }
                      alt={
                        allMedia[currentMediaIndex]?.alt ||
                        product?.name ||
                        "Product Media"
                      }
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        src={allMedia[currentMediaIndex]?.url}
                        controls
                        controlsList="nodownload"
                        className="w-full h-full object-contain rounded-lg bg-black"
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* Fullscreen Button */}
                  <ImageVideoViewFullScreenModal
                    isFullscreenOpen={isFullscreenOpen}
                    currentMediaIndex={currentMediaIndex}
                    allMedia={allMedia}
                    product={product}
                    nextMedia={nextMedia}
                    prevMedia={prevMedia}
                    setIsFullscreenOpen={setIsFullscreenOpen}
                    setCurrentMediaIndex={setCurrentMediaIndex}
                  />

                  {/* Navigation Arrows */}
                  {allMedia?.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                        onClick={prevMedia}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                        onClick={nextMedia}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-blue-600">
                    {product?.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {allMedia?.length > 1 && (
              <div className="flex justify-center space-x-2 p-3 bg-white/50">
                {allMedia?.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => goToMedia(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentMediaIndex
                        ? "border-blue-500 scale-110"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {media?.type === "image" ? (
                      <img
                        src={
                          media?.url && !media?.url?.includes("example")
                            ? media?.url
                            : DEFAULT_IMAGE_URL
                        }
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center relative">
                        <video
                          src={media?.url}
                          className="w-full h-full object-cover"
                          muted
                          controls
                          controlsList="nodownload"
                          autoPlay={true}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Info Section - Below Carousel */}
      <div className="text-center mb-8">
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
                          {item?.name}
                        </h3>
                      )}
                    </div>
                    {item?.amount && item?.unit ? (
                      <div className="flex items-baseline space-x-1">
                        <span className="text-base font-semibold text-primary">
                          {item?.amount}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item?.unit}
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

      {/* Shipping and Return Policy */}
      {product?.contentAndDescription?.shippingAndReturnPolicy && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold theme-text-primary mb-4">
              Shipping & Return Policy
            </h2>
            <div className="theme-text-muted whitespace-pre-line">
              {product?.contentAndDescription?.shippingAndReturnPolicy}
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
              {product?.contentAndDescription?.howToUse}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frequently Asked Questions */}
      {product?.contentAndDescription?.faqs &&
        product?.contentAndDescription?.faqs?.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold theme-text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {product?.contentAndDescription?.faqs?.map(
                  (faq: any, index: number) => (
                    <Collapsible
                      key={index}
                      className="border border-gray-200 rounded-lg"
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left theme-text-primary hover:theme-bg-muted font-medium transition-colors">
                        <span>{faq?.question}</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="theme-text-muted whitespace-pre-line border-t border-gray-100 pt-3">
                          {faq?.answer}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                )}
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
