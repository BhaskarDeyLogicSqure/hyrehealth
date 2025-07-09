import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { payLaterService } from "../../services/pay-later-service";
import { PaymentDetails, PaymentResult } from "../../types/payment";
import { Calendar, Clock, DollarSign } from "lucide-react";

type PayLaterStep = "details" | "processing" | "success" | "error";

interface PayLaterComponentProps {
  userToken: string;
  paymentDetails: PaymentDetails;
  onPaymentSuccess: (result: PaymentResult) => void;
  onCancel: () => void;
}

const PayLaterComponent: React.FC<PayLaterComponentProps> = ({
  userToken,
  paymentDetails,
  onPaymentSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<PayLaterStep>("details");
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  // Calculate minimum due date (7 days from now)
  const getMinDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  };

  // Calculate maximum due date (90 days from now)
  const getMaxDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 90);
    return date.toISOString().split("T")[0];
  };

  const handleSubmitPayLater = async () => {
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    const selectedDate = new Date(dueDate);
    const minDate = new Date(getMinDueDate());
    const maxDate = new Date(getMaxDueDate());

    if (selectedDate < minDate) {
      toast.error("Due date must be at least 7 days from today");
      return;
    }

    if (selectedDate > maxDate) {
      toast.error("Due date cannot be more than 90 days from today");
      return;
    }

    setLoading(true);
    setCurrentStep("processing");

    try {
      const payLaterRequest = {
        amount: paymentDetails.amount,
        dueDate: dueDate,
        description:
          description || paymentDetails.description || "Payment deferred",
      };

      const response = await payLaterService.createPayLaterRequest(
        userToken,
        payLaterRequest
      );

      if (response.success && response.data) {
        setPaymentId(response.data.paymentId);
        setCurrentStep("success");
        toast.success("Pay later request created successfully!");
        onPaymentSuccess({
          success: true,
          paymentId: response.data.paymentId,
          method: "pay_later",
        });
      } else {
        throw new Error(
          response.message || "Failed to create pay later request"
        );
      }
    } catch (error: unknown) {
      console.error("Pay later error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create pay later request. Please try again.";
      toast.error(errorMessage);
      setCurrentStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep("details");
    setPaymentId(null);
    setDueDate("");
    setDescription("");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "details":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pay Later Options
              </h3>

              {/* Payment amount display */}
              <div className="bg-brand-light-blue/10 border border-brand-light-blue/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-brand-dark-blue" />
                    <span className="text-gray-700">Amount to defer:</span>
                  </div>
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

              {/* Pay later info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Pay Later Information
                    </h4>
                    <div className="text-sm text-yellow-700 mt-1 space-y-1">
                      <p>• You can defer this payment for up to 90 days</p>
                      <p>
                        • A payment reminder will be sent 3 days before the due
                        date
                      </p>
                      <p>
                        • Late fees may apply if payment is not received by the
                        due date
                      </p>
                      <p>• You can pay early at any time from your dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="dueDate"
                    className="flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Payment Due Date</span>
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={getMinDueDate()}
                    max={getMaxDueDate()}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a date between{" "}
                    {new Date(getMinDueDate()).toLocaleDateString()} and{" "}
                    {new Date(getMaxDueDate()).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any additional notes about this payment deferral..."
                    rows={3}
                    maxLength={500}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Terms & Conditions
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    • By selecting "Pay Later", you agree to pay the full amount
                    by the selected due date
                  </p>
                  <p>
                    • Late fees of 1.5% per month may be applied to overdue
                    payments
                  </p>
                  <p>
                    • You will receive email reminders before the payment due
                    date
                  </p>
                  <p>
                    • Payment can be made early at any time through your account
                    dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSubmitPayLater}
                disabled={loading || !dueDate}
                className="flex-1"
              >
                {loading ? "Creating Request..." : "Confirm Pay Later"}
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
              Creating Pay Later Request
            </h3>
            <p className="text-gray-600">
              Please wait while we process your request...
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
              Pay Later Request Created!
            </h3>
            <p className="text-gray-600 mb-4">
              Your payment has been deferred successfully. You will receive a
              reminder before the due date.
            </p>
            {paymentId && (
              <div className="bg-green-50 rounded-lg p-4 text-sm space-y-2">
                <p className="text-gray-700">
                  <strong>Request ID:</strong> {paymentId}
                </p>
                <p className="text-gray-700">
                  <strong>Amount:</strong> ${paymentDetails.amount.toFixed(2)}{" "}
                  {paymentDetails.currency.toUpperCase()}
                </p>
                <p className="text-gray-700">
                  <strong>Due Date:</strong>{" "}
                  {new Date(dueDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> Pending Payment
                </p>
              </div>
            )}
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                You can view and manage your deferred payments in your account
                dashboard.
              </p>
            </div>
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
              Request Failed
            </h3>
            <p className="text-gray-600 mb-6">
              There was an error creating your pay later request. Please try
              again.
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

export default PayLaterComponent;
