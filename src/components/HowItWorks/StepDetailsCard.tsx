"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Step } from "./StepsDetails";
import { UserCheck, MessageSquare, Shield, Package, Truck } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface StepDetailsCardProps {
  step: Step;
  index: number;
  totalSteps: number;
}

const StepDetailsCard = ({ step, index, totalSteps }: StepDetailsCardProps) => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  const _getIconComponent = (icon: string) => {
    switch (icon) {
      case "UserCheck":
        return UserCheck;
      case "MessageSquare":
        return MessageSquare;
      case "Shield":
        return Shield;
      case "Package":
        return Package;
      case "Truck":
        return Truck;
      default:
        return UserCheck;
    }
  };

  const IconComponent = useMemo(
    () => _getIconComponent(step?.icon),
    [step?.icon]
  );

  return (
    <Card key={step?.step} className="overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex items-center gap-4 md:flex-col md:text-center">
            <div
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: merchantData?.customizeBranding?.brandColor,
                opacity: 0.8,
              }}
            >
              <IconComponent
                className="h-8 w-8 text-blue-600"
                style={{
                  color: merchantData?.customizeBranding?.accentColor,
                }}
              />
            </div>
            <Badge
              className="bg-blue-600 hover:bg-blue-700"
              style={{
                backgroundColor: merchantData?.customizeBranding?.brandColor,
              }}
            >
              Step {step?.step}
            </Badge>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {step?.title}
            </h3>
            <p className="text-gray-600 mb-4 text-lg">{step?.description}</p>
            <ul className="space-y-2">
              {step?.details?.map((detail: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {index < totalSteps - 1 && (
            <div className="hidden md:flex items-center">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepDetailsCard;
