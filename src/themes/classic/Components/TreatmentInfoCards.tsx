"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Truck,
  Shield,
  Check,
} from "lucide-react";
import { Product } from "@/types/products";
import { removeHtmlTags } from "@/lib/utils";

const TreatmentInfoCards = ({ product }: { product: Product }) => {
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
                <ul className="space-y-4">
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
                </ul>
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
                <ul className="space-y-4">
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
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {/* Treatment Information Card */}
          <Card className="bg-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 font-serif mb-6">
                Treatment Information
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Users className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Licensed physician consultation required
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Monthly follow-ups included
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Truck className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Free shipping & discreet packaging
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    HIPAA-compliant care
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TreatmentInfoCards;
