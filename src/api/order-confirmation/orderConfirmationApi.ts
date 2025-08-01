import apiService from "@/api";
import { ORDER_CONFIRMATION_DETAILS_ENDPOINT } from "@/api-helper/ChekoutEndpoints";

// Order confirmation response interface
export interface OrderConfirmationResponse {
  status: boolean;
  data: {
    invoiceNumber: string;
    products: Array<{
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    pricing: {
      subtotal: number;
      shippingCost: number;
      tax: number;
      discount: number;
      total: number;
      currency: string;
    };
  };
}

// Order confirmation payload interface
export interface OrderConfirmationPayload {
  orderId: string;
}

export const orderConfirmationApi = {
  // Get order confirmation details
  getOrderConfirmation: async (
    orderId: string
  ): Promise<OrderConfirmationResponse> => {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const response = await apiService.get<OrderConfirmationResponse>(
        `${ORDER_CONFIRMATION_DETAILS_ENDPOINT.endpoint}/${orderId}`
      );

      return {
        data: response?.data,
        status: response?.status,
      };
    } catch (error) {
      console.error("Order confirmation API error:", error);
      throw error;
    }
  },
};
