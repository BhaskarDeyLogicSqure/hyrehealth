import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";

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
          <Label htmlFor="cardNumber">Card Number *</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formFields?.cardNumber}
            onChange={(e) => handleOnChange("cardNumber", e.target.value)}
            required
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={formFields?.expiryDate}
              onChange={(e) => handleOnChange("expiryDate", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={formFields?.cvv}
              onChange={(e) => handleOnChange("cvv", e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="cardholderName">Cardholder Name *</Label>
          <Input
            id="cardholderName"
            value={formFields?.cardholderName}
            onChange={(e) => handleOnChange("cardholderName", e.target.value)}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;
