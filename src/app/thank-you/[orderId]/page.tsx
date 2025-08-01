"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Package,
  Video,
  Clock,
  Truck,
  Mail,
  Box,
} from "lucide-react";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/configs";
const ThankYouPage = ({ params }: { params: { orderId: string } }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = params?.orderId;

  const orderNumber =
    searchParams.get("order") ||
    Math.random().toString(36).substr(2, 9).toUpperCase();
  const totalAmount = searchParams.get("total") || "348";
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

    console.log("orderId", orderId);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Order Confirmation Banner */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your treatment plan is ready to begin
          </p>
        </div>

        {/* Order Details Section */}
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-blue-600" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-bold text-gray-900">#{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-gray-900">${totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="font-bold text-green-600">
                Awaiting Consultation
              </span>
            </div>

            {/* Products & Delivery Timeline */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">
                Your Products & Delivery Timeline:
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Semaglutide</span>
                  <span className="text-sm text-gray-600">
                    1-3 business days
                  </span>
                </div>
                {selectedRelatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700">{product.name}</span>
                    <span className="text-sm text-gray-600">
                      {product.deliveryTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Consultation Button */}
            <div className="pt-6 text-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                <Video className="h-5 w-5 mr-2" />
                Start Consultation
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Complete your intake form first
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next Section */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">What Happens Next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Join your consultation call with a licensed provider
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Use the button above to connect immediately
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  The doctor will confirm your eligibility and prescribe the
                  best dosage
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your consultation typically takes 10-15 minutes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Your prescription will be processed and shipped within 1-3
                  business days
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Discreet packaging with tracking information provided
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  You'll receive updates via email and can manage everything
                  from "My Account"
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Track your order, schedule follow-ups, and manage
                  subscriptions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Support */}
        <div className="text-center mt-12 pt-8">
          <p className="text-gray-600">
            Need help? Contact our support team at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
