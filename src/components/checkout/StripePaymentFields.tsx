"use client";

import React, { useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/components/GlobalErrorHandler";
import { STRIPE_KEY, DIGITS_AFTER_DECIMALS } from "@/configs";

/**
 * Stripe payment step (Connect direct charge): a full-screen payment surface
 * with a Back button and a pay button.
 *
 * The PaymentIntent is created server-side (`/payment/stripe/create-intent`);
 * this component only mounts the PaymentElement on the merchant's connected
 * account and confirms the intent client-side. Fulfillment happens
 * asynchronously via the backend's Stripe webhook, so after confirmation the
 * parent polls invoice-status before routing to the thank-you page.
 */

// Stripe.js must be loaded with the connected account id for Connect direct
// charges. Cache one instance per account so we don't reload the SDK on rerender.
const stripePromiseCache = new Map<string, Promise<Stripe | null>>();
const getStripePromise = (stripeAccountId: string) => {
  let promise = stripePromiseCache.get(stripeAccountId);
  if (!promise) {
    promise = loadStripe(STRIPE_KEY || "", { stripeAccount: stripeAccountId });
    stripePromiseCache.set(stripeAccountId, promise);
  }
  return promise;
};

export type StripePaymentFieldsProps = {
  clientSecret: string;
  /** Merchant's connected account id — required to init Stripe.js. */
  stripeAccountId: string;
  /** Reference id of the pending payment (for the redirect return_url). */
  referenceId: string;
  /** Amount charged now, in dollars — display only. */
  finalAmount: number;
  currency?: string;
  /** Fired once the PaymentIntent is confirmed client-side (succeeded/processing). */
  onConfirmed: () => void;
  onBack: () => void;
  /** Parent is polling invoice-status after confirmation; keeps the button busy. */
  isProcessing?: boolean;
};

type StripePaymentFormProps = Omit<
  StripePaymentFieldsProps,
  "clientSecret" | "stripeAccountId"
>;

const StripePaymentForm = ({
  referenceId,
  finalAmount,
  currency,
  onConfirmed,
  onBack,
  isProcessing,
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);

  const busy = isConfirming || Boolean(isProcessing);

  const _handlePay = async () => {
    if (!stripe || !elements) {
      showErrorToast("Payment fields are not ready yet");
      return;
    }

    try {
      setIsConfirming(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        // Handle 3DS inline where possible; only redirect if the card requires it.
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/checkout?ref=${encodeURIComponent(
            referenceId
          )}`,
        },
      });

      if (error) {
        // Card errors / validation surface here with a user-friendly message.
        showErrorToast(
          error.message || "Payment could not be completed. Please try again."
        );
        return;
      }

      const status = paymentIntent?.status;
      // "succeeded": captured. "processing": async settling — fulfillment still
      // proceeds via webhook, so treat it as confirmed and let the parent poll.
      if (status === "succeeded" || status === "processing") {
        onConfirmed();
        return;
      }

      showErrorToast("Payment was not completed. Please try again.");
    } catch (e) {
      showErrorToast(
        (e as { message?: string })?.message ||
          "Payment could not be completed. Please try again."
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const amountLabel = Number.isFinite(finalAmount)
    ? `$${Number(finalAmount).toFixed(DIGITS_AFTER_DECIMALS)}${
        currency ? ` ${currency.toUpperCase()}` : ""
      }`
    : null;

  return (
    <div className="mx-auto w-full max-w-[560px] space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={busy}
        className="inline-flex h-9 items-center gap-2 px-3 mt-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="rounded-lg border bg-background p-4">
        <PaymentElement onReady={() => setIsElementReady(true)} />
      </div>

      <Button
        type="button"
        className="w-full py-3 text-lg font-medium"
        disabled={!stripe || !elements || !isElementReady || busy}
        onClick={_handlePay}
      >
        {busy
          ? "Processing..."
          : amountLabel
          ? `Pay ${amountLabel}`
          : "Complete Purchase"}
      </Button>
    </div>
  );
};

export default function StripePaymentFields({
  clientSecret,
  stripeAccountId,
  referenceId,
  finalAmount,
  currency,
  onConfirmed,
  onBack,
  isProcessing,
}: StripePaymentFieldsProps) {
  const stripePromise = useMemo(
    () => getStripePromise(stripeAccountId),
    [stripeAccountId]
  );

  if (!STRIPE_KEY) {
    // Misconfiguration guard — without the publishable key Stripe.js can't load.
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
        <div className="rounded-lg border bg-background p-4 text-sm text-red-600">
          Payment is not configured correctly. Please contact support.
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <StripePaymentForm
        referenceId={referenceId}
        finalAmount={finalAmount}
        currency={currency}
        onConfirmed={onConfirmed}
        onBack={onBack}
        isProcessing={isProcessing}
      />
    </Elements>
  );
}
