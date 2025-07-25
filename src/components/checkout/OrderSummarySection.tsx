import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

const OrderSummarySection = ({
  product,
  duration,
  selectedDosagePrice,
  selectedRelatedProducts,
  relatedProductsData,
  totalPrice,
  consultationFee,
  formFields,
  handleRemoveRelatedProduct,
}: {
  product: any;
  duration: string;
  selectedDosagePrice: number;
  selectedRelatedProducts: string[];
  relatedProductsData: any[];
  totalPrice: number;
  consultationFee: number;
  formFields: any;
  handleRemoveRelatedProduct: (productId: string) => void;
}) => {
  return (
    <div>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Product */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{product?.name}</h3>
                <p className="text-sm text-gray-600">
                  Dosage:
                  {/* {product?.dosage} */}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {duration} month
                  {duration !== "1" ? "s" : ""}
                </p>
              </div>
              <p className="font-semibold">
                ${selectedDosagePrice * parseInt(duration)}
              </p>
            </div>
          </div>

          {/* Related Products */}
          {selectedRelatedProducts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">
                Additional Products:
              </h4>
              {selectedRelatedProducts.map((productId) => {
                const relatedProduct = relatedProductsData.find(
                  (p) => p.id === productId
                );
                if (!relatedProduct) return null;

                return (
                  <div key={productId} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {relatedProduct.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {duration} month{duration !== "1" ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">
                          ${relatedProduct.price * parseInt(duration)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRelatedProduct(productId)}
                          className="text-red-600 hover:text-red-800"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Separator />

          {/* Pricing Summary */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Treatment cost:</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Consultation fee:</span>
              <span>${consultationFee}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${totalPrice + consultationFee}</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={!formFields?.acceptTerms}
          >
            Complete Purchase
          </Button>

          <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
            <Shield className="h-4 w-4 mr-2" />
            Secure 256-bit SSL encryption
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummarySection;
