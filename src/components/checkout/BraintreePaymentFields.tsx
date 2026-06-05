"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import { ArrowLeft } from "lucide-react";
import { useBraintreeDropin } from "@/hooks/useBraintreeDropin";

export type BraintreePaymentMethodPayload = {
  nonce: string;
  deviceData?: string;
};

export default function BraintreePaymentFields({
  clientToken,
  finalAmount,
  isBraintreePaymentProcessing,
  onBack,
  onPaymentMethod,
}: {
  clientToken: string;
  /** Amount in cents, used as (finalAmount / 100) for 3DS */
  finalAmount: number;
  isBraintreePaymentProcessing: boolean;
  onBack: () => void;
  onPaymentMethod: (payload: BraintreePaymentMethodPayload) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  // const threeDSAmount = useMemo(() => {
  //   const amount = Number(finalAmount || 0) / 100;
  //   return amount.toFixed(2);
  // }, [finalAmount]);

  const { containerRef, instance, isLoading, error } = useBraintreeDropin({
    clientToken,
    threeDSecure: true,
  });

  useEffect(() => {
    if (error) showErrorToast(error);
  }, [error]);

  const _handlePay = async () => {
    try {
      setIsProcessing(true);

      const dropin = instance.current;
      if (!dropin) {
        showErrorToast("Payment fields are not ready yet");
        return;
      }

      const result = await dropin.requestPaymentMethod({
        threeDSecure: {
          amount: finalAmount,
        },
      });
      // console.log({ finalAmount, result })

      const nonce = result?.nonce;
      const deviceData = result?.deviceData;

      if (!nonce) {
        showErrorToast("Could not get payment method. Please try again.");
        return;
      }

      onPaymentMethod({ nonce, deviceData });
    } catch (e) {
      showErrorToast(
        (e as { message?: string })?.message ||
        "Could not confirm payment method. Please try again."
      );
    } finally {
      setIsProcessing(false)
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
  //       <svg
  //         className="animate-spin h-10 w-10 text-primary"
  //         xmlns="http://www.w3.org/2000/svg"
  //         fill="none"
  //         viewBox="0 0 24 24"
  //       >
  //         <circle
  //           className="opacity-25"
  //           cx="12"
  //           cy="12"
  //           r="10"
  //           stroke="currentColor"
  //           strokeWidth="4"
  //         />
  //         <path
  //           className="opacity-75"
  //           fill="currentColor"
  //           d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
  //         />
  //       </svg>
  //       <span className="ml-4 text-lg text-gray-700">Loading payment fields...</span>
  //     </div>
  //   );
  // }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <svg
            className="animate-spin h-10 w-10 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="ml-4 text-lg text-gray-700">Loading payment fields...</span>
        </div>
      )}

      <div className="mx-auto w-full max-w-[560px] space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="inline-flex h-9 items-center gap-2 px-3 mt-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div
          ref={containerRef}
          className="rounded-lg border bg-background p-4"
          aria-busy={isLoading ? "true" : "false"}
        />

        <Button
          type="button"
          className="w-full py-3 text-lg font-medium"
          disabled={isLoading || isProcessing || isBraintreePaymentProcessing}
          onClick={_handlePay}
        >
          {(isLoading || isProcessing || isBraintreePaymentProcessing) ? "Processing..." : "Complete Purchase"}
        </Button>
      </div>
    </>

  );
}

