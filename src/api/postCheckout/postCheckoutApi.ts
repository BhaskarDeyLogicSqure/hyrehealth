import apiService from "@/api";
import {
  INTAKE_FORM_QUESTIONS_ENDPOINT,
  ORDER_CONFIRMATION_DETAILS_ENDPOINT,
} from "@/api-helper/ChekoutEndpoints";

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

// Intake form questions response interface
export interface IntakeFormQuestionsResponse {
  status: boolean;
  data: Array<{
    _id: string;
    title: string;
    description: string;
    merchantSpecific: boolean;
    merchant: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    status: string;
    question: {
      _id: string;
      questionText: string;
      questionType: string;
      options: Array<Record<string, any>>;
      validationRules: Record<string, any>;
      helpText: string;
    };
    isRequired: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export const postCheckoutApi = {
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

  // get intake form questions
  getIntakeFormQuestions: async (): Promise<IntakeFormQuestionsResponse> => {
    try {
      const response = await apiService.get<IntakeFormQuestionsResponse>(
        `${INTAKE_FORM_QUESTIONS_ENDPOINT.endpoint}`
      );
      return {
        data: response?.data,
        status: response?.status,
      };
    } catch (error) {
      console.error("Intake form questions API error:", error);
      throw error;
    }
  },
};
