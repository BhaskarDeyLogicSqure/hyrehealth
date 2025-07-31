import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import CardPaymentComponent from "./CardPaymentComponent";
import AchPaymentComponent from "./AchPaymentComponent";
import PayLaterComponent from "./PayLaterComponent";
import {
  PaymentMethod,
  PaymentDetails,
  PaymentResult,
} from "../../types/payment";
import { CreditCard, Building2, Clock, ArrowLeft } from "lucide-react";
import { DIGITS_AFTER_DECIMALS } from "@/configs";
interface PaymentPageProps {
  userToken: string;
  paymentDetails: PaymentDetails;
  onPaymentSuccess: (result: PaymentResult) => void;
  onCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  userToken,
  paymentDetails,
  onPaymentSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleBackToSelection = () => {
    setSelectedMethod(null);
  };

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      title: "Credit/Debit Card",
      description: "Pay instantly with your credit or debit card",
      icon: CreditCard,
      features: [
        "Instant payment processing",
        "Secure 3D authentication",
        "Save cards for future use",
        "All major cards accepted",
      ],
      processingTime: "Instant",
      fees: "2.9% + $0.30",
      recommended: true,
    },
    {
      id: "ach" as PaymentMethod,
      title: "Bank Transfer (ACH)",
      description: "Pay directly from your bank account",
      icon: Building2,
      features: [
        "Lower processing fees",
        "Direct bank account debit",
        "Secure bank verification",
        "Save accounts for future use",
      ],
      processingTime: "3-5 business days",
      fees: "$5.00 flat fee",
      recommended: false,
    },
    {
      id: "pay_later" as PaymentMethod,
      title: "Pay Later",
      description: "Defer payment for up to 90 days",
      icon: Clock,
      features: [
        "Flexible payment scheduling",
        "Up to 90 days deferral",
        "Email reminders",
        "Pay early anytime",
      ],
      processingTime: "Deferred",
      fees: "No fees (if paid on time)",
      recommended: false,
    },
  ];

  // If a method is selected, render the appropriate component
  if (selectedMethod) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToSelection}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Payment Methods</span>
          </Button>
        </div>

        {/* Render selected payment component */}
        {selectedMethod === "card" && (
          <CardPaymentComponent
            userToken={userToken}
            paymentDetails={paymentDetails}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={handleBackToSelection}
          />
        )}

        {selectedMethod === "ach" && (
          <AchPaymentComponent
            userToken={userToken}
            paymentDetails={paymentDetails}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={handleBackToSelection}
          />
        )}

        {selectedMethod === "pay_later" && (
          <PayLaterComponent
            userToken={userToken}
            paymentDetails={paymentDetails}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={handleBackToSelection}
          />
        )}
      </div>
    );
  }

  // Render payment method selection
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Payment Method
        </h1>
        <p className="text-gray-600 text-lg">
          Select your preferred payment method to complete your purchase
        </p>
      </div>

      {/* Payment amount summary */}
      <div className="bg-gradient-to-r from-brand-dark-blue to-brand-light-blue/80 rounded-lg p-6 mb-8 text-white">
        <div className="text-center">
          <div className="text-sm opacity-90 mb-2">Total Amount</div>
          <div className="text-4xl font-bold mb-2">
            ${paymentDetails.amount.toFixed(DIGITS_AFTER_DECIMALS)}
          </div>
          <div className="text-sm opacity-90">
            {paymentDetails.currency.toUpperCase()}
          </div>
          {paymentDetails.description && (
            <div className="text-sm opacity-90 mt-3 max-w-md mx-auto">
              {paymentDetails.description}
            </div>
          )}
        </div>
      </div>

      {/* Payment methods grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <Card
              key={method.id}
              className={`relative p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                method.recommended
                  ? "border-brand-dark-blue bg-brand-light-blue/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              {method.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-gold text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    method.recommended
                      ? "bg-brand-dark-blue text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <IconComponent className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {method.description}
                </p>

                <div className="space-y-2 mb-4">
                  {method.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">{method.processingTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fees:</span>
                    <span className="font-medium">{method.fees}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Security notice */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Secure Payment Processing
            </h4>
            <p className="text-sm text-gray-600">
              All payments are processed securely using industry-standard
              encryption. Your financial information is protected and never
              stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Cancel button */}
      <div className="text-center">
        <Button variant="outline" onClick={onCancel} size="lg">
          Cancel Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
