import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { achPaymentService } from "../../services/ach-payment-service";
import {
  BankAccount,
  AchAccountDetails,
  AccountType,
  PaymentDetails,
  PaymentResult,
} from "../../types/payment";
import { DIGITS_AFTER_DECIMALS } from "@/configs";

type AchPaymentStep =
  | "account-selection"
  | "account-details"
  | "micro-deposit-verification"
  | "processing"
  | "success"
  | "error";

interface AchPaymentComponentProps {
  userToken: string;
  paymentDetails: PaymentDetails;
  onPaymentSuccess: (result: PaymentResult) => void;
  onCancel: () => void;
}

const AchPaymentComponent: React.FC<AchPaymentComponentProps> = ({
  userToken,
  paymentDetails,
  onPaymentSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] =
    useState<AchPaymentStep>("account-selection");
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );
  const [fetchingAccounts, setFetchingAccounts] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [newBankAccountId, setNewBankAccountId] = useState<string | null>(null);
  const [microDepositAmounts, setMicroDepositAmounts] = useState<{
    amount1: string;
    amount2: string;
  }>({ amount1: "", amount2: "" });

  // Form state for account details
  const [accountDetails, setAccountDetails] = useState<AchAccountDetails>({
    routingNumber: "",
    accountNumber: "",
    accountHolderType: AccountType.INDIVIDUAL,
    accountHolderName: "",
  });

  // Fetch existing bank accounts on component mount
  useEffect(() => {
    const fetchBankAccounts = async () => {
      setFetchingAccounts(true);
      try {
        const response = await achPaymentService.getUserBankAccounts(userToken);
        if (response.success && response.data) {
          setBankAccounts(response.data);
        }
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
        // Don't show error toast, just continue to add new account flow
      } finally {
        setFetchingAccounts(false);
      }
    };

    if (userToken) {
      fetchBankAccounts();
    }
  }, [userToken]);

  // Handle selecting an existing account
  const handleSelectExistingAccount = (account: BankAccount) => {
    setSelectedAccount(account);

    if (account.status === "verified") {
      // Skip verification step for already verified accounts
      processPayment(account.id);
    } else {
      // For unverified accounts, go to micro-deposit verification
      setNewBankAccountId(account.id);
      setAccountDetails({
        routingNumber: account.routing_number,
        accountNumber: `****${account.last4}`,
        accountHolderType: account.account_holder_type,
        accountHolderName: account.account_holder_name,
      });
      setCurrentStep("micro-deposit-verification");
      toast.success("Please verify your bank account with micro-deposits.");
    }
  };

  // Handle adding new account
  const handleAddNewAccount = () => {
    setSelectedAccount(null);
    setCurrentStep("account-details");
  };

  // Form validation
  const isFormValid = () => {
    return (
      accountDetails.routingNumber.length === 9 &&
      accountDetails.accountNumber.length >= 4 &&
      accountDetails.accountHolderName.trim().length > 0
    );
  };

  // Step A: Add bank account (generate ACH token)
  const handleAddBankAccount = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      // Generate ACH token with account details (this adds the bank account)
      const tokenRequest = {
        accountName: accountDetails.accountHolderName,
        routingNumber: accountDetails.routingNumber,
        accountNumber: accountDetails.accountNumber,
        accountHolderType: accountDetails.accountHolderType,
        accountType: "Checking",
      };

      const tokenResponse = await achPaymentService.generateAchToken(
        userToken,
        tokenRequest
      );

      if (tokenResponse.success && tokenResponse.data) {
        // Store the bank account ID for verification step
        setNewBankAccountId(tokenResponse.data.sessionId);
        setCurrentStep("micro-deposit-verification");
        toast.success("Bank account added! Please verify with micro-deposits.");
      } else {
        throw new Error(tokenResponse.message || "Failed to add bank account");
      }
    } catch (error: unknown) {
      console.error("Add bank account error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add bank account. Please check your details.";
      toast.error(errorMessage);
      setCurrentStep("error");
    } finally {
      setLoading(false);
    }
  };

  // Step B: Verify micro-deposits
  const handleVerifyMicroDeposits = async () => {
    if (!newBankAccountId || !userToken) {
      toast.error("Missing bank account information");
      return;
    }

    const amount1 = parseFloat(microDepositAmounts.amount1);
    const amount2 = parseFloat(microDepositAmounts.amount2);

    if (isNaN(amount1) || isNaN(amount2) || amount1 <= 0 || amount2 <= 0) {
      toast.error("Please enter valid deposit amounts");
      return;
    }

    setLoading(true);
    try {
      const verificationRequest = {
        bankAccountId: newBankAccountId,
        amounts: [amount1, amount2],
      };

      const verificationResponse = await achPaymentService.verifyMicroDeposits(
        userToken,
        verificationRequest
      );

      if (verificationResponse.success && verificationResponse.data) {
        toast.success("Bank account verified successfully!");
        // Process payment with verified account
        processPayment(newBankAccountId);
      } else {
        throw new Error(
          verificationResponse.message || "Failed to verify micro-deposits"
        );
      }
    } catch (error: unknown) {
      console.error("Micro-deposit verification error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to verify micro-deposits. Please check the amounts and try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step C: Process the final payment
  const processPayment = async (accountId: string) => {
    setLoading(true);
    setCurrentStep("processing");

    try {
      const paymentResponse = await achPaymentService.processAchPayment(
        userToken,
        {
          amount: paymentDetails.amount,
        }
      );

      if (paymentResponse.success && paymentResponse.data) {
        setPaymentId(paymentResponse.data.paymentId);
        setCurrentStep("success");
        toast.success("Payment processed successfully!");
        onPaymentSuccess({
          success: true,
          paymentId: paymentResponse.data.paymentId,
          method: "ach",
        });
      } else {
        throw new Error(paymentResponse.message || "Payment processing failed");
      }
    } catch (error: unknown) {
      console.error("Payment processing error:", error);
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

  // Reset to start over
  const handleStartOver = () => {
    setCurrentStep("account-selection");
    setPaymentId(null);
    setSelectedAccount(null);
    setNewBankAccountId(null);
    setMicroDepositAmounts({ amount1: "", amount2: "" });
    setAccountDetails({
      routingNumber: "",
      accountNumber: "",
      accountHolderType: AccountType.INDIVIDUAL,
      accountHolderName: "",
    });
  };

  // Navigation helpers
  const goToAccountSelection = () => {
    setCurrentStep("account-selection");
    setSelectedAccount(null);
  };

  const goToAccountDetails = () => {
    setCurrentStep("account-details");
  };

  // Render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "account-selection":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ACH Bank Transfer
              </h3>

              {/* Payment amount display */}
              <div className="bg-brand-light-blue/10 border border-brand-light-blue/20 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Amount to be charged:</span>
                  <span className="text-xl font-bold text-brand-dark-blue">
                    ${paymentDetails.amount.toFixed(DIGITS_AFTER_DECIMALS)}{" "}
                    {paymentDetails.currency.toUpperCase()}
                  </span>
                </div>
                {paymentDetails.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {paymentDetails.description}
                  </p>
                )}
              </div>

              {fetchingAccounts ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark-blue mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading bank accounts...</p>
                </div>
              ) : (
                <>
                  {/* Existing bank accounts */}
                  {bankAccounts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Saved Bank Accounts
                      </h4>
                      {bankAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="border rounded-lg p-4 cursor-pointer hover:border-gray-300 transition-colors"
                          onClick={() => handleSelectExistingAccount(account)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-lg">🏦</div>
                              <div>
                                <p className="font-medium">
                                  {account.bank_name} •••• {account.last4}
                                </p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {account.account_holder_type} •{" "}
                                  {account.account_type || "Checking"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  account.status === "verified"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {account.status === "verified"
                                  ? "Verified"
                                  : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new account button */}
                  <Button
                    onClick={handleAddNewAccount}
                    variant={bankAccounts.length > 0 ? "outline" : "default"}
                    className="w-full"
                  >
                    + Add New Bank Account
                  </Button>
                </>
              )}
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        );

      case "account-details":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Bank Account
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    type="text"
                    value={accountDetails.accountHolderName}
                    onChange={(e) =>
                      setAccountDetails((prev) => ({
                        ...prev,
                        accountHolderName: e.target.value,
                      }))
                    }
                    placeholder="Enter full name as it appears on account"
                  />
                </div>

                <div>
                  <Label htmlFor="accountHolderType">Account Type</Label>
                  <Select
                    value={accountDetails.accountHolderType}
                    onValueChange={(value: AccountType) =>
                      setAccountDetails((prev) => ({
                        ...prev,
                        accountHolderType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AccountType.INDIVIDUAL}>
                        Individual
                      </SelectItem>
                      <SelectItem value={AccountType.COMPANY}>
                        Company
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    type="text"
                    value={accountDetails.routingNumber}
                    onChange={(e) =>
                      setAccountDetails((prev) => ({
                        ...prev,
                        routingNumber: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 9),
                      }))
                    }
                    placeholder="9-digit routing number"
                    maxLength={9}
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={accountDetails.accountNumber}
                    onChange={(e) =>
                      setAccountDetails((prev) => ({
                        ...prev,
                        accountNumber: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="Enter account number"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleAddBankAccount}
                disabled={loading || !isFormValid()}
                className="flex-1"
              >
                {loading ? "Adding Account..." : "Add Account"}
              </Button>
              <Button
                variant="outline"
                onClick={
                  bankAccounts.length > 0 ? goToAccountSelection : onCancel
                }
              >
                {bankAccounts.length > 0 ? "Back" : "Cancel"}
              </Button>
            </div>
          </div>
        );

      case "micro-deposit-verification":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verify Bank Account
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">
                      Micro-deposit Verification Required
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      We've sent two small deposits (less than $1.00 each) to
                      your bank account. Please check your account and enter the
                      exact amounts below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Bank Account</Label>
                  <div className="text-sm text-gray-600">
                    {accountDetails.accountHolderName} • ••••{" "}
                    {accountDetails.accountNumber.slice(-4)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount1">First Deposit Amount</Label>
                    <Input
                      id="amount1"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={microDepositAmounts.amount1}
                      onChange={(e) =>
                        setMicroDepositAmounts((prev) => ({
                          ...prev,
                          amount1: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount2">Second Deposit Amount</Label>
                    <Input
                      id="amount2"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={microDepositAmounts.amount2}
                      onChange={(e) =>
                        setMicroDepositAmounts((prev) => ({
                          ...prev,
                          amount2: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleVerifyMicroDeposits}
                disabled={
                  loading ||
                  !microDepositAmounts.amount1 ||
                  !microDepositAmounts.amount2
                }
                className="flex-1"
              >
                {loading ? "Verifying..." : "Verify Deposits"}
              </Button>
              <Button variant="outline" onClick={goToAccountDetails}>
                Back
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark-blue mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing ACH Payment
            </h3>
            <p className="text-gray-600">
              Please wait while we process your bank transfer...
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
              Payment Submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Your ACH payment has been submitted successfully and will be
              processed within 3-5 business days.
            </p>
            {paymentId && (
              <div className="bg-green-50 rounded-lg p-4 text-sm">
                <p className="text-gray-700">
                  <strong>Payment ID:</strong> {paymentId}
                </p>
                <p className="text-gray-700">
                  <strong>Amount:</strong> $
                  {paymentDetails.amount.toFixed(DIGITS_AFTER_DECIMALS)}{" "}
                  {paymentDetails.currency.toUpperCase()}
                </p>
                <p className="text-gray-700">
                  <strong>Payment Method:</strong> ACH/Bank Transfer
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
              There was an error processing your ACH payment. Please try again.
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

export default AchPaymentComponent;
