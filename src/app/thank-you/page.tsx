"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Video, Clock, Truck, Mail, Box } from "lucide-react";
import { SUPPORT_EMAIL } from "@/configs";
import { useOrderConfirmation } from "@/api/postCheckout/useOrderConfirmation";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import ThemeLoader from "@/components/ThemeLoader";
import { extractQueryParams } from "@/lib/utils";

const ThankYouPage = () => {
  const router = useRouter();
  const { orderId } = extractQueryParams();

  // Use the order confirmation hook to fetch real data
  const {
    orderConfirmation,
    isOrderConfirmationLoading,
    isOrderConfirmationError,
    orderConfirmationError,
  } = useOrderConfirmation(orderId);

  const orderStatus = "Awaiting Consultation"; // Default status since it's not in the API response
  const products = orderConfirmation?.products || [];

  useEffect(() => {
    // Show error toast if there's an error
    if (isOrderConfirmationError) {
      const errorMessage =
        orderConfirmationError?.message || "Failed to load order details";
      showErrorToast(errorMessage);

      // redirect to home page
      router.push("/");
    }

    // redirect to home page if no orderId
    if (!orderId) {
      showErrorToast("No order ID found");
      router.push("/");
    }
  }, [orderId, isOrderConfirmationError, orderConfirmationError]);

  // Show loading state
  if (isOrderConfirmationLoading) {
    return <ThemeLoader type="general" variant="full-page" />;
  }

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
          <CardContent className="space-y-6">
            {/* Products List */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Products in Your Order
              </h3>
              <div className="space-y-4">
                {products?.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center md:justify-between rounded-lg border border-muted px-4 py-3 bg-muted/50"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900">
                        {product?.name}
                      </span>
                      {product?.description ? (
                        <span className="text-sm text-gray-600">
                          Description: {product?.description}
                        </span>
                      ) : null}
                      {/* {product?.dosage && (
                        <span className="text-sm text-gray-600">
                          Dosage: {product?.dosage}
                        </span>
                      )} */}
                    </div>
                    {product?.totalPrice ? (
                      <div className="mt-2 md:mt-0 text-right">
                        <span className="font-semibold text-gray-900">
                          ${product?.totalPrice}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-bold text-gray-900">
                  #{orderConfirmation?.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900">
                  ${orderConfirmation?.pricing?.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-green-600">{orderStatus}</span>
              </div>
            </div>

            {/* Start Consultation Button */}
            <div className="pt-6 text-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => {
                  router.push(`/intake-form?orderId=${orderId}`);
                }}
              >
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
