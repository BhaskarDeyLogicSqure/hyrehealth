import React, { useState, useRef } from "react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cardPaymentService } from "../../services/card-payment-service";
import StripeCardElement from "./StripeCardElement";
import { Card, PaymentDetails, PaymentResult } from "../../types/payment";

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_KEY || "");

type CardPaymentStep =
  | "card-selection"
  | "processing"
  | "3ds-auth"
  | "success"
  | "error";

interface CardPaymentComponentProps {
  userToken: string;
  paymentDetails: PaymentDetails;
  onPaymentSuccess: (result: PaymentResult) => void;
  onCancel: () => void;
}

// Inner component that has access to Stripe context
const CardPaymentFlow: React.FC<CardPaymentComponentProps> = ({
  userToken,
  paymentDetails,
  onPaymentSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] =
    useState<CardPaymentStep>("card-selection");
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isCardValid, setIsCardValid] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const stripeElementRef = useRef<{ createToken: () => void } | null>(null);
  const stripe = useStripe();

  // Load saved cards on component mount
  React.useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const response = await cardPaymentService.fetchAllCards(userToken);
        if (response.success && response.data) {
          setSavedCards(response.data.cards);
        }
      } catch (error) {
        console.error("Error fetching saved cards:", error);
        // Continue to new card flow if fetching fails
      }
    };

    if (userToken) {
      fetchSavedCards();
    }
  }, [userToken]);

  const handleProcessPayment = async () => {
    if (selectedCard) {
      // Use existing card
      await processPaymentWithExistingCard();
    } else {
      // For new card entry, trigger Stripe token creation
      if (stripeElementRef.current) {
        stripeElementRef.current.createToken();
      }
    }
  };

  const processPaymentWithExistingCard = async () => {
    if (!selectedCard) return;

    try {
      setLoading(true);
      setCurrentStep("processing");

      // Create payment intent
      const intentResponse = await cardPaymentService.createPaymentIntent(
        userToken,
        paymentDetails.amount,
        paymentDetails.currency
      );

      if (!intentResponse.success || !intentResponse.clientSecret) {
        throw new Error(
          intentResponse.message || "Failed to create payment intent"
        );
      }

      const { clientSecret: newClientSecret } = intentResponse;
      setClientSecret(newClientSecret);

      // Confirm payment intent with existing card
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      setCurrentStep("3ds-auth");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        newClientSecret,
        {
          payment_method: selectedCard.id,
        }
      );

      if (error) {
        throw new Error(error.message || "Payment confirmation failed");
      }

      if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          setPaymentId(paymentIntent.id);
          setCurrentStep("success");
          toast.success("Payment processed successfully!");
          onPaymentSuccess({
            success: true,
            paymentId: paymentIntent.id,
            method: "card",
          });
        } else if (paymentIntent.status === "requires_action") {
          // Handle additional authentication if needed
          const { error: authError } = await stripe.confirmCardPayment(
            newClientSecret
          );
          if (authError) {
            throw new Error(authError.message || "Authentication failed");
          } else {
            setPaymentId(paymentIntent.id);
            setCurrentStep("success");
            toast.success("Payment processed successfully!");
            onPaymentSuccess({
              success: true,
              paymentId: paymentIntent.id,
              method: "card",
            });
          }
        } else {
          throw new Error(
            `Payment failed with status: ${paymentIntent.status}`
          );
        }
      }
    } catch (error: unknown) {
      console.error("Error processing payment with existing card:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.";
      toast.error(errorMessage);
      setCurrentStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCardAdded = async (payload: { token: { id: string } }) => {
    try {
      setLoading(true);
      setCurrentStep("processing");

      // Step 1: Add the card
      const addCardResponse = await cardPaymentService.addCard(userToken, {
        token: payload.token.id,
      });

      if (!addCardResponse.success || !addCardResponse.data) {
        throw new Error(addCardResponse.message || "Failed to save card");
      }

      const savedCard = addCardResponse.data;

      // Step 2: Make the card default
      await cardPaymentService.makeCardDefault(userToken, savedCard.id);

      // Step 3: Create payment intent
      const intentResponse = await cardPaymentService.createPaymentIntent(
        userToken,
        paymentDetails.amount,
        paymentDetails.currency
      );

      if (!intentResponse.success || !intentResponse.clientSecret) {
        throw new Error(
          intentResponse.message || "Failed to create payment intent"
        );
      }

      const { clientSecret: newClientSecret } = intentResponse;
      setClientSecret(newClientSecret);

      // Step 4: Confirm payment intent (this may trigger 3DS)
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      setCurrentStep("3ds-auth");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        newClientSecret,
        {
          payment_method: savedCard.id,
        }
      );

      if (error) {
        throw new Error(error.message || "Payment confirmation failed");
      }

      if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          setPaymentId(paymentIntent.id);
          setCurrentStep("success");
          toast.success("Payment processed successfully!");
          onPaymentSuccess({
            success: true,
            paymentId: paymentIntent.id,
            method: "card",
          });
        } else if (paymentIntent.status === "requires_action") {
          // Handle additional authentication if needed
          const { error: authError } = await stripe.confirmCardPayment(
            newClientSecret
          );
          if (authError) {
            throw new Error(authError.message || "Authentication failed");
          } else {
            setPaymentId(paymentIntent.id);
            setCurrentStep("success");
            toast.success("Payment processed successfully!");
            onPaymentSuccess({
              success: true,
              paymentId: paymentIntent.id,
              method: "card",
            });
          }
        } else {
          throw new Error(
            `Payment failed with status: ${paymentIntent.status}`
          );
        }
      }
    } catch (error: unknown) {
      console.error("Error processing payment with new card:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.";
      toast.error(errorMessage);
      setCurrentStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeError = (error: { message?: string }) => {
    setLoading(false);
    setIsCardValid(false);
    console.error("Stripe error:", error);
    toast.error(error.message || "Card validation error");
  };

  const handleCardChange = (isValid: boolean) => {
    setIsCardValid(isValid);
  };

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  const handleStartOver = () => {
    setCurrentStep("card-selection");
    setPaymentId(null);
    setClientSecret(null);
    setIsCardValid(false);
    setSelectedCard(null);
    setShowNewCardForm(false);
  };

  // Render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "card-selection":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Payment Method
              </h3>

              {/* Payment amount display */}
              <div className="bg-brand-light-blue/10 border border-brand-light-blue/20 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Amount to be charged:</span>
                  <span className="text-xl font-bold text-brand-dark-blue">
                    ${paymentDetails.amount.toFixed(2)}{" "}
                    {paymentDetails.currency.toUpperCase()}
                  </span>
                </div>
                {paymentDetails.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {paymentDetails.description}
                  </p>
                )}
              </div>

              {/* Saved cards */}
              {savedCards.length > 0 && !showNewCardForm && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Saved Cards</h4>
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedCard?.id === card.id
                          ? "border-brand-dark-blue bg-brand-light-blue/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {card.brand === "visa" && "💳"}
                            {card.brand === "mastercard" && "💳"}
                            {card.brand === "amex" && "💳"}
                            {!["visa", "mastercard", "amex"].includes(
                              card.brand
                            ) && "💳"}
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {card.brand} •••• {card.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires{" "}
                              {card.exp_month.toString().padStart(2, "0")}/
                              {card.exp_year}
                            </p>
                          </div>
                        </div>
                        {card.isDefault && (
                          <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setShowNewCardForm(true)}
                    className="w-full"
                  >
                    + Add New Card
                  </Button>
                </div>
              )}

              {/* New card form */}
              {(showNewCardForm || savedCards.length === 0) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {savedCards.length > 0 ? "Add New Card" : "Card Details"}
                    </h4>
                    {savedCards.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewCardForm(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>

                  <StripeCardElement
                    ref={stripeElementRef}
                    onCardAdded={handleCardAdded}
                    onStripeError={handleStripeError}
                    showLoader={showLoader}
                    hideLoader={hideLoader}
                    onCardChange={handleCardChange}
                  />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleProcessPayment}
                disabled={loading || (!selectedCard && !isCardValid)}
                className="flex-1"
              >
                {loading
                  ? "Processing..."
                  : `Pay $${paymentDetails.amount.toFixed(2)}`}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark-blue mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Payment
            </h3>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
          </div>
        );

      case "3ds-auth":
        return (
          <div className="text-center py-8">
            <div className="text-brand-dark-blue mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 8a6 6 0 01-7.743 5.743L10 14l-2 2-2-2-2-2 2-2 2 2 .257-.257A6 6 0 118 2v2a4 4 0 100 8 4 4 0 01-1.414-7.414l.707.707A3 3 0 108 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Authenticating Payment
            </h3>
            <p className="text-gray-600">
              Please complete the authentication process in the popup window.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <div className="text-green-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully.
            </p>
            {paymentId && (
              <div className="bg-green-50 rounded-lg p-4 text-sm">
                <p className="text-gray-700">
                  <strong>Payment ID:</strong> {paymentId}
                </p>
                <p className="text-gray-700">
                  <strong>Amount:</strong> ${paymentDetails.amount.toFixed(2)}{" "}
                  {paymentDetails.currency.toUpperCase()}
                </p>
              </div>
            )}
          </div>
        );

      case "error":
        return (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Failed
            </h3>
            <p className="text-gray-600 mb-6">
              There was an error processing your payment. Please try again.
            </p>
            <div className="flex space-x-3 justify-center">
              <Button onClick={handleStartOver}>Try Again</Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {renderStepContent()}
    </div>
  );
};

// Main component wrapper with Stripe Elements
const CardPaymentComponent: React.FC<CardPaymentComponentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CardPaymentFlow {...props} />
    </Elements>
  );
};

export default CardPaymentComponent;
