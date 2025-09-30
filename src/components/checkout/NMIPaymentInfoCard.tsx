"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, AlertCircle, RefreshCw } from "lucide-react";
import RenderFormError from "../RenderFormError";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const NMIPaymentInfoCard = ({
  formFields,
  errors,
  isCollectJSLoaded,
  paymentError,
  handleOnChange,
}: {
  formFields: any;
  errors: any;
  isCollectJSLoaded: boolean;
  paymentError: string | null;
  handleOnChange: (field: string, value: string) => void;
}) => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Set a timeout for loading CollectJS
    const timeout = setTimeout(() => {
      if (!isCollectJSLoaded) {
        setLoadingTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [isCollectJSLoaded]);

  useEffect(() => {
    if (isCollectJSLoaded) {
      setLoadingTimeout(false);
    }
  }, [isCollectJSLoaded]);

  const handleRetry = () => {
    setLoadingTimeout(false);
    window.location.reload();
  };

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
        {!isCollectJSLoaded && !loadingTimeout && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-800">
              Loading secure payment form...
            </p>
          </div>
        )}

        {loadingTimeout && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                Payment system is taking longer than expected to load.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              style={{
                color: merchantData?.customizeBranding?.accentColor,
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
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

        {/* Accepted Cards */}
        <div className="pt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">We accept:</p>
          <div className="flex items-center space-x-4">
            <img
              src="/visa.png"
              alt="Visa"
              className="h-8 w-auto opacity-90 hover:opacity-100 hover:scale-110 hover:drop-shadow-md transition-all duration-300 ease-in-out"
            />
            <img
              src="/mastercard.png"
              alt="Mastercard"
              className="h-8 w-auto opacity-90 hover:opacity-100 hover:scale-110 hover:drop-shadow-md transition-all duration-300 ease-in-out"
            />
            <img
              src="/american_express.png"
              alt="American Express"
              className="h-8 w-auto opacity-90 hover:opacity-100 hover:scale-110 hover:drop-shadow-md transition-all duration-300 ease-in-out"
            />
            <img
              src="/discover-card-logo-vector.png"
              alt="Discover"
              className="h-8 w-auto opacity-90 hover:opacity-100 hover:scale-110 hover:drop-shadow-md transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Test Card Info for Development */}
        {/* {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">Test Mode</p>
            <p className="text-xs text-yellow-700 mt-1">
              Test Card: 4111111111111111 | Expiry: Any future date | CVV: Any 3
              digits
            </p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default NMIPaymentInfoCard;
