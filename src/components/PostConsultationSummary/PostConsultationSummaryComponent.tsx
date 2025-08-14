"use client";

import { CheckCircle } from "lucide-react";
import { Package } from "lucide-react";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostConsultationSummary } from "@/api/postCheckout/usePostConsultationSummary";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { showErrorToast } from "@/components/GlobalErrorHandler";

const PostConsultationSummaryComponent = ({
  consultationId,
}: {
  consultationId: string;
}) => {
  const router = useRouter();
  const {
    postConsultationSummary,
    isPostConsultationSummaryLoading,
    isPostConsultationSummaryError,
    postConsultationSummaryError,
    refetchPostConsultationSummary,
  } = usePostConsultationSummary(consultationId);

  // Handle errors with toast and redirect
  useEffect(() => {
    if (isPostConsultationSummaryError) {
      const errorMessage =
        postConsultationSummaryError?.message ||
        "Failed to load consultation summary. Redirecting back...";
      showErrorToast(errorMessage);

      // Redirect to previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  }, [isPostConsultationSummaryError, postConsultationSummaryError, router]);

  // Handle no data case
  useEffect(() => {
    if (
      !isPostConsultationSummaryLoading &&
      !isPostConsultationSummaryError &&
      !postConsultationSummary
    ) {
      showErrorToast("No consultation summary data found. Redirecting back...");

      // Redirect to previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  }, [
    isPostConsultationSummaryLoading,
    isPostConsultationSummaryError,
    postConsultationSummary,
    router,
  ]);

  // Loading state
  if (isPostConsultationSummaryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Loading Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Loading Cards */}
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Timeline */}
          <Card className="mt-8">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="w-8 h-8 rounded-full mr-4 mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-64 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state - show simplified error message since toast will handle the error and redirect
  if (isPostConsultationSummaryError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Consultation Summary
            </h1>
            <p className="text-gray-600 mb-4">
              Redirecting back to previous page...
            </p>
            <Button
              onClick={() => refetchPostConsultationSummary()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data state - show simplified message since toast will handle the error and redirect
  if (!postConsultationSummary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              No Data Found
            </h1>
            <p className="text-gray-600">
              Redirecting back to previous page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { consultation, treatmentPlan, orderSummary } = postConsultationSummary;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consultation Complete!
          </h1>
          <p className="text-gray-600">
            Your treatment plan has been approved and your order is being
            processed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Treatment Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Your Treatment Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Product:</span>
                <span className="font-semibold">
                  {treatmentPlan?.products?.[0]?.productName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved Dosage:</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {treatmentPlan?.products?.[0]?.dosageInstructions || "N/A"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consultation Valid Until:</span>
                <span className="font-semibold">
                  {treatmentPlan?.consultationValidUntil
                    ? new Date(
                        treatmentPlan.consultationValidUntil
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Dosage Instructions
                </h4>
                <p className="text-blue-800 text-sm">
                  {treatmentPlan?.dosageInstructions ||
                    "No specific instructions provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">
                  #{orderSummary?.orderNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation fee:</span>
                <span>${orderSummary?.consultationFee || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">First month treatment:</span>
                <span>${orderSummary?.firstMonthTreatment || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid:</span>
                <span>${orderSummary?.totalPaid || "0.00"}</span>
              </div>
              {orderSummary?.nextBilling && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Next Billing</h4>
                  <p className="text-sm text-gray-600">
                    Your next charge of ${orderSummary.nextBilling.amount} will
                    occur on{" "}
                    {orderSummary.nextBilling.date
                      ? new Date(
                          orderSummary.nextBilling.date
                        ).toLocaleDateString()
                      : new Date(
                          Date.now() + 30 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Shipping Timeline */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">
                    Prescription Review (1-2 business days)
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Our licensed physicians will review your consultation and
                    finalize your prescription.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">
                    Medication Preparation (2-3 business days)
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Your medication will be compounded and prepared for
                    shipment.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">
                    Delivery (2-3 business days)
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Your medication will be shipped in discrete,
                    temperature-controlled packaging.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund/Adjustment Notice */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Dosage Adjustment Policy
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              If our medical team determines a different dosage is more
              appropriate for you, we'll automatically adjust your treatment
              plan. Any price difference will be refunded or charged
              accordingly.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>If dosage is reduced:</strong>
                <br />
                <span className="text-yellow-700">
                  You'll receive a credit for the difference
                </span>
              </div>
              <div>
                <strong>If dosage is increased:</strong>
                <br />
                <span className="text-yellow-700">
                  We'll charge the additional amount
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            size="lg"
            onClick={() => router.push("/profile")}
            className="flex items-center"
          >
            <Package className="h-4 w-4 mr-2" />
            Manage My Subscriptions
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/products")}
          >
            Explore More Treatments
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostConsultationSummaryComponent;
