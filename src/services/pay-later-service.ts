import { BASE_URL, X_API_KEY } from "../configs";
import { ApiResponse, PayLaterRequest, PayLaterResponse } from "../types/payment";

export class PayLaterService {
  private baseHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(X_API_KEY && { "x-API-key": X_API_KEY }),
  };

  /**
   * Create a pay later request
   */
  async createPayLaterRequest(
    userToken: string,
    payLaterDetails: PayLaterRequest
  ): Promise<ApiResponse<PayLaterResponse>> {
    try {
      const response = await fetch(`${BASE_URL}/user/pay-later`, {
        method: "POST",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payLaterDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PayLaterResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create pay later request");
      }

      return result;
    } catch (error) {
      console.error("Error creating pay later request:", error);
      throw error;
    }
  }

  /**
   * Get user's pay later requests
   */
  async getPayLaterRequests(
    userToken: string
  ): Promise<ApiResponse<PayLaterResponse[]>> {
    try {
      const response = await fetch(`${BASE_URL}/user/pay-later`, {
        method: "GET",
        headers: {
          ...this.baseHeaders,
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PayLaterResponse[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch pay later requests");
      }

      return result;
    } catch (error) {
      console.error("Error fetching pay later requests:", error);
      throw error;
    }
  }

  /**
   * Cancel a pay later request
   */
  async cancelPayLaterRequest(
    userToken: string,
    paymentId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${BASE_URL}/user/pay-later/${paymentId}`, {
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
        throw new Error(result.message || "Failed to cancel pay later request");
      }

      return result;
    } catch (error) {
      console.error("Error canceling pay later request:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const payLaterService = new PayLaterService(); 