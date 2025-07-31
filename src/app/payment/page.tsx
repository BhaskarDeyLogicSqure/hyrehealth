"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PaymentPage from "../../components/payments/PaymentPage";
import { PaymentDetails, PaymentResult } from "../../types/payment";
import { toast } from "sonner";

// Mock user token - in real app this would come from auth context
const MOCK_USER_TOKEN = "mock-user-token-12345";

// Mock payment details - in real app this would come from order/cart context
const MOCK_PAYMENT_DETAILS: PaymentDetails = {
  orderId: "ORD-2024-001",
  amount: 299.99,
  currency: "usd",
  description: "Premium Gift Box - Holiday Collection",
  customerEmail: "customer@example.com",
};

export default function PaymentPageRoute() {
  const router = useRouter();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );

  const handlePaymentSuccess = (result: PaymentResult) => {
    console.log("Payment successful:", result);
    setPaymentResult(result);
    setPaymentCompleted(true);

    // Show success message
    toast.success(
      `Payment ${
        result.method === "pay_later" ? "deferred" : "processed"
      } successfully!`
    );

    // In a real app, you might redirect to a success page or update order status
    // router.push(`/order/confirmation?paymentId=${result.paymentId}`);
  };

  const handleCancel = () => {
    console.log("Payment cancelled");
    toast.info("Payment cancelled");

    // In a real app, you might redirect back to the order or cart page
    router.push("/dashboard");
  };

  const handleStartNewPayment = () => {
    setPaymentCompleted(false);
    setPaymentResult(null);
  };

  if (paymentCompleted && paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-green-600 mb-6">
              <svg
                className="w-20 h-20 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {paymentResult.method === "pay_later"
                ? "Payment Deferred!"
                : "Payment Successful!"}
            </h1>

            <p className="text-gray-600 mb-6">
              {paymentResult.method === "pay_later"
                ? "Your payment has been scheduled successfully. You will receive reminders before the due date."
                : "Thank you for your payment. Your transaction has been processed successfully."}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Payment ID:</span>
                  <div className="font-semibold">{paymentResult.paymentId}</div>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <div className="font-semibold">
                    ${MOCK_PAYMENT_DETAILS.amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Method:</span>
                  <div className="font-semibold capitalize">
                    {paymentResult.method === "pay_later"
                      ? "Pay Later"
                      : paymentResult.method === "ach"
                      ? "Bank Transfer"
                      : "Credit Card"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <div className="font-semibold">
                    {MOCK_PAYMENT_DETAILS.orderId}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-brand-dark-blue text-white px-6 py-3 rounded-lg hover:bg-brand-dark-blue/90 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleStartNewPayment}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                New Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Payment
          </h1>
          <p className="text-xl text-gray-600">
            Choose your preferred payment method and complete your purchase
            securely
          </p>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-800 mb-1">
                Demo Payment System
              </h4>
              <p className="text-sm text-blue-700">
                This is a demonstration of the payment system. No real payments
                will be processed. All payment methods are fully functional for
                testing purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Component */}
        <PaymentPage
          userToken={MOCK_USER_TOKEN}
          paymentDetails={MOCK_PAYMENT_DETAILS}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
