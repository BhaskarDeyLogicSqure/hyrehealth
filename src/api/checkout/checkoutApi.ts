import apiService, { ApiResponse } from "..";
import {
  ORDER_CHECKOUT_ENDPOINT,
  PAYMENT_INVOICE_STATUS_ENDPOINT,
  SIGN_UP_WITH_PAYMENT_ENDPOINT,
  STRIPE_CREATE_INTENT_ENDPOINT,
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
    // Mechanism B (allowPatientSelectDosage = false) enrichment: the medication is
    // charged later, so the invoice surfaces the deferred-charge state here.
    mechanism?: "old" | "new";
    medicineChargeStatus?: "pending" | "processing" | "charged" | "failed";
    medicineChargeAmount?: number;
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

/** POST /payment/stripe/create-intent — Connect direct-charge PaymentIntent. */
export interface StripeIntentData {
  clientSecret?: string;
  /** The merchant's connected account id — required to init Stripe.js. */
  stripeAccountId?: string;
  /** Amount actually charged now (cents). For Mechanism B this is the flat consult fee. */
  amount?: number;
  currency?: string;
}

export interface CreateStripeIntentResponse {
  error?: boolean;
  message?: string;
  data?: StripeIntentData;
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

  /**
   * Create a Stripe PaymentIntent for a pending payment (Step 4, Stripe path).
   * Returns the clientSecret + connected-account id the frontend needs to confirm.
   */
  createStripeIntent: async (
    referenceId: string,
  ): Promise<StripeIntentData> => {
    if (!referenceId?.trim()) {
      throw new Error("Reference ID is required");
    }

    const response = await apiService.post<CreateStripeIntentResponse>(
      `${BASE_URL}${STRIPE_CREATE_INTENT_ENDPOINT.endpoint}`,
      { referenceId },
    );

    // apiService.post wraps the raw body: response.data is the BE envelope.
    const body = response?.data;
    if (body?.error) {
      throw new Error(body?.message || "Could not initiate payment. Please try again.");
    }

    const intent = body?.data;
    if (!intent?.clientSecret || !intent?.stripeAccountId) {
      throw new Error("Could not initiate payment. Please try again.");
    }

    return intent;
  },

  getInvoiceStatus: async (
    referenceId: string,
  ): Promise<InvoiceStatusApiResponse> => {
    if (!referenceId?.trim()) {
      throw new Error("Reference ID is required");
    }

    const response = await apiService.get<InvoiceStatusApiResponse>(
      `${BASE_URL}${PAYMENT_INVOICE_STATUS_ENDPOINT.endpoint}/${encodeURIComponent(referenceId)}`,
    );

    if (response?.error) {
      throw new Error(response?.message || "Failed to get invoice status");
    }

    return response;
  },
};
