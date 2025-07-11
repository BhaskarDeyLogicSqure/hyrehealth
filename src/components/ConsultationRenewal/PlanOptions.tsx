"use client";

import React, { useState } from "react";
import RenewalPlanCard from "./RenewalPlanCard";
import { PlanOption } from "@/types/renewalPage";
import CheckoutCTA from "./CheckoutCTA";

const PlanOptions = ({ currentPlan }: { currentPlan: PlanOption }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const _handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const getPlanOptions = (): PlanOption[] => {
    if (currentPlan.duration === 1) {
      return [
        {
          id: "1-month",
          duration: 1,
          price: 89,
          title: "1-Month Plan",
          badge: "Quick Renewal",
        },
        {
          id: "2-month",
          duration: 2,
          price: 158,
          originalPrice: 178,
          savings: 20,
          title: "2-Month Plan",
          badge: "Most Popular",
        },
        {
          id: "3-month",
          duration: 3,
          price: 237,
          originalPrice: 267,
          savings: 30,
          title: "3-Month Plan",
          badge: "Best Value",
        },
      ];
    } else if (currentPlan.duration === 2) {
      return [
        {
          id: "1-month",
          duration: 1,
          price: 89,
          title: "Add 1 More Month",
        },
      ];
    }
    return [];
  };

  const planOptions = getPlanOptions();

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold theme-text-primary">
          Choose Your Extension
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {planOptions?.map((plan) => (
            <RenewalPlanCard
              key={plan?.id}
              plan={plan}
              selectedPlan={selectedPlan}
              handlePlanSelect={_handlePlanSelect}
            />
          ))}
        </div>
      </div>

      {/* Checkout CTA */}
      <CheckoutCTA selectedPlanId={selectedPlan} currentPlan={currentPlan} />
    </>
  );
};

export default PlanOptions;
