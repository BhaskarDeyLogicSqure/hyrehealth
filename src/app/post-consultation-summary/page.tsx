"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Package, CreditCard } from "lucide-react";

const PostConsultationSummary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("order") || "HH-2024-001";
  const product = searchParams.get("product") || "Semaglutide";

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
                <span className="font-semibold">{product}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved Dosage:</span>
                <Badge className="bg-green-100 text-green-800">
                  0.25mg (Starting dose)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consultation Valid Until:</span>
                <span className="font-semibold">
                  {new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Dosage Instructions
                </h4>
                <p className="text-blue-800 text-sm">
                  Start with 0.25mg once weekly for the first month. Our medical
                  team will monitor your progress and may adjust your dosage as
                  needed.
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
                <span className="font-semibold">#{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation fee:</span>
                <span>$49.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">First month treatment:</span>
                <span>$299.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid:</span>
                <span>$348.00</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Next Billing</h4>
                <p className="text-sm text-gray-600">
                  Your next charge of $299.00 will occur on{" "}
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
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

export default PostConsultationSummary;
