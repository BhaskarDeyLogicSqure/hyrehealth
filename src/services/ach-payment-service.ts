import { BASE_URL, X_API_KEY } from "../configs";
import { 
  ApiResponse, 
  AchAccountDetails, 
  AchTokenRequest, 
  AchTokenResponse, 
  BankAccount, 
  AchPaymentRequest, 
  AchPaymentResponse,
  AccountType 
} from "../types/payment";

// ACH Account Verification Types
export interface AchVerificationResponse {
  verified: boolean;
  accountId: string;
  maskedAccountNumber: string;
  accountHolderType: AccountType;
  institutionName?: string;
}

// Micro-deposit verification
export interface MicroDepositVerificationRequest {
  bankAccountId: string;
  amounts: number[];
}

export class AchPaymentService {
  private baseHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(X_API_KEY && { "x-API-key": X_API_KEY }),
  };

  /**
   * Get user's bank accounts
   */
  async getUserBankAccounts(
    userToken: string
  ): Promise<ApiResponse<BankAccount[]>> {
    try {
      const response = await fetch(`${BASE_URL}/user/ach/accounts`, {
        method: "GET",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<BankAccount[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch bank accounts");
      }

      return result;
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw error;
    }
  }

  /**
   * Step A: Generate ACH Token for user's ACH session
   */
  async generateAchToken(
    userToken: string,
    tokenRequest: AchTokenRequest
  ): Promise<ApiResponse<AchTokenResponse>> {
    try {
      const response = await fetch(`${BASE_URL}/user/ach/token`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(tokenRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AchTokenResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to generate ACH token");
      }

      return result;
    } catch (error) {
      console.error("Error generating ACH token:", error);
      throw error;
    }
  }

  /**
   * Step B: Verify micro-deposits
   */
  async verifyMicroDeposits(
    userToken: string,
    verificationRequest: MicroDepositVerificationRequest
  ): Promise<ApiResponse<AchVerificationResponse>> {
    try {
      const response = await fetch(`${BASE_URL}/user/ach/verify-deposits`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(verificationRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AchVerificationResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to verify micro-deposits");
      }

      return result;
    } catch (error) {
      console.error("Error verifying micro-deposits:", error);
      throw error;
    }
  }

  /**
   * Step C: Process ACH Payment
   */
  async processAchPayment(
    userToken: string,
    paymentDetails: AchPaymentRequest
  ): Promise<ApiResponse<AchPaymentResponse>> {
    try {
      const response = await fetch(`${BASE_URL}/user/ach/payment`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AchPaymentResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to process ACH payment");
      }

      return result;
    } catch (error) {
      console.error("Error processing ACH payment:", error);
      throw error;
    }
  }

  /**
   * Delete a bank account
   */
  async deleteBankAccount(
    userToken: string,
    accountId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${BASE_URL}/user/ach/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<void> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete bank account");
      }

      return result;
    } catch (error) {
      console.error("Error deleting bank account:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const achPaymentService = new AchPaymentService(); 