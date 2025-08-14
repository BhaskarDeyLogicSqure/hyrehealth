"use client";

import React from "react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/dayjs";
import { formatPriceInDollars } from "@/lib/utils";
import { US_SHORT_DATE_FORMAT } from "@/configs";

const RenewalPlanCard = ({
  plan,
  selectedDosageAndDuration,
  handlePlanSelect,
}: {
  plan: any;
  selectedDosageAndDuration: any;
  handlePlanSelect: any;
}) => {
  return (
    <Card
      key={plan?.id}
      className={`cursor-pointer transition-all border-2 ${
        selectedDosageAndDuration?.dosage === plan?.strength &&
        selectedDosageAndDuration?.duration === plan?.duration?.value
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
      onClick={() => handlePlanSelect(plan?.strength, plan?.duration?.value)}
    >
      <CardHeader className="relative">
        {plan?.badge && (
          <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
            {plan?.badge}
          </Badge>
        )}
        <CardTitle className="flex justify-between items-center">
          <span className="theme-text-primary">{plan?.title}</span>
          <div className="text-right">
            <div className="text-2xl font-bold theme-text-primary">
              {formatPriceInDollars(plan?.price)}
            </div>
            {plan?.originalPrice && (
              <div className="text-sm theme-text-muted line-through">
                {formatPriceInDollars(plan?.originalPrice)}
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="theme-text-muted">Duration</span>
          <span className="font-medium theme-text-primary">
            {plan?.duration?.value} month
            {plan?.duration?.value > 1 ? "s" : ""}
          </span>
        </div>
        {plan?.savings && (
          <div className="flex justify-between text-sm">
            <span className="theme-text-muted">You save</span>
            <span className="font-medium text-green-600">
              {formatPriceInDollars(plan?.savings)}
            </span>
          </div>
        )}
        {plan?.estimatedDeliveryTime ? (
          <div className="flex justify-between text-sm">
            <span className="theme-text-muted">Estimated delivery</span>
            <span className="font-medium theme-text-primary">
              {formatDate(plan?.estimatedDeliveryTime, US_SHORT_DATE_FORMAT)}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RenewalPlanCard;
