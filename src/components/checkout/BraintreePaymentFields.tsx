"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/components/GlobalErrorHandler";
import { ArrowLeft } from "lucide-react";
import { useBraintreeDropin } from "@/hooks/useBraintreeDropin";

export type BraintreePaymentMethodPayload = {
  nonce: string;
  deviceData?: string;
};

export default function BraintreePaymentFields({
  clientToken,
  finalAmount,
  onBack,
  onPaymentMethod,
}: {
  clientToken: string;
  /** Amount in cents, used as (finalAmount / 100) for 3DS */
  finalAmount: number;
  onBack: () => void;
  onPaymentMethod: (payload: BraintreePaymentMethodPayload) => void;
}) {
  const [isRequesting, setIsRequesting] = useState(false);

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
      const dropin = instance.current;
      if (!dropin) {
        showErrorToast("Payment fields are not ready yet");
        return;
      }

      setIsRequesting(true);

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
      showSuccessToast("Payment method captured.");
    } catch (e) {
      showErrorToast(
        (e as { message?: string })?.message ||
        "Could not confirm payment method. Please try again."
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
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
        disabled={isLoading || isRequesting}
        onClick={_handlePay}
      >
        {isLoading || isRequesting ? "Processing..." : "Complete Purchase"}
      </Button>
    </div>
  );
}

