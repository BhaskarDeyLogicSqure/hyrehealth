import apiService, { ApiResponse } from "..";
import {
  INVOICE_STATUS_ENDPOINT,
  ORDER_CHECKOUT_ENDPOINT,
  PAYMENT_COMPLETE_ENDPOINT,
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

/** GET /signup-with-payment/invoice-status/:referenceId */
export interface InvoiceStatusNestedData {
  payment?: {
    _id?: string;
    paymentNumber?: string;
    status?: string;
    amount?: number;
    transactionId?: string;
  };
  invoice?: {
    _id?: string;
    invoiceNumber?: string;
    status?: string;
    total?: number;
    paidDate?: string;
  };
  subscriptions?: unknown[];
  consultations?: unknown[];
  token?: string;
}

export interface InvoiceStatusApiResponse {
  error?: boolean;
  message?: string;
  data?: {
    status?: string;
    data?: InvoiceStatusNestedData;
  };
}

export interface InitiateBraintreeCheckoutResponse {
  error?: boolean;
  message?: string;
  data?: {
    referenceId?: string;
    clientToken?: string;
  };
}

export interface CompletePaymentPayload {
  referenceId: string;
  paymentMethodNonce: string;
  deviceData?: string;
}

export interface CompletePaymentResponse {
  error?: boolean;
  message?: string;
  data?: {
    token?: string;
    payment?: { _id?: string; amount?: number; status?: string };
    invoice?: { _id?: string; invoiceNumber?: string; status?: string };
    subscriptions?: unknown[];
    consultations?: unknown[];
  };
}

export const checkoutApi = {
  signUpWithPayment: async (
    payload: CheckoutPayload,
  ): Promise<CheckoutResponse> => {
    try {
      if (!payload) {
        throw new Error("Checkout payload is required");
      }

      const response = await apiService.post<CheckoutResponse>(
        `${BASE_URL}${SIGN_UP_WITH_PAYMENT_ENDPOINT?.endpoint}`,
        payload,
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
    payload: CheckoutPayload,
  ): Promise<CheckoutResponse> => {
    try {
      if (!payload) {
        throw new Error("Checkout payload is required");
      }

      const response = await apiService.post<CheckoutResponse>(
        `${BASE_URL}${ORDER_CHECKOUT_ENDPOINT?.endpoint}`,
        payload,
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
      payload,
    );

    return response;
  },

  getInvoiceStatus: async (
    referenceId: string,
  ): Promise<InvoiceStatusApiResponse> => {
    if (!referenceId?.trim()) {
      throw new Error("Reference ID is required");
    }

    const response = await apiService.get<InvoiceStatusApiResponse>(
      `${BASE_URL}${INVOICE_STATUS_ENDPOINT.endpoint}/${encodeURIComponent(referenceId)}`,
    );

    if (response?.error) {
      throw new Error(response?.message || "Failed to get invoice status");
    }

    return response;
  },

  completePayment: async (
    payload: CompletePaymentPayload,
  ): Promise<CompletePaymentResponse> => {
    if (!payload?.referenceId?.trim()) {
      throw new Error("Reference ID is required");
    }
    if (!payload?.paymentMethodNonce?.trim()) {
      throw new Error("Payment method nonce is required");
    }

    const response = await apiService.post<CompletePaymentResponse>(
      `${BASE_URL}${PAYMENT_COMPLETE_ENDPOINT.endpoint}`,
      payload,
    );

    if (response?.data?.error) {
      throw new Error(
        response?.data?.message || "Could not complete payment. Please try again."
      );
    }

    return response?.data;
  },

  // /**
  //  * Initiate Braintree checkout.
  //  * POST /payment/products
  //  *
  //  * Expected envelope:
  //  * { error: false, data: { referenceId, clientToken } }
  //  */
  // initiateBraintreeCheckout: async (
  //   payload: CheckoutPayload,
  // ): Promise<InitiateBraintreeCheckoutResponse> => {
  //   if (!payload) {
  //     throw new Error("Checkout payload is required");
  //   }

  //   const response = await apiService.post<InitiateBraintreeCheckoutResponse>(
  //     `${BASE_URL}${ORDER_CHECKOUT_ENDPOINT.endpoint}`,
  //     payload,
  //   );

  //   if (response?.error) {
  //     throw new Error(response?.message || "Failed to initiate checkout");
  //   }

  //   return response?.data;
  // },
};
