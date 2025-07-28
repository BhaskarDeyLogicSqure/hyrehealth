import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import RenderFormError from "../RenderFormError";

const PaymentInfoCard = ({
  formFields,
  errors,
  handleOnChange,
}: {
  formFields: any;
  errors: any;
  handleOnChange: (field: string, value: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">
            Card Number <span className="text-red-600">*</span>
          </Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formFields?.cardNumber}
            onChange={(e) => handleOnChange("cardNumber", e.target.value)}
            required
            className={errors?.cardNumber ? "border-red-500" : ""}
          />
          <RenderFormError errors={errors} field="cardNumber" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">
              Expiry Date <span className="text-red-600">*</span>
            </Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={formFields?.expiryDate}
              onChange={(e) => handleOnChange("expiryDate", e.target.value)}
              required
              className={errors?.expiryDate ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="expiryDate" />
          </div>

          <div>
            <Label htmlFor="cvv">
              CVV <span className="text-red-600">*</span>
            </Label>
            <Input
              id="cvv"
              placeholder="123"
              value={formFields?.cvv}
              onChange={(e) => handleOnChange("cvv", e.target.value)}
              required
              className={errors?.cvv ? "border-red-500" : ""}
            />
            <RenderFormError errors={errors} field="cvv" />
          </div>
        </div>

        <div>
          <Label htmlFor="cardholderName">
            Cardholder Name <span className="text-red-600">*</span>
          </Label>
          <Input
            id="cardholderName"
            value={formFields?.cardholderName}
            onChange={(e) => handleOnChange("cardholderName", e.target.value)}
            required
            className={errors?.cardholderName ? "border-red-500" : ""}
          />
          <RenderFormError errors={errors} field="cardholderName" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;
