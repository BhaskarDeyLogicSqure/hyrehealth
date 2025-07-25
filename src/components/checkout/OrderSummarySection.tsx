import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Shield, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CONSULTATION_FEE } from "@/configs";

const OrderSummarySection = ({
  product,
  duration,
  selectedDosagePrice,
  selectedRelatedProducts,
  relatedProductsData,
  totalPrice,
  formFields,
  handleRemoveRelatedProduct,
}: {
  product: any;
  duration: string;
  selectedDosagePrice: number;
  selectedRelatedProducts: string[];
  relatedProductsData: any[];
  totalPrice: number;
  formFields: any;
  handleRemoveRelatedProduct: (productId: string) => void;
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      setCouponCode("");
    }
  };

  const allProducts = [
    {
      id: product?._id || "",
      name: product?.name || "",
      type: "Primary Product",
      price: selectedDosagePrice,
      dosage: "0.25mg",
      duration: duration,
    },
    ...selectedRelatedProducts
      .map((productId) => {
        const relatedProduct = relatedProductsData.find(
          (p) => p.id === productId
        );
        return relatedProduct
          ? {
              id: productId,
              name: relatedProduct.name,
              type: "Add-on Product",
              price: relatedProduct.price,
              dosage: "0.25mg", // Default dosage for related products
              duration: duration,
            }
          : null;
      })
      .filter(Boolean),
  ];

  const subtotal = allProducts.reduce(
    (sum, product) => sum + product?.price * parseInt(product?.duration || "1"),
    0
  );

  return (
    <div>
      <Card className="sticky top-24 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Details Section */}
          {allProducts.map((productItem, index) => (
            <Card key={productItem?.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {productItem?.name}
                    </h3>
                    <p className="text-sm text-gray-600">{productItem?.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      $
                      {(productItem?.price || 0) *
                        parseInt(productItem?.duration || "1")}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${productItem?.price} x {productItem?.duration} month
                      {productItem?.duration !== "1" ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Dosage
                    </label>
                    <Select defaultValue={productItem?.dosage}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.25mg">0.25mg</SelectItem>
                        <SelectItem value="0.5mg">0.5mg</SelectItem>
                        <SelectItem value="1mg">1mg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Subscription Plan
                    </label>
                    <Select defaultValue={productItem?.duration}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 month</SelectItem>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Remove button for related products */}
                {productItem?.type === "Add-on Product" && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveRelatedProduct(productItem?.id || "")
                      }
                      className="text-red-600 hover:text-red-800 p-1"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Coupon Code Section */}
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Coupon Code</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  className="px-4"
                >
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 text-sm text-green-600">
                  Coupon "{appliedCoupon}" applied
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Treatment cost:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Consultation fee:</span>
              <span>${CONSULTATION_FEE}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${(subtotal + CONSULTATION_FEE).toFixed(2)}</span>
            </div>
          </div>

          {/* Complete Purchase Button */}
          <Button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-lg font-medium"
            disabled={!formFields?.acceptTerms}
          >
            Complete Purchase
          </Button>

          {/* Security Information */}
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
