"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/products";

const TreatmentInfoCards = ({ product }: { product: Product }) => {
  if (
    !product?.contentAndDescription?.benefits?.length &&
    !product?.contentAndDescription?.sideEffects?.length &&
    !product?.contentAndDescription?.ingredientsOrComposition?.[0]?.name
  ) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Benefits Card */}
          {product?.contentAndDescription?.benefits?.length ? (
            <Card className="bg-white rounded-lg shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 font-serif mb-6">
                  Benefits
                </h3>

                <div className="flex items-center space-x-2">
                  {/* <span className="w-2 h-2 rounded-full bg-primary inline-block" /> */}
                  <span
                    className="text-base font-medium text-primary"
                    dangerouslySetInnerHTML={{
                      __html: product?.contentAndDescription?.benefits?.[0],
                    }}
                  />
                </div>

                {/* <ul className="space-y-4">
                  {product?.contentAndDescription?.benefits?.map(
                    (benefit: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          {removeHtmlTags(benefit)}
                        </span>
                      </li>
                    )
                  )}
                </ul> */}
              </CardContent>
            </Card>
          ) : null}

          {/* Possible Side Effects Card */}
          {product?.contentAndDescription?.sideEffects?.length ? (
            <Card className="bg-white rounded-lg shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 font-serif mb-6">
                  Possible Side Effects
                </h3>

                <div className="flex items-center space-x-2">
                  {/* <span className="w-2 h-2 rounded-full bg-primary inline-block" /> */}
                  <span
                    className="text-base font-medium text-primary"
                    dangerouslySetInnerHTML={{
                      __html: product?.contentAndDescription?.sideEffects?.[0],
                    }}
                  />
                </div>
                {/* <ul className="space-y-4">
                  {product?.contentAndDescription?.sideEffects?.map(
                    (effect: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <AlertCircle className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          {removeHtmlTags(effect)}
                        </span>
                      </li>
                    )
                  )}
                </ul> */}
              </CardContent>
            </Card>
          ) : null}

          {/* Treatment Information Card */}
          {product?.contentAndDescription?.ingredientsOrComposition?.[0]
            ?.name ? (
            <Card className="bg-white rounded-lg shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 font-serif mb-6">
                  Ingredients & Composition
                </h3>
                <div className="flex items-center justify-between border-b last:border-b-0 py-2">
                  <div className="flex items-center space-x-2">
                    {/* <span className="w-2 h-2 rounded-full bg-primary inline-block" /> */}
                    <span
                      className="text-base font-medium text-primary"
                      dangerouslySetInnerHTML={{
                        __html:
                          product?.contentAndDescription
                            ?.ingredientsOrComposition?.[0]?.name,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TreatmentInfoCards;
