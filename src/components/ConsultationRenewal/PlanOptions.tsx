"use client";

import React, { useState, useEffect, useCallback } from "react";
import RenewalPlanCard from "./RenewalPlanCard";
import { PlanOption } from "@/types/renewalPage";
import CheckoutCTA from "./CheckoutCTA";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface PlanOptionsProps {
  currentPlan: any;
  extensionPlans?: Array<{
    id: string;
    name: string;
    badge: string;
    price: number;
    originalPrice: number;
    duration: {
      value: number;
      unit: string;
    };
    estimatedDeliveryTime: string;
    savings: number;
    isPopular: boolean;
    isBestValue: boolean;
    strength: number;
    isDefault: boolean;
  }>;
}

const PlanOptions = ({ currentPlan, extensionPlans }: PlanOptionsProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDosage, setSelectedDosage] = useState<number | null>(null);

  const _handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Get unique dosages from extension plans
  const _getAvailableDosages = useCallback(() => {
    if (!extensionPlans || extensionPlans?.length === 0) return [];

    const dosages = Array.from(
      new Set(extensionPlans?.map((plan) => plan?.strength))
    );
    return dosages?.sort((a, b) => a - b); // Sort in ascending order
  }, [extensionPlans]);

  // Set default dosage when extension plans are loaded
  useEffect(() => {
    const availableDosages = _getAvailableDosages();
    if (availableDosages?.length > 0 && selectedDosage === null) {
      // Try to match current treatment strength first, otherwise use the first available
      const currentStrength = currentPlan?.strength;
      const defaultDosage = availableDosages?.includes(currentStrength)
        ? currentStrength
        : availableDosages[0];

      setSelectedDosage(defaultDosage);
    }
  }, [extensionPlans, currentPlan?.strength, selectedDosage]);

  // Filter plans by selected dosage
  const _getFilteredPlansByDosage = () => {
    if (!extensionPlans || selectedDosage === null) return [];

    return extensionPlans?.filter((plan) => plan?.strength === selectedDosage);
  };

  // Convert extension plans to PlanOption format for the UI
  const _convertToPlanOptions = (
    plans: typeof extensionPlans
  ): PlanOption[] => {
    if (!plans) return [];

    return plans?.map((plan) => ({
      id: plan?.id,
      duration: {
        value: plan?.duration?.value,
        unit: plan?.duration?.unit,
      },
      price: plan?.price,
      originalPrice:
        plan?.originalPrice > plan?.price ? plan?.originalPrice : undefined,
      savings: plan?.savings > 0 ? plan?.savings : undefined,
      title:
        plan?.name || `${plan?.duration?.value}-${plan?.duration?.unit} Plan`,
      badge:
        plan?.badge ||
        (plan?.isPopular
          ? "Most Popular"
          : plan?.isBestValue
          ? "Best Value"
          : undefined),
      estimatedDeliveryTime: plan?.estimatedDeliveryTime,
    }));
  };

  const availableDosages = _getAvailableDosages();
  const filteredPlans = _getFilteredPlansByDosage();
  const planOptions = _convertToPlanOptions(filteredPlans);

  // Reset selected plan when dosage changes
  useEffect(() => {
    setSelectedPlan(null);
  }, [selectedDosage]);

  return (
    <>
      <div className="space-y-6">
        {/* Dosage Selection */}
        {availableDosages?.length > 0 && (
          <div className="space-y-3">
            <Label
              htmlFor="dosage-select"
              className="text-lg font-semibold theme-text-primary"
            >
              Select Dosage
            </Label>
            <Select
              value={selectedDosage?.toString() || ""}
              onValueChange={(value) => setSelectedDosage(Number(value))}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Choose dosage" />
              </SelectTrigger>
              <SelectContent>
                {availableDosages?.map((dosage) => (
                  <SelectItem key={dosage} value={dosage?.toString()}>
                    {dosage}mg
                    {currentPlan?.strength === dosage && " (Current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Plan Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold theme-text-primary">
            Choose Your Extension
          </h2>
          {planOptions && planOptions?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {planOptions?.map((plan) => (
                <RenewalPlanCard
                  key={plan?.id}
                  plan={plan}
                  selectedPlan={selectedPlan}
                  handlePlanSelect={_handlePlanSelect}
                />
              ))}
            </div>
          ) : selectedDosage ? (
            <div className="text-center py-8">
              <p className="theme-text-muted">
                No extension plans available for {selectedDosage}mg dosage.
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="theme-text-muted">
                Please select a dosage to view available plans.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout CTA */}
      {planOptions && planOptions?.length > 0 && (
        <CheckoutCTA
          selectedPlanId={selectedPlan}
          currentPlan={currentPlan}
          selectedDosage={selectedDosage}
        />
      )}
    </>
  );
};

export default PlanOptions;
