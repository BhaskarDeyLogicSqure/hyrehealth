import apiService, { ApiResponse } from "..";
import {
  ORDER_CHECKOUT_ENDPOINT,
  SIGN_UP_WITH_PAYMENT_ENDPOINT,
  VALIDATE_COUPON_ENDPOINT,
} from "@/api-helper/ChekoutEndpoints";
import { BASE_URL } from "@/configs";

// Define proper types for checkout
interface CheckoutPayload {
  // Add specific fields based on your checkout requirements
  [key: string]: any;
}

interface CheckoutResponse {
  // Add specific fields based on your API response
  [key: string]: any;
}

export const checkoutApi = {
  signUpWithPayment: async (
    payload: CheckoutPayload
  ): Promise<CheckoutResponse> => {
    try {
      if (!payload) {
        throw new Error("Checkout payload is required");
      }

      const response = await apiService.post<CheckoutResponse>(
        `${BASE_URL}${SIGN_UP_WITH_PAYMENT_ENDPOINT?.endpoint}`,
        payload
      );

      if (response?.error) {
        throw new Error(response?.message || "Checkout failed");
      }

      return response?.data;
    } catch (error) {
      console.error("Checkout API error:", error);
      throw error;
    }
  },

  // order checkout - for login users
  orderCheckout: async (
    payload: CheckoutPayload
  ): Promise<CheckoutResponse> => {
    try {
      if (!payload) {
        throw new Error("Checkout payload is required");
      }

      const response = await apiService.post<CheckoutResponse>(
        `${BASE_URL}${ORDER_CHECKOUT_ENDPOINT?.endpoint}`,
        payload
      );

      if (response?.error) {
        throw new Error(response?.message || "Checkout failed");
      }

      return response?.data;
    } catch (error) {
      console.error("Checkout API error:", error);
      throw error;
    }
  },

  validateCoupon: async (payload: {
    couponCode: string;
    productIds: string[];
  }): Promise<ApiResponse<CheckoutResponse>> => {
    const response = await apiService.post<CheckoutResponse>(
      `${BASE_URL}${VALIDATE_COUPON_ENDPOINT?.endpoint}`,
      payload
    );

    return response;
  },
};
