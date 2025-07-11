"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Video, Clock, Truck, Mail } from "lucide-react";
import Link from "next/link";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber =
    searchParams.get("order") ||
    Math.random().toString(36).substr(2, 9).toUpperCase();
  const totalAmount = searchParams.get("total") || "89.99";
  const relatedProductIds =
    searchParams.get("relatedProducts")?.split(",").filter(Boolean) || [];

  // Mock related products data
  const relatedProductsData = [
    { id: "2", name: "B12 Injection", deliveryTime: "2-3 business days" },
    { id: "3", name: "Tirzepatide", deliveryTime: "1-3 business days" },
  ];

  const selectedRelatedProducts = relatedProductsData.filter((p) =>
    relatedProductIds.includes(p.id)
  );

  useEffect(() => {
    console.log("Thank you page loaded successfully");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your order has been successfully placed
          </p>
          <p className="text-lg text-gray-500">Order #{orderNumber}</p>
        </div>

        {/* Order Summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">#{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">${totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-green-600 font-semibold">Paid</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to your email address with
                  order details and tracking information.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-semibold">Doctor Review</p>
                  <p className="text-sm text-gray-600">
                    Your information will be reviewed by our medical team (24-48
                    hours)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-semibold">Consultation</p>
                  <p className="text-sm text-gray-600">
                    Complete your consultation call with a licensed physician
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <p className="font-semibold">Prescription & Delivery</p>
                  <p className="text-sm text-gray-600">
                    Medication is prepared and shipped to your address
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        {selectedRelatedProducts.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Additional Products in Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedRelatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Expected delivery: {product.deliveryTime}
                      </p>
                    </div>
                    <Truck className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Information */}
        <Card className="bg-blue-50 border-blue-200 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Mail className="h-5 w-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 text-sm">
              <li>
                • You will receive a consultation scheduling email within 24
                hours
              </li>
              <li>• Keep your phone available for the consultation call</li>
              <li>
                • Your medication will be prepared after successful consultation
              </li>
              <li>• Track your order status in your account dashboard</li>
              <li>• Contact support if you have any questions or concerns</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            View My Account
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/products")}
            className="flex items-center gap-2"
          >
            Continue Shopping
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/support")}
            className="flex items-center gap-2"
          >
            Contact Support
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-gray-600">
            Thank you for choosing our healthcare platform. We're committed to
            providing you with safe, effective treatments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
