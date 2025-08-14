import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import PlanOptions from "./PlanOptions";

const ConsultationRenewalComponent = ({
  currentPlan,
}: {
  currentPlan: any;
}) => {
  return (
    <div className="min-h-screen theme-bg">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold theme-text-primary">
              Ready to continue your treatment?
            </h1>
            <p className="text-lg theme-text-muted">
              Extend your {currentPlan.product} subscription and keep your
              progress going.
            </p>
          </div>

          {/* Dosage Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="theme-text-primary">
                  Your Current Treatment
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm theme-text-muted">Product</div>
                  <div className="font-medium theme-text-primary">
                    {currentPlan.product}
                  </div>
                </div>
                <div>
                  <div className="text-sm theme-text-muted">Current Dosage</div>
                  <div className="font-medium theme-text-primary">
                    {currentPlan.dosage}
                  </div>
                </div>
                <div>
                  <div className="text-sm theme-text-muted">
                    Last Consultation
                  </div>
                  <div className="font-medium theme-text-primary">
                    {currentPlan.lastConsultation}
                  </div>
                </div>
              </div>
              {currentPlan.isConsultationValid && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    Your last approved dosage will be used for this order.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan Options with Checkout CTA */}
          <PlanOptions currentPlan={currentPlan} />
        </div>
      </main>
    </div>
  );
};

export default ConsultationRenewalComponent;
