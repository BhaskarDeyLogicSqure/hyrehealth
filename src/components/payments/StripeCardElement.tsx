import React, { useState, useImperativeHandle, forwardRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface StripeCardElementProps {
  onCardAdded: (payload: { token: { id: string } }) => void;
  onStripeError: (error: { message?: string }) => void;
  showLoader: () => void;
  hideLoader: () => void;
  onCardChange?: (isValid: boolean) => void;
}

interface StripeCardElementRef {
  createToken: () => void;
}

const StripeCardElement = forwardRef<
  StripeCardElementRef,
  StripeCardElementProps
>(
  (
    { onCardAdded, onStripeError, showLoader, hideLoader, onCardChange },
    ref
  ) => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const stripe = useStripe();
    const elements = useElements();

    const createToken = async () => {
      if (!stripe || !elements) {
        console.log("Stripe.js hasn't loaded yet.");
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.log("Card element not found.");
        return;
      }

      showLoader();

      try {
        const { token, error } = await stripe.createToken(cardElement);

        if (error) {
          hideLoader();
          onStripeError(error);
          setErrorMessage(error.message || "An error occurred");
        } else if (token) {
          onCardAdded({ token });
        }
      } catch (err) {
        console.log("Error creating token:", err);
        hideLoader();
        onStripeError({ message: "An unexpected error occurred" });
      }
    };

    // Expose createToken method to parent component
    useImperativeHandle(ref, () => ({
      createToken,
    }));

    const handleCardChange = (event: {
      error?: { message?: string };
      complete?: boolean;
      empty?: boolean;
    }) => {
      if (event && event.error && event.error.message) {
        setErrorMessage(event.error.message);
        onCardChange?.(false);
      } else {
        setErrorMessage("");
        // Card is valid if it's complete and has no errors
        const isValid = Boolean(event.complete && !event.empty);
        onCardChange?.(isValid);
      }
    };

    const cardElementOptions = {
      style: {
        base: {
          fontSize: "16px",
          color: "#1E3D59",
          fontFamily: "system-ui, -apple-system, sans-serif",
          "::placeholder": {
            color: "#9ca3af",
          },
        },
        invalid: {
          color: "#ef4444",
        },
      },
      hidePostalCode: false,
    };

    return (
      <div className="w-full">
        <div className="p-4 border border-gray-300 rounded-lg bg-white focus-within:border-brand-dark-blue focus-within:ring-2 focus-within:ring-brand-light-blue/20">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
    );
  }
);

StripeCardElement.displayName = "StripeCardElement";

export default StripeCardElement;
