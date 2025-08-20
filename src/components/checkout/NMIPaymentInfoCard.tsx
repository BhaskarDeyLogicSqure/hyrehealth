"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Shield, AlertCircle, CheckCircle } from "lucide-react";
import RenderFormError from "../RenderFormError";

const NMIPaymentInfoCard = ({
  formFields,
  errors,
  isCollectJSLoaded,
  paymentError,
  paymentToken,
  handleOnChange,
}: {
  formFields: any;
  errors: any;
  isCollectJSLoaded: boolean;
  paymentError: string | null;
  paymentToken: string | null;
  handleOnChange: (field: string, value: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
          <div className="ml-auto flex items-center text-sm text-green-600">
            <Shield className="h-4 w-4 mr-1" />
            Secured by NMI
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Messages */}
        {!isCollectJSLoaded && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-800">
              Loading secure payment form...
            </p>
          </div>
        )}

        {paymentError && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{paymentError}</p>
          </div>
        )}

        {/* Payment Fields - Replace inputs with Collect.js containers when loaded */}
        {isCollectJSLoaded ? (
          <>
            {/* Card Number - Collect.js Field */}
            <div>
              <Label htmlFor="ccnumber">
                Card Number <span className="text-red-600">*</span>
              </Label>
              <div
                id="ccnumber"
                data-collect-js="ccnumber"
                className="w-full"
                style={{ minHeight: "40px" }}
              />
              <RenderFormError errors={errors} field="ccnumber" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Expiry Date - Collect.js Field */}
              <div>
                <Label htmlFor="ccexp">
                  Expiry Date <span className="text-red-600">*</span>
                </Label>
                <div
                  id="ccexp"
                  data-collect-js="ccexp"
                  className="w-full"
                  style={{ minHeight: "40px" }}
                />
                <RenderFormError errors={errors} field="ccexp" />
              </div>

              {/* CVV - Collect.js Field */}
              <div>
                <Label htmlFor="cvv">
                  CVV <span className="text-red-600">*</span>
                </Label>
                <div
                  id="cvv"
                  data-collect-js="cvv"
                  className="w-full"
                  style={{ minHeight: "40px" }}
                />
                <RenderFormError errors={errors} field="cvv" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Fallback regular static inputs while loading */}
            <div>
              <Label htmlFor="cardNumber">
                Card Number <span className="text-red-600">*</span>
              </Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                // value={formFields?.cardNumber || ""}
                // onChange={(e) => handleOnChange("cardNumber", e.target.value)}
                required
                className={errors?.cardNumber ? "border-red-500" : ""}
                disabled
              />
              {/* <RenderFormError errors={errors} field="cardNumber" /> */}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">
                  Expiry Date <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  // value={formFields?.expiryDate || ""}
                  // onChange={(e) => handleOnChange("expiryDate", e.target.value)}
                  required
                  className={errors?.expiryDate ? "border-red-500" : ""}
                  disabled
                />
                {/* <RenderFormError errors={errors} field="expiryDate" /> */}
              </div>

              <div>
                <Label htmlFor="form_cvv">
                  CVV <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="form_cvv"
                  placeholder="123"
                  // value={formFields?.cvv || ""}
                  // onChange={(e) => handleOnChange("cvv", e.target.value)}
                  required
                  className={errors?.cvv ? "border-red-500" : ""}
                  disabled
                />
                {/* <RenderFormError errors={errors} field="cvv" /> */}
              </div>
            </div>
          </>
        )}

        {/* Cardholder Name - Regular Input */}
        <div>
          <Label htmlFor="cardholderName">
            Cardholder Name <span className="text-red-600">*</span>
          </Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={formFields?.cardholderName || ""}
            onChange={(e) => handleOnChange("cardholderName", e.target.value)}
            required
            className={errors?.cardholderName ? "border-red-500" : ""}
          />
          <RenderFormError errors={errors} field="cardholderName" />
        </div>

        {/* Token Generation Button */}
        {/* <div className="pt-4">
          <Button
            type="button"
            onClick={generateToken}
            disabled={!isCollectJSLoaded || isProcessing || !!paymentToken}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating Token...
              </>
            ) : paymentToken ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Token Generated
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Generate Payment Token
              </>
            )}
          </Button>
        </div> */}

        {/* Test Card Info for Development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">Test Mode</p>
            <p className="text-xs text-yellow-700 mt-1">
              Test Card: 4111111111111111 | Expiry: Any future date | CVV: Any 3
              digits
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NMIPaymentInfoCard;
